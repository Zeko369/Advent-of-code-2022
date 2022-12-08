import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { readFile, readdir } from "node:fs/promises";
import { exec } from "node:child_process";
import { promisify } from "node:util";

/**
 * @template Item
 * @param {string} path
 * @param {(row: string, index: number) => Item} mapper
 * @param {string[][] | undefined} forcedData
 * @returns {Promise<[string, Item[]][]>}
 */
export const loadData = async (path, mapper = (a) => a, forcedData = undefined) => {
  if (forcedData) {
    return forcedData.map(([name, rows]) => [name, rows.map(mapper)]);
  }

  const files = (await readdir(dirname(fileURLToPath(path)))).filter(
    (file) => file.endsWith(".txt") && !file.startsWith("_")
  );

  return Promise.all(
    files.map(async (file) => {
      const filePath = join(dirname(fileURLToPath(path)), file);
      const data = await readFile(filePath, "utf8");
      return [file, data.split("\n").map(mapper)];
    })
  );
};

const execAsync = promisify(exec);
export const copySolution = (solution) => {
  return execAsync(`echo "${solution}" | pbcopy`);
};
