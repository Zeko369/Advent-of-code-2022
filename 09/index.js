// @ts-check
import * as l from "lodash-es";

import { loadData, copySolution } from "../shared/index.js";
import * as globals from "../shared/globals.js";

(async () => {
  for (const [name, data] of await loadData(import.meta.url, (row) => {
    // return row;
    // return parseInt(row);

    // return row.split(" ").map(Number);
    // return row.split("").map(Number);

    // return row.split(" ");

    const [a, b] = row.split(" ");
    return /** @type {const} */ ([a, parseInt(b)]);
  })) {
    const isMain = name === "input.txt";
    console.log(`------------- ${name} -------------`);
    if (isMain) {
      // continue;
    }

    const tail = Array.from(new Array(10), () => ({ x: 1000, y: 1000 }));
    const isTouching = (t, h) => {
      return Math.abs(h.x - t.x) < 2 && Math.abs(h.y - t.y) < 2;
    };

    const move = (item, dir) => {
      switch (dir) {
        case "R":
          return item.x++;
        case "L":
          return item.x--;
        case "U":
          return item.y++;
        case "D":
          return item.y--;
      }
    };

    const part1 = new Set();
    const part2 = new Set();
    const offset = (a) => (a === 0 ? 0 : a < 0 ? -1 : 1);

    for (let ind = 0; ind < data.length; ind++) {
      const item = data[ind];
      const [dir, dist] = item;

      // console.log(item);
      for (let i = 0; i < dist; i++) {
        move(tail[0], dir);

        for (let j = 1; j < tail.length; j++) {
          if (!isTouching(tail[j], tail[j - 1])) {
            tail[j].x += offset(tail[j - 1].x - tail[j].x);
            tail[j].y += offset(tail[j - 1].y - tail[j].y);
          }
        }

        part1.add(JSON.stringify(tail[1]));
        part2.add(JSON.stringify(tail[9]));
      }
    }

    const score = part1.size;
    const score2 = part2.size;

    console.log("Task1", score);
    isMain && (await copySolution(score));

    console.log("Task2", score2);
    isMain && (await copySolution(score2));
  }
})();
