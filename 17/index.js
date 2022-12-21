// @ts-check
import * as l from "lodash-es";

import { loadData, copySolution } from "../shared/index.js";
import * as globals from "../shared/globals.js";

(async () => {
  for (const [name, data] of await loadData(import.meta.url, (row) => {
    return row;
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
    let debug = isMain ? false : false;

    const pattern = data[0].split("");
    const objects = [
      // prettier-ignore
      [[0, 0], [1, 0], [2, 0], [3, 0]], // line x
      // prettier-ignore
      [[1, 0], [0, 1], [1, 1], [2, 1], [1, 2]], // plus
      // prettier-ignore
      [[2, 0], [2, 1], [0, 2], [1, 2], [2, 2]], // L
      // prettier-ignore
      [[0, 0], [0, 1], [0, 2], [0, 3]], // line y
      // prettier-ignore
      [[0, 0], [0, 1], [1, 1], [1, 0]], // cube
    ];

    let patternIter = 0;
    let objectIter = 0;
    const map = [
      l.range(0, 7).map(() => "+"),
      l.range(0, 7).map(() => "+"),
      l.range(0, 7).map(() => "+"),
    ];

    debug = false;
    for (let i = 0; i < 2022; i++) {
      let space = map.findIndex((row) => !row.every((cell) => cell === "."));
      const object = objects[objectIter++ % objects.length];
      const objectHeight = Math.max(...object.map(([x, y]) => y)) + 1;
      for (let j = 0; j < 4; j++) {
        map.unshift(l.range(0, 7).map(() => "."));
      }

      let row = 0;
      space = map.findIndex((row) => !row.every((cell) => cell === "."));
      const tmp = space - objectHeight - 3;
      map.splice(0, tmp);

      object.forEach(([x, y]) => (map[row + y][x + 2] = "@"));
      // console.log(space, objectHeight);
      // console.log(map.map((row) => row.join("")).join("\n"));
      // console.log("-----------------");

      // TODO: Make this a while
      let maxIter = 100;
      let iter = 0;
      for (let j = 0; j < 100; j++) {
        iter++;
        const move = pattern[patternIter++ % pattern.length];
        debug && console.log(`[${j}] JET STREAM STEP ${move}`);

        const index = move === "<" ? 0 : 6;
        const wontMoveOutOfBoard = map
          .slice(row, row + 4)
          .filter((row) => row.includes("@"))
          .every((row) => row[index] === ".");
        let canMoveInDir = true;
        for (let k = 0; k < 4; k++) {
          if (!map[k + row].includes("@")) {
            break;
          }

          for (let l = 0; l < 7; l++) {
            if (map[k + row][l] === "@") {
              if (move === "<") {
                if (map[k + row][l - 1] !== "." && map[k + row][l - 1] !== "@") {
                  canMoveInDir = false;
                }
              } else {
                if (map[k + row][l + 1] !== "." && map[k + row][l + 1] !== "@") {
                  canMoveInDir = false;
                }
              }
            }
          }
        }

        const canMove = wontMoveOutOfBoard && canMoveInDir;

        if (canMove) {
          for (let k = 0; k < 4; k++) {
            if (!map[k + row].includes("@")) {
              break;
            }

            for (let l = 0; l < 6; l++) {
              if (move === "<" && map[k + row][l + 1] === "@") {
                map[k + row][l] = map[k + row][l + 1];
                map[k + row][l + 1] = ".";
              } else if (move === ">" && map[k + row][6 - l - 1] === "@") {
                map[k + row][6 - l] = map[k + row][6 - l - 1];
                map[k + row][6 - l - 1] = ".";
              }
            }
          }
        }

        debug &&
          console.log(
            `After push ${String(canMove)} \n${map.map((row) => row.join("")).join("\n")}`
          );

        let canMoveDown = true;
        for (let k = 0; k < 4; k++) {
          if (!map[k + row].includes("@")) {
            break;
          }

          for (let l = 0; l < 7; l++) {
            if (map[k + row][l] === "@") {
              if (map[k + row + 1][l] !== "." && map[k + row + 1][l] !== "@") {
                canMoveDown = false;
              }
            }
          }
        }

        if (!canMoveDown) break;

        for (let k = 4; k > 0; k--) {
          if (!map[k + row - 1].includes("@")) {
            continue;
          }

          for (let l = 0; l < 7; l++) {
            if (map[k + row - 1][l] === "@") {
              map[k + row][l] = "@";
              map[k + row - 1][l] = ".";
            }
          }
        }

        row++;

        debug && console.log(`After move \n${map.map((row) => row.join("")).join("\n")}`);
      }

      if (maxIter === iter) {
        throw new Error("Max iter reached");
      }

      for (let k = 0; k < 4; k++) {
        for (let l = 0; l < 7; l++) {
          if (map[k + row][l] === "@") {
            map[k + row][l] = "#";
          }
        }
      }
    }

    //     const items = `|....##.|
    // |....##.|
    // |....#..|
    // |..#.#..|
    // |..#.#..|
    // |#####..|
    // |..###..|
    // |...#...|
    // |..####.|`.split("\n");
    //     const fuckedUpMap = map.slice().reverse().slice(5).reverse();
    //     for (let i = 0; i < items.length; i++) {
    //       console.log(items[i], fuckedUpMap[i] && `|${fuckedUpMap[i].join("")}|`);
    //     }

    console.log(map.map((row) => row.join("")).join("\n"));
    score = map.length - 3;

    console.log("Task1", score);
    isMain && (await copySolution(score));

    // console.log("Task2", score2);
    // isMain && (await copySolution(score2));
  }
})();
