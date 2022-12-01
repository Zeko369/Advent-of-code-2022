import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { readFile, readdir } from "fs/promises";

/**
 * @param {string} path
 * @param {(row: string, index: number) => any} mapper
 * @param {string[][] | undefined} forcedData
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
