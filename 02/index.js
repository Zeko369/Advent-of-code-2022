// @ts-check
import { loadData } from "../shared/index.js";
import * as utils from "../shared/utils.js";

(async () => {
  for (const [name, data] of await loadData(import.meta.url, (row) => {
    const [a, b] = row.split(" ");
    return /** @type {const} */ ([a, b]);
  })) {
    console.log(`------------- ${name} -------------`);
    if (name === "input.txt") {
      // continue;
    }

    let score = 0;
    let score2 = 0;

    const map = { X: 1, Y: 2, Z: 3 };
    const win = { A: "Y", B: "Z", C: "X" };
    const draw = { A: "X", B: "Y", C: "Z" };
    const lose = { A: "Z", B: "X", C: "Y" };

    data.forEach((item) => {
      const [a, b] = item;
      score += map[b];

      switch (b) {
        case "X":
          score2 += map[lose[a]];
          break;
        case "Y":
          score2 += map[draw[a]] + 3;
          break;
        case "Z":
          score2 += map[win[a]] + 6;
          break;
      }

      if (b === draw[a]) {
        score += 3;
      } else if (b === win[a]) {
        score += 6;
      }
    });

    console.log(score);
    console.log(score2);
  }
})();
