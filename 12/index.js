// @ts-check
import * as l from "lodash-es";

import { loadData, copySolution } from "../shared/index.js";
import * as globals from "../shared/globals.js";

(async () => {
  for (const [name, data] of await loadData(import.meta.url, (row) => {
    // return row;
    // return parseInt(row);

    // return row.split(" ").map(Number);
    return row.split("");

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

    // v..v<<<<
    // >v.vv<<^
    // .>vv>E^^
    // ..v>>>^^
    // ..>>>>>^

    const part2 = [];
    const bfs = () => {
      const end = data.map((d, index) => [d.indexOf("E"), index]).filter((d) => d[0] !== -1)[0];
      console.log(end);
      const q = /** @type {[number, number, number][]} */ ([[...end, 0]]);
      const visited = data.map((row) => row.map(() => -1));

      while (q.length) {
        const pair = q.shift();
        if (!pair) break;
        const [x, y, s] = pair;

        if (visited[y][x] !== -1) {
          continue;
        }

        if (data[y][x] === "S") {
          score = s;
          break;
        }
        if (data[y][x] === "a") {
          part2.push(s);
        }

        visited[y][x] = s;

        const check = (y, x) => !(x < 0 || y < 0 || x >= data[0].length || y >= data.length);

        const getNext = (y, x) => {
          switch (data[y][x]) {
            case "E":
              return "z".charCodeAt(0);
            case "S":
              return "a".charCodeAt(0);
            default:
              return data[y][x].charCodeAt(0);
          }
        };

        const tmp = getNext(y, x);
        if (check(y, x + 1) && getNext(y, x + 1) >= tmp - 1) {
          q.push([x + 1, y, s + 1]);
        }
        if (check(y + 1, x) && getNext(y + 1, x) >= tmp - 1) {
          q.push([x, y + 1, s + 1]);
        }
        if (check(y, x - 1) && getNext(y, x - 1) >= tmp - 1) {
          q.push([x - 1, y, s + 1]);
        }
        if (check(y - 1, x) && getNext(y - 1, x) >= tmp - 1) {
          q.push([x, y - 1, s + 1]);
        }
      }
    };

    bfs();

    console.log("Task1", score);
    isMain && (await copySolution(score));

    score2 = part2.sort((a, b) => a - b)[0];
    console.log("Task2", score2);
    isMain && (await copySolution(score2));
  }
})();
