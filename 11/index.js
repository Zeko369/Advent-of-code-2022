// @ts-check
import * as l from "lodash-es";

import { loadData, copySolution } from "../shared/index.js";
import * as globals from "../shared/globals.js";

(async () => {
  for (const [name, data] of await loadData(import.meta.url, (row) => {
    return row.trim();
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

    const monkeys = [];
    for (let i = 0; i < data.length; i += 7) {
      const [items, op, test, throw1, throw2] = data.slice(i + 1, i + 6);

      monkeys.push({
        items: items
          .slice(items.indexOf(":") + 1)
          .split(", ")
          .map(Number),
        itemsPart1: items
          .slice(items.indexOf(":") + 1)
          .split(", ")
          .map(Number),
        op: (old) => eval(op.slice(op.indexOf("=") + 1).trim()),
        test: {
          div: Number(test.slice(test.indexOf("by") + 2).trim()),
          throw: {
            true: Number(throw1.split(" ").at(-1)),
            false: Number(throw2.split(" ").at(-1)),
          },
        },
      });
    }

    let commonMonkeyMod = monkeys.reduce((a, b) => a * b.test.div, 1);
    const inspections = monkeys.map(() => 0);
    const inspectionsPart1 = monkeys.map(() => 0);

    for (let i = 0; i < 10_000; i++) {
      monkeys.forEach((monkey, index) => {
        if (i < 20) {
          monkey.itemsPart1.forEach((item) => {
            const newItem = Math.floor(monkey.op(item) / 3);
            let isMod = newItem % monkey.test.div === 0;

            const throwTo = monkey.test.throw[String(isMod)];
            monkeys[throwTo].itemsPart1.push(newItem);

            inspectionsPart1[index]++;
          });
          monkey.itemsPart1 = [];
        }

        monkey.items.forEach((item) => {
          // const newItem = Math.floor(monkey.op(item) / 3);
          const newItem = monkey.op(item) % commonMonkeyMod;
          let isMod = newItem % monkey.test.div === 0;

          const throwTo = monkey.test.throw[String(isMod)];
          monkeys[throwTo].items.push(newItem);

          inspections[index]++;
        });
        monkey.items = [];
      });
    }

    const calc = (inspections) =>
      inspections
        .slice()
        .sort((a, b) => b - a)
        .slice(0, 2)
        .reduce((a, b) => a * b, 1);

    let score = calc(inspectionsPart1);
    let score2 = calc(inspections);

    console.log("Task1", score);
    isMain && (await copySolution(score));

    console.log("Task2", score2);
    isMain && (await copySolution(score2));
  }
})();
