// @ts-check
import * as l from "lodash-es";

import { loadData, copySolution } from "../shared/index.js";
import * as globals from "../shared/globals.js";

(async () => {
  const parseNum = (a) => {
    return a
      .map((x) => x.split("=")[1])
      .map(Number)
      .map((num, index) => (index === 0 ? num : num));
  };

  const distance = (a, b) => {
    return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
  };

  for (const [name, data] of await loadData(import.meta.url, (row) => {
    const [a, b] = row.split(": closest beacon is at ");
    const [sx, sy] = parseNum(a.slice(`Sensor at `.length).split(", "));
    const [bx, by] = parseNum(b.split(", "));

    return {
      distance: distance({ x: sx, y: sy }, { x: bx, y: by }),
      sensor: { x: sx, y: sy },
      beacon: { x: bx, y: by },
    };
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

    const existingThings = [...data.map((x) => x.sensor), ...data.map((x) => x.beacon)];

    const edgePoints = [];
    const limit = isMain ? 4000000 : 20;
    const check = (y, x) =>
      !(x < 0 || y < 0 || x > limit || y > limit) &&
      !existingThings.find((thing) => thing.x === x && thing.y === y);

    data.forEach((item) => {
      const rowOffset = item.beacon.y - item.sensor.y;
      const colOffset = item.beacon.x - item.sensor.x;
      const allMoves = Math.abs(rowOffset) + Math.abs(colOffset) + 1;

      for (let i = -allMoves; i <= allMoves; i++) {
        const count = (allMoves - Math.abs(i)) * 2 + 1;
        const offset = Math.floor(count / 2);

        const x = item.sensor.x + offset;
        const y = item.sensor.y + i;
        if (check(y, x)) {
          edgePoints.push({ x, y });
        }

        if (!(i === -allMoves || i === allMoves)) {
          const x = item.sensor.x + offset - count + 1;
          const y = item.sensor.y + i;
          if (check(y, x)) {
            edgePoints.push({ x, y });
          }
        }
      }
    });

    const filtered = [...edgePoints]
      .filter((point) => {
        return !data.find((item) => distance(item.sensor, point) <= item.distance);
      })
      .reduce((acc, point) => {
        if (acc.find((x) => x.x === point.x && x.y === point.y)) {
          return acc;
        }

        return [...acc, point];
      }, []);

    const item = filtered[0];
    console.log(item);
    if (!filtered) {
      throw new Error("No item");
    }

    let score = item.x * 4000000 + item.y;
    // let score2 = 0;

    console.log("Task1", score);
    isMain && (await copySolution(score));

    // console.log("Task2", score2);
    // isMain && (await copySolution(score2));
  }
})();
