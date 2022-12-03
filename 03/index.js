// @ts-check
import { loadData } from "../shared/index.js";
import * as utils from "../shared/utils.js";

(async () => {
  for (const [name, data] of await loadData(import.meta.url, (row) => {
    return row;
    // const [a, b] = row.split(" ");
    // return /** @type {const} */ ([a, parseInt(b)]);
  })) {
    console.log(`------------- ${name} -------------`);
    if (name === "input.txt") {
      // continue;
    }

    let sum = 0;
    data.forEach((item, index) => {
      let left = new Set();
      let right = new Set();

      for (let i = 0; i < item.length; i++) {
        if (i < item.length / 2) {
          left.add(item[i]);
        } else {
          right.add(item[i]);
        }
      }

      const shared = new Set([...left].filter((x) => right.has(x)));
      let tmpVal = [...shared].join("").charCodeAt(0);
      if (tmpVal > 97) {
        tmpVal -= 97 - 1;
      } else {
        tmpVal -= 65 - 1 - 26;
      }

      // console.log(shared, tmpVal);

      sum += tmpVal;
    });

    console.log(sum);

    const items = [];
    for (let i = 0; i < data.length; i += 3) {
      const tmp = data.slice(i, i + 3);
      const letters = new Set(
        tmp[0].split("").filter((letter) => tmp.slice(1).every((item) => item.includes(letter)))
      );
      items.push(...[...letters]);
    }

    const second = items
      .map((item) => {
        let tmpVal = item.charCodeAt(0);
        if (tmpVal >= 97) {
          return tmpVal - 97 + 1;
        } else {
          return tmpVal - 65 + 1 + 26;
        }
      })
      .reduce((acc, val) => acc + val, 0);

    console.log(second);
  }
})();
