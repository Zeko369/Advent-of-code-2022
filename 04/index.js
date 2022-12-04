// @ts-check
import { loadData } from "../shared/index.js";

(async () => {
  for (const [name, data] of await loadData(import.meta.url, (row) => {
    return row.split(",").map((a) => a.split("-").map(Number));

    // return parseInt(row);

    // const [a, b] = row.split(" ");
    // return /** @type {const} */ ([a, parseInt(b)]);
  })) {
    console.log(`------------- ${name} -------------`);
    if (name === "input.txt") {
      // continue;
    }

    let count = 0;
    let count2 = 0;

    data.forEach((item) => {
      if (item[0][0] >= item[1][0] && item[0][1] <= item[1][1]) {
        count++;
      } else if (item[0][1] >= item[1][1] && item[0][0] <= item[1][0]) {
        count++;
      }

      const arr = {};
      for (let i = item[0][0]; i <= item[0][1]; i++) {
        arr[i] = true;
      }

      for (let i = item[1][0]; i <= item[1][1]; i++) {
        if (arr[i]) {
          count2++;
          break;
        }
      }
    });

    console.log(count);
    console.log(count2);
  }
})();
