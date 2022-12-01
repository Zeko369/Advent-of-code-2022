/**
 * @template Item
 * @param {(Item | '')[]} array
 * @returns {Item[][]}
 */
export const splitIntoChunks = (array) => {
  return array.reduce(
    (chunks, item) => {
      if (item) {
        chunks.at(-1).push(item);
      } else {
        chunks.push([]);
      }
      return chunks;
    },
    [[]]
  );
};
