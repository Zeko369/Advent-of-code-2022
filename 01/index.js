import { loadData } from "../shared/index.js";

(async () => {
  for (const [name, data] of await loadData(import.meta.url, (row) => {
    return parseInt(row, 10);

    // const [a, b] = row.split(" ");
    // return [a, parseInt(b)];
  })) {
    console.log(`------------- ${name} -------------`);
    if (name === "input.txt") {
      // continue;
    }

    let items = [0];
    for (let i = 0; i < data.length; i++) {
      if (Number.isNaN(data[i])) {
        items.push(0);
      } else {
        items[items.length - 1] += data[i];
      }
    }

    console.log("First: ", items.sort((a, b) => b - a)[0]);

    console.log(
      "Second: ",
      items
        .sort((a, b) => b - a)
        .slice(0, 3)
        .reduce((a, b) => a + b, 0)
    );
  }
})();
