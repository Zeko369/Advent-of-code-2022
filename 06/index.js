// @ts-check
import { loadData } from "../shared/index.js";

(async () => {
  for (const [name, data] of await loadData(import.meta.url, (row) => {
    return row;
    // return parseInt(row);

    // const [a, b] = row.split(" ");
    // return /** @type {const} */ ([a, parseInt(b)]);
  })) {
    console.log(`------------- ${name} -------------`);
    if (name === "input.txt") {
      // continue;
    }

    const input = data[0];
    for (let i = 0; i < input.length - 3; i++) {
      const slice = input.slice(i, i + 4);
      if (slice.length === new Set(slice).size) {
        console.log(i + 4);
        break;
      }
    }

    for (let i = 0; i < input.length - 13; i++) {
      const slice = input.slice(i, i + 14);
      if (slice.length === new Set(slice).size) {
        console.log(i + 14);
        break;
      }
    }
  }
})();
