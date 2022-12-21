// @ts-check
import * as l from "lodash-es";

import { loadData, copySolution } from "../shared/index.js";
import * as globals from "../shared/globals.js";

(async () => {
  for (const [name, data] of await loadData(import.meta.url, (row) => {
    const [name, rawCommand] = row.split(": ");
    /** @type {{type: 'command', op: string, a: string, b: string} | {type: 'value', value: number}} */
    let command;
    if (Number.isNaN(Number(rawCommand))) {
      command = {
        type: "command",
        op: rawCommand.split(" ")[1],
        a: rawCommand.split(" ")[0],
        b: rawCommand.split(" ")[2],
      };
    } else {
      command = { type: "value", value: Number(rawCommand) };
    }

    return /** @type {const} */ ([name, command]);
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

    const obj = Object.fromEntries(data);
    let hitHuman = false;
    const getValue = (key) => {
      if (key === "humn") {
        hitHuman = true;
      }

      const item = obj[key];
      if (item.type === "value") {
        return item.value;
      }

      const { op, a, b } = item;
      const valueA = getValue(a);
      const valueB = getValue(b);

      return eval(`${valueA} ${op} ${valueB}`);
    };

    score = getValue("root");

    const getSideThatHitsHuman = () => {
      hitHuman = false;
      getValue(obj["root"]["a"]);
      return hitHuman ? "a" : "b";
    };

    const side = getSideThatHitsHuman();
    const otherSide = side === "a" ? "b" : "a";
    const otherSideValue = getValue(obj["root"][otherSide]);

    const getOperation = (key) => {
      if (key === "humn") {
        return "x";
      }

      const item = obj[key];
      if (item.type === "value") {
        return String(item.value);
      }

      const { op, a, b } = item;
      const valueA = getOperation(a);
      const valueB = getOperation(b);

      const tmp = `(${valueA} ${op} ${valueB})`;

      if (!tmp.includes("x")) {
        return String(eval(tmp));
      }

      return tmp;
    };

    const oppositeOp = {
      "*": "/",
      "/": "*",
      "+": "-",
      "-": "+",
    };

    let equation = getOperation(obj["root"][side]);
    let eq = { left: equation, right: otherSideValue };

    // if (isMain) {
    //   eq.left = "(x * 2) + 1";
    //   eq.right = 123;
    // }

    for (let i = 0; i < 100; i++) {
      if (eq.left === "x") break;

      if (eq.left.startsWith("(") && eq.left.endsWith(")")) {
        eq.left = eq.left.slice(1, -1);
      }

      console.log(eq);

      const isX = eq.left.startsWith("x");
      if (eq.left.startsWith("(") || isX) {
        const [op, value] = eq.left.split(" ").slice(-2);
        eq.right = eval(`${eq.right} ${oppositeOp[op]} ${value}`);
        eq.left = eq.left.slice(0, -op.length - value.length - 2);

        if (isX) break;
      } else {
        const [value, op] = eq.left.split(" ").slice(0, 2);

        if (op === "+" || op === "-") {
          eq.right = eval(`${eq.right} - ${value}`);
          eq.left = eq.left.slice(value.length + op.length + 2);

          if (op === "-") eq.right *= -1;
        } else if (op === "*") {
          eq.right = eval(`${eq.right} / ${value}`);
          eq.left = eq.left.slice(value.length + op.length + 2);
        } else if (op === "/") {
          throw new Error("here");
        }
      }
    }

    score2 = eq.right;

    // obj["humn"].value = 3617613950547.338;
    // console.log(otherSideValue - getValue(obj["root"][side]));

    console.log("Task1", score);
    isMain && (await copySolution(score));

    console.log("Task2", score2);
    isMain && (await copySolution(score2));
  }
})();
