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

    let type = false;
    const stacks = /** @type {string[][]} */ ([]);
    const instructions = [];

    for (const line of data) {
      if (line === "") {
        type = true;
        continue;
      }

      if (type) {
        const instruction = line.split(" ");
        instructions.push({
          count: parseInt(instruction[1]),
          from: parseInt(instruction[3]) - 1,
          to: parseInt(instruction[5]) - 1,
        });
      } else {
        for (let i = 0; i < line.length / 4; i++) {
          if (!stacks[i]) {
            stacks[i] = [];
          }

          if (line[1] === "1") {
            continue;
          }

          const tmp = line
            .slice(i * 4, i * 4 + 4)
            .trim()
            .slice(1, -1);
          if (tmp) {
            stacks[i].push(tmp);
          }
        }
      }
    }

    const stacksPart2 = JSON.parse(JSON.stringify(stacks));

    instructions.forEach((instruction) => {
      for (let i = 0; i < instruction.count; i++) {
        const take = stacks[instruction.from].splice(0, 1);
        stacks[instruction.to].unshift(take[0]);
      }

      const take = stacksPart2[instruction.from].splice(0, instruction.count);
      stacksPart2[instruction.to].unshift(...take);
    });

    console.log(stacks.map((s) => s[0]).join(""));
    console.log(stacksPart2.map((s) => s[0]).join(""));
  }
})();
