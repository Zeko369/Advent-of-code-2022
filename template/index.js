// @ts-check
import { loadData } from "../shared/index.js";
import * as l from "lodash-es";

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
    console.log(`------------- ${name} -------------`);
    if (name === "input.txt") {
      continue;
    }

    let score = 0;

    console.log(data.length);

    console.log("Task1", score);
    // console.log("Task2", score);
  }
})();
