// @ts-check
import * as l from "lodash-es";

import { loadData, copySolution } from "../shared/index.js";
import * as globals from "../shared/globals.js";

(async () => {
  for (const [name, data] of await loadData(import.meta.url, (row, index) => {
    if (!row) {
      return null;
    }

    return JSON.parse(row);

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

    const compare = (a, b) => {
      if (typeof a === "number" && typeof b === "number") {
        if (a === b) {
          return "continue";
        } else if (a < b) {
          return "correct";
        } else {
          return "incorrect";
        }
      }

      if (Array.isArray(a)) {
        if (Array.isArray(b)) {
          for (let i = 0; i < a.length; i++) {
            if (b[i] === undefined) {
              return "incorrect";
            }

            const result = compare(a[i], b[i]);
            if (result !== "continue") {
              return result;
            }
          }

          if (b.length === a.length) {
            return "continue";
          } else if (b.length > a.length) {
            return "correct";
          }

          throw new Error("Not implemented");
        } else {
          return compare(a, [b]);
        }
      } else {
        if (Array.isArray(b)) {
          return compare([a], b);
        } else {
          console.log(a, b);
          throw new Error("Not implemented");
        }
      }
    };

    const correct = [];
    const items = l.compact(data);
    for (let i = 0; i < items.length / 2; i++) {
      const [left, right] = items.slice(i * 2, i * 2 + 2);
      const tmp = compare(left, right);

      if (tmp === "correct") {
        correct.push(i + 1);
      }
    }

    const newItems = [...items, [[2]], [[6]]].sort((a, b) => {
      if (JSON.stringify(a) === JSON.stringify(b)) {
        return 0;
      }

      const tmp = compare(a, b);
      if (tmp === "correct") {
        return -1;
      }

      return 1;
    });

    score = correct.sum();
    console.log("Task1", score);
    isMain && (await copySolution(score));

    score2 =
      (newItems.findIndex((item) => JSON.stringify(item) === JSON.stringify([[6]])) + 1) *
      (newItems.findIndex((item) => JSON.stringify(item) === JSON.stringify([[2]])) + 1);

    console.log("Task2", score2);
    isMain && (await copySolution(score2));
  }
})();
