// @ts-check
import { loadData } from "../shared/index.js";

(async () => {
  const lodash = await (await import("lodash")).default;
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

    let path = [];
    const tree = {};

    for (const line of data) {
      const isCommand = line.startsWith("$");
      if (isCommand) {
        const [_, command, action] = line.split(" ");
        if (command === "cd") {
          if (action === "..") {
            path.pop();
          } else if (action === "/") {
            path = ["/"];
          } else {
            path.push(action);
          }
        }
      } else {
        const [size, name] = line.split(" ");
        if (size === "dir") {
          continue;
        }

        const filePath = [...path.slice(1), name.replace(".", "|")];
        lodash.set(tree, filePath.join("."), parseInt(size));
      }
    }

    // console.log(JSON.stringify(tree, null, 2));

    const ok = [];
    const getFolderSize = (folder, callback = (tmp) => {}) => {
      const tmp = Object.keys(folder).reduce((acc, key) => {
        const value = folder[key];
        if (typeof value === "number") {
          return acc + value;
        } else {
          return acc + getFolderSize(value, callback);
        }
      }, 0);

      callback(tmp);

      return tmp;
    };

    const used = getFolderSize(tree, (tmp) => {
      if (tmp <= 100000) {
        ok.push({ tmp });
      }
    });

    const SPACE = 70000000;
    const NEEDED = 30000000;

    const neededToFree = NEEDED - (SPACE - used);
    let minSize = -1;

    getFolderSize(tree, (tmp) => {
      if (tmp >= neededToFree) {
        if (minSize === -1 || tmp < minSize) {
          minSize = tmp;
        }
      }
    });

    console.log(
      "a",
      ok.reduce((acc, value) => acc + value.tmp, 0)
    );

    console.log("b", minSize);
  }
})();
