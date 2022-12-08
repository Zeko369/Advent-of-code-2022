// add function sum to array

interface Array<T extends number> {
  sum(lambda: (item: T) => number = (item) => item): number;
  toSorted(lambda?: (item: T) => number, direction?: "asc" | "desc"): Array<T>;
}
