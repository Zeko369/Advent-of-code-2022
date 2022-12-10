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

    let score = 0;
    let score2 = 0;

    let reg = 1;
    let cycle = 0;
    let output = "";
    let display = [];

    const countCheck = () => {
      if (cycle === 20 || (cycle - 20) % 40 === 0) {
        score += reg * cycle;
      }

      if (display.length === 40) {
        output += display.join("");
        output += "\n";
        display = [];
      }

      let tmp = (cycle - 1) % 40;
      const options = Array.from({ length: 3 }, (_, i) => reg + (-1 + i));
      if (options.includes(tmp)) {
        display.push("#");
      } else {
        display.push(".");
      }
    };

    data.forEach(([command, value]) => {
      if (command === "noop") {
        cycle++;
        countCheck();
      } else {
        cycle++;
        countCheck();
        cycle++;
        countCheck();
        reg += value;
      }
    });

    console.log("Task1", score);
    isMain && (await copySolution(score));

    output += display.join("");
    console.log(output.trim());

    //     const foo = `##..##..##..##..##..##..##..##..##..##..
    // ###...###...###...###...###...###...###.
    // ####....####....####....####....####....
    // #####.....#####.....#####.....#####.....
    // ######......######......######......####
    // #######.......#######.......#######.....`.split("\n");
    // console.log(
    //   output
    //     .trim()
    //     .split("\n")
    //     .map((row, i) => {
    //       return `exp: ${foo[i]}\nact: ${row}`;
    //     })
    //     .join("\n----\n")
    // );

    // console.log("Task2", score2);
    // isMain && (await copySolution(score2));
  }
})();

// ####.###...##..###..#....####.####.#..#.
// ...#.#..#.#..#.#..#.#....#.......#.#..#.
// ..#..#..#.#..#.#..#.#....###....#..#..#.
// .#...###..####.###..#....#.....#...#..#.
// #....#.#..#..#.#.#..#....#....#....#..#.
// ####.#..#.#..#.#..#.####.#....####..##..
