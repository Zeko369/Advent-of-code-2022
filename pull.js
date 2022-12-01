import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { writeFile, stat, mkdir, copyFile } from "node:fs/promises";

import dotenv from "dotenv";

dotenv.config();
if (!process.env.SESSION_COOKIE) {
  throw new Error("SESSION_COOKIE not set");
}

(async () => {
  const date = new Date();
  if (date.getMonth() !== 11) {
    throw new Error("Not December");
  }

  const day = date.getDate();
  const baseDir = join(
    dirname(fileURLToPath(import.meta.url)),
    day < 10 ? `0${day}` : day.toString()
  );
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
    await writeFile(join(baseDir, "input2.txt"), "");
  }

  while (true) {
    const time = new Date();
    if (time.getHours() >= 6) {
      const res = await fetch(`https://adventofcode.com/2022/day/${day}/input`, {
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

      const data = await res.text();
      await writeFile(join(baseDir, "input.txt"), data.trim(), "utf8");

      console.log("Done");
      break;
    }
  }
})();
