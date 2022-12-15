// @ts-check
import * as l from "lodash-es";

import { loadData, copySolution } from "../../shared/index.js";
import * as globals from "../../shared/globals.js";

(async () => {
  for (const [name, data] of await loadData(import.meta.url, (row) => {
    const [a, b] = row.split(": closest beacon is at ");

    return {
      sensor: a
        .slice(`Sensor at `.length)
        .split(", ")
        .map((x) => x.split("=")[1])
        .map(Number)
        .map((num, index) => (index === 0 ? num + 20 : num)),
      beacon: b
        .split(", ")
        .map((x) => x.split("=")[1])
        .map(Number)
        .map((num, index) => (index === 0 ? num + 20 : num)),
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

    const maxX =
      Math.max(l.max(data.map((x) => x.sensor[0])) || 0, l.max(data.map((x) => x.beacon[0])) || 0) +
      10;
    const maxY =
      Math.max(l.max(data.map((x) => x.sensor[1])) || 0, l.max(data.map((x) => x.beacon[1])) || 0) +
      10;

    // console.log(maxX, maxY, maxX * maxY);

    const grid = {}; // l.range(0, maxY).map(() => l.range(0, maxX).map(() => "."));
    // /**
    //  * @param {[number, number]} pos
    //  */
    // const bfs = (pos, end) => {
    //   const stack = [pos];
    //   const visited = new Set();

    //   while (stack.length) {
    //     if (stack[0][0] === end[0] && stack[0][1] === end[1]) {
    //       break;
    //     }

    //     const [x, y] = stack.shift();
    //     if (visited.has(`${x}:${y}`)) {
    //       continue;
    //     }

    //     visited.add(`${x}:${y}`);
    //     console.log(x, y);
    //     grid[y][x] = "#";

    //     for (const add of [
    //       [0, 1],
    //       [0, -1],
    //       [1, 0],
    //       [-1, 0],
    //       [1, 1],
    //       [1, -1],
    //       [-1, 1],
    //       [-1, -1],
    //     ]) {
    //       const x1 = x + add[0];
    //       const y1 = y + add[1];

    //       stack.push([x1, y1]);
    //     }
    //   }
    // };

    const pos = (a, b) => `${a}:${b}`;
    const targetRow = isMain ? 2000000 : 10;

    data.forEach((item, index) => {
      // if (JSON.stringify(item.sensor) !== "[8,7]") {
      //   // return;
      // }

      console.log(Math.round((index / data.length) * 10000) / 100);

      grid[pos(item.sensor[1], item.sensor[0])] = "S";
      grid[pos(item.beacon[1], item.beacon[0])] = "B";

      const rowOffset = item.beacon[1] - item.sensor[1];
      const colOffset = item.beacon[0] - item.sensor[0];

      const allMoves = Math.abs(rowOffset) + Math.abs(colOffset);

      if (!(item.sensor[1] - allMoves < targetRow && item.sensor[1] + allMoves > targetRow)) {
        return;
      }

      for (let i = -allMoves; i <= allMoves; i++) {
        if (item.sensor[1] + i !== targetRow) {
          continue;
        }

        const count = (allMoves - Math.abs(i)) * 2 + 1;
        for (let j = 0; j < count; j++) {
          const offset = Math.floor(count / 2) - j;

          const x = item.sensor[0] + offset;
          const y = item.sensor[1] + i;

          // if (x < 0 || y < 0 || x >= maxX || y >= maxY) {
          //   continue;
          // }

          if (!grid[pos(y, x)]) {
            grid[pos(y, x)] = "#";
          }
        }
      }
    });

    let score = Object.keys(grid)
      .filter((key) => key.split(":")[0] === String(targetRow))
      .filter((key) => grid[key] === "#").length;
    let score2 = 0;

    console.log("Task1", score);
    isMain && (await copySolution(score));

    // console.log("Task2", score2);
    // isMain && (await copySolution(score2));
  }
})();
