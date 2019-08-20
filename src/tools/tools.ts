/*
 * If the element is already present in the Array, remove all occurrences of it;
 * otherwise, add it.
 */
export const mod2Include = <A>(x: A, xs: A[]): A[] => (
  xs.includes(x) ? xs.filter(y => y !== x) : [...xs, x]
);

/*
 * This function takes an Array of elements, each of which has an `id` property,
 * and constructs an object in which each of the elements is associated with its
 * id. For instance, it converts:
 * 
 * [ { id: 'one', value: 1 }, { id: 'two', value: 2 } ]
 * 
 * into
 * 
 * {
 *   one: { id: 'one', value: 1 },
 *   two: { id: 'two', value: 2 },
 * }
 */
export const arrayToById = <A extends IDable>(xs: A[]): { [key: string]: A } => (
  xs.reduce((acc, x) => ({
    ...acc,
    [x.id]: x,
  }), {})
);

/*
 * This interface represents any type that has a string ID property (e.g. many
 * state entities).
 */
export interface IDable {
  id: string;
}
