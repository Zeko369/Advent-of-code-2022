// @ts-check
import * as l from "lodash-es";

import { loadData, copySolution } from "../shared/index.js";
import * as globals from "../shared/globals.js";

(async () => {
  for (const [name, data] of await loadData(import.meta.url, (row) => {
    return row.split(" -> ").map((item) =>
      item
        .split(",")
        .map(Number)
        .map((item) => item + 1)
    );
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
      // continue;
    }

    let score = 0;
    let score2 = 0;

    const min = l.min(data.map((row) => l.min(row.map((item) => item[0]))));
    const max = l.max(data.map((row) => l.max(row.map((item) => item[0]))));

    const maxY = l.max(data.map((row) => l.max(row.map((item) => item[1]))));

    console.log(min, max, maxY);
    if (min === undefined || max === undefined || maxY === undefined) {
      throw new Error("min or max is undefined");
    }

    const grid = l.range(0, maxY + 5).map(() => l.range(0, max + 500).map(() => "."));

    grid[maxY + 2].forEach((_, i) => (grid[maxY + 2][i] = "#"));

    data.forEach((line) => {
      for (let i = 1; i < line.length; i++) {
        const ax = line[i][0] - line[i - 1][0] === 0 ? "x" : "y";

        const diff = ax === "x" ? line[i][0] - line[i - 1][0] : line[i][1] - line[i - 1][1];

        if (ax === "x") {
          for (
            let j = Math.min(line[i - 1][1], line[i][1]);
            j <= Math.max(line[i - 1][1], line[i][1]);
            j++
          ) {
            grid[j][line[i][0]] = "#";
          }
        } else {
          for (
            let j = Math.min(line[i - 1][0], line[i][0]);
            j <= Math.max(line[i - 1][0], line[i][0]);
            j++
          ) {
            grid[line[i][1]][j] = "#";
          }
        }
      }
    });

    while (true) {
      let x = 501;
      let y = 1;
      grid[y][x] = "+";

      let done = false;
      while (true) {
        // part 1
        // if (y > maxY) {
        //   done = true;
        //   break;
        // }

        if (grid[y + 1][x] === ".") {
          y++;
          continue;
        }

        if (grid[y + 1][x - 1] === ".") {
          x--;
          continue;
        }

        if (grid[y + 1][x + 1] === ".") {
          x++;
          continue;
        }

        if (y === 1) {
          done = true;
          console.log("Done");
        }

        break;
      }

      if (done) {
        score++; // part 2
        break;
      }

      score++;
      grid[y][x] = "o";
    }

    // console.log(grid.map((a) => a.slice(0, -1).join("")).join("\n"));

    console.log("Task1", score);
    isMain && (await copySolution(score));

    // console.log("Task2", score2);
    // isMain && (await copySolution(score2));
  }
})();
