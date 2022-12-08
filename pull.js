// @ts-check

import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { writeFile, stat, mkdir, copyFile } from "node:fs/promises";

import dotenv from "dotenv";

dotenv.config();
if (!process.env.SESSION_COOKIE) {
  throw new Error("SESSION_COOKIE not set");
}

const YEAR = 2022;
const DAY = process.env.DATE ? parseInt(process.env.DATE) : new Date().getDate();

(async () => {
  const date = new Date();
  if (date.getMonth() !== 11) {
    throw new Error("Not December");
  }

  const baseDir = join(dirname(fileURLToPath(import.meta.url)), `${DAY < 10 ? `0${DAY}` : DAY}`);
  try {
    await stat(baseDir);
  } catch (err) {
    console.log(`Creating ${baseDir}`);
    await mkdir(baseDir);

    await copyFile(
      join(dirname(fileURLToPath(import.meta.url)), "./template/index.js"),
      join(baseDir, "index.js")
    );

    await writeFile(join(baseDir, "input.txt"), "");
    await writeFile(join(baseDir, "input_demo.txt"), "");
  }

  while (true) {
    const time = new Date();
    if (time.getHours() >= 6) {
      const res = await fetch(`https://adventofcode.com/${YEAR}/day/${DAY}/input`, {
        headers: {
          Cookie: `session=${process.env.SESSION_COOKIE}`,
        },
      });

      if (res.status === 404) {
        console.log("Not available yet");

        console.log("Wait a sec...");
        await new Promise((resolve) => setTimeout(resolve, 1000));
        continue;
      }

      if (res.status !== 200) {
        throw new Error(`Unexpected status code: ${res.status}`);
      }

      const input = await res.text();
      await writeFile(join(baseDir, "input.txt"), input.trim(), "utf8");

      const demoRes = await fetch(`https://adventofcode.com/${YEAR}/day/${DAY}`);
      const demoHTML = await demoRes.text();
      const demoInput = demoHTML.match(/<pre><code>(.*?)<\/code><\/pre>/s);
      if (demoInput) {
        await writeFile(join(baseDir, "input_demo.txt"), demoInput[1].trim(), "utf8");
      } else {
        console.log("No demo input found");
      }

      console.log("Done");
      break;
    }
  }
})();
