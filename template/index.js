// @ts-check
import { loadData } from "../shared/index.js";
import * as utils from "../shared/utils";

(async () => {
  for (const [name, data] of await loadData(import.meta.url, (row) => {
    const [a, b] = row.split(" ");
    return /** @type {const} */ ([a, parseInt(b)]);
  })) {
    console.log(`------------- ${name} -------------`);
    if (name === "input.txt") {
      continue;
    }

    console.log(data.length);
  }
})();
