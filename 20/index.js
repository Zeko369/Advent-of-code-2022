// @ts-check
import * as l from "lodash-es";

import { loadData, copySolution } from "../shared/index.js";
import * as globals from "../shared/globals.js";

(async () => {
  for (const [name, data] of await loadData(import.meta.url, (row, index) => {
    // return row;
    return { value: parseInt(row), index };

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

    const mix = (array) => (item, i) => {
      let index = array.findIndex((v) => v.index === item.index);
      if (index === -1) {
        return;
      }

      let newIndex = index + item.value;
      let offset = 0;

      while (newIndex >= array.length) {
        newIndex -= array.length;
        offset++;
      }
      while (newIndex <= 0) {
        newIndex += array.length;
        offset--;
      }

      // console.log("Moving", number);
      // console.log("Bef", tmp.join(", "));

      array.splice(index, 1);
      array.splice(newIndex + offset, 0, item);

      // console.log("Got", tmp.join(", "));
      // console.log("Exp", correct[i]);
      // console.log("");
    };

    const taskArray1 = structuredClone(data);
    data.forEach(mix(taskArray1));

    const taskArray2 = structuredClone(data).map((i) => ({ ...i, value: i.value * 811589153 }));
    for (let i = 0; i < 10; i++) {
      data.forEach(mix(taskArray2));
    }

    const getSolution = (array) => {
      const zeroIndex = array.findIndex((v) => v.value === 0);
      const items = [1000, 2000, 3000].map((i) => array[(i + zeroIndex) % array.length]);

      return items.reduce((a, b) => a + b.value, 0);
    };

    score = getSolution(taskArray1);
    score2 = getSolution(taskArray2);

    console.log("Task1", score);
    isMain && (await copySolution(score));

    console.log("Task2", score2);
    isMain && (await copySolution(score2));
  }
})();
