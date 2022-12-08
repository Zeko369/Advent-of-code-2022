// @ts-check
import { loadData } from "../shared/index.js";

(async () => {
  for (const [name, data] of await loadData(import.meta.url, (row) => {
    return row.split("").map(Number);
    // return parseInt(row);

    // const [a, b] = row.split(" ");
    // return /** @type {const} */ ([a, parseInt(b)]);
  })) {
    console.log(`------------- ${name} -------------`);
    if (name === "input.txt") {
      // continue;
    }

    let scenes = [];
    let count = data[0].length * 2 + (data.length - 2) * 2;

    for (let i = 1; i < data.length - 1; i++) {
      for (let j = 1; j < data[i].length - 1; j++) {
        let dir = 4;
        let scene = [];

        let count = 0;
        for (let k = i + 1; k < data.length; k++) {
          count++;
          if (data[k][j] >= data[i][j]) {
            scene.push(count);
            dir--;
            break;
          }
        }
        if (scene.length === 0) {
          scene.push(count);
        }

        count = 0;
        for (let k = i - 1; k >= 0; k--) {
          count++;
          if (data[k][j] >= data[i][j]) {
            scene.push(count);
            dir--;
            break;
          }
        }
        if (scene.length === 1) {
          scene.push(count);
        }

        count = 0;
        for (let k = j + 1; k < data.length; k++) {
          count++;
          if (data[i][k] >= data[i][j]) {
            scene.push(count);
            dir--;
            break;
          }
        }
        if (scene.length === 2) {
          scene.push(count);
        }

        count = 0;
        for (let k = j - 1; k >= 0; k--) {
          count++;
          if (data[i][k] >= data[i][j]) {
            scene.push(count);
            dir--;
            break;
          }
        }
        if (scene.length === 3) {
          scene.push(count);
        }

        if (dir > 0) {
          scenes.push(scene.reduce((a, b) => a * b, 1));
          count++;
        }
      }
    }

    console.log(count);
    console.log(scenes.sort((a, b) => b - a)[0]);
  }
})();
