// This file contains state-management functions and type definitions that are
// general-purpose enough to be useful in a number of places.

// In many cases, we choose to maintain not one but TWO intances of some part of
// the state. Here is an example illustrating why: suppose we move a node from
// one position to another. On the one hand, we need the current node position
// to be maintained in the state so that we can display it properly. On the
// other hand, we don't want to replace its previous (pre-move) position,
// because this information is useful for undo/redo purposes. Our solution is to
// maintain a "work-in-progress" (wip) state for these transient changes, and a
// "committed" state that always contains the last meaningful snapshot of the
// state.
export interface Transient<A> {
  wip: null | A;
  committed: A;
}

// The wip state, if it is non-null, is always more up-to-date than the last
// commit. If the wip state is nonexistent, we simply fall back on the last
// commit.
export const currentLatest = <A>(state: Transient<A>): A => (
  state.wip || state.committed
);

// This interface represents any type that has a string ID (e.g. any of the
// "entities" in our application state).
export interface IDAble {
  id: string;
}
