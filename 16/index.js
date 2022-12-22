// @ts-check
import * as l from "lodash-es";

import { loadData, copySolution } from "../shared/index.js";
import * as globals from "../shared/globals.js";

(async () => {
  for (const [name, data] of await loadData(import.meta.url, (row) => {
    const [a, b] = row.split(";");
    let tmp = b.split("valve")[1].trim();
    if (tmp.startsWith("s")) {
      tmp = tmp.slice(2);
    }

    return {
      name: a.split(" ")[1],
      rate: Number(a.split(" ").at(-1)?.split("=")[1]),
      valves: tmp.trim().split(", "),
    };
    // return parseInt(row);

    // return row.split(" ").map(Number);
    // return row.split("").map(Number);

    // return row.split(" ");

    // const [a, b] = row.split(" ");
    // return /** @type {const} */ ([a, parseInt(b)]);
  })) {
    const isMain = name === "input.txt";
    console.log(`------------- ${name} -------------`);
    if (isMain) {
      continue;
    }

    let score = 0;
    let score2 = 0;

    const obj = Object.fromEntries(data.map((row) => [row.name, row]));

    const bfs = () => {
      const visited = new Set();
      const queue = [
        { valve: "AA", path: ["AA"], pressure: /** @type {number[]} */ ([]), timeLeft: 30 },
      ];
      let total = 0;

      let best = { item: null, score: 0 };
      const correct = [
        "AA",
        "DD",
        "CC",
        "BB",
        "AA",
        "II",
        "JJ",
        "AA",
        "DD",
        "EE",
        "FF",
        "GG",
        "HH",
      ];

      let i = 0;
      while (queue.length) {
        const tmp = queue.shift();
        if (!tmp || visited.has(tmp.valve)) {
          continue;
        }

        const t = tmp.pressure.reduce((a, b) => a + b, 0);
        if (t > best.score) {
          best.item = tmp;
          best.score = t;
        }

        console.log(tmp);
        if (tmp.timeLeft <= 0) {
          console.log("done", tmp);
          break;
        }

        if (JSON.stringify(correct.slice(0, tmp.path.length)) !== JSON.stringify(tmp.path)) {
          continue;
        }

        // visited.add(name);

        const curr = obj[tmp.valve];
        curr.valves.forEach((valve) => {
          if (tmp.path.includes(valve)) {
            return;
          }

          // move and open valve
          if (obj[valve].rate > 0) {
            queue.push({
              valve: valve,
              path: [...tmp.path, valve],
              pressure: [...tmp.pressure, (tmp.pressure.at(-1) || 0) + curr.rate],
              timeLeft: tmp.timeLeft - 2,
            });
          }

          // just move
          queue.push({
            valve: valve,
            path: [...tmp.path],
            pressure: tmp.pressure.length ? [...tmp.pressure, tmp.pressure.at(-1) || 0] : [],
            timeLeft: tmp.timeLeft - 1,
          });
        });

        i++;
        if (i > 10000) {
          console.log("Breaking");
          break;
        }

        // queue.push(...globals.orbits[name].map((name) => ({ name, depth: depth + 1 })));
      }

      console.log(best);

      return total;
    };

    bfs();

    console.log("Task1", score);
    isMain && (await copySolution(score));

    // console.log("Task2", score2);
    // isMain && (await copySolution(score2));
  }
})();
