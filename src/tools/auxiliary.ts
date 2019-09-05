// This file contains a number of functions that are useful for performing
// various tasks, and are general enough not to be included alongside any of
// their uses.

// If x is a member of the Array, remove it; otherwise, add it.
export const mod2Include = <A>(x: A, xs: A[]): A[] => (
  xs.includes(x) ? xs.filter(y => y !== x) : [...xs, x]
);

// X xOr Y is true if either X or Y is true, but not both.
export const xOr = (x: boolean, y: boolean): boolean => (
  (x || y) && !(x && y)
);

// repeat(what, times) constructs an Array containing "what" repeated "times"
// times.
export const repeat = <A>(what: A, times: number): A[] => {
  const res = new Array(times);
  for (let i = 0; i < times; i++) {
    res[i] = what;
  }
  return res;
};
