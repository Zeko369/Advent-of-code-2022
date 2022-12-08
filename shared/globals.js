Array.prototype.sum = function (lambda = (a) => a) {
  return this.reduce(function (a, b) {
    return a + lambda(b);
  }, 0);
};

Array.prototype.toSorted = function (lambda = (a) => a, direction = "asc") {
  return this.slice().sort(function (a, b) {
    if (direction === "asc") {
      return lambda(a) - lambda(b);
    } else {
      return lambda(b) - lambda(a);
    }
  });
};

export const foo = "";
