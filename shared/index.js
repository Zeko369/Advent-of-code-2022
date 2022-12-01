import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { readFile, readdir } from "fs/promises";

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
