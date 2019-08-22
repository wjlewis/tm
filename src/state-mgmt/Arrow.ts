import { Editable, currentLatest } from './auxiliary';
import { State } from './state';

export interface ArrowState extends Editable<ArrowInfo> {}

export interface ArrowInfo {
  byId: { [key: string]: Arrow };
}

/*
 * An Arrow represents one or more transitions between (not necessarily
 * distinct) states. The `start` and `end` properties are associated with the
 * IDs of Node objects.
 */
export interface Arrow {
  id: string;
  start: string;
  end: string;
}

export const initArrowState: ArrowState = {
  wip: null,
  committed: {
    byId: {
      'q0->q1': { id: 'q0->q1', start: 'q0', end: 'q1' },
      'q1->q2': { id: 'q1->q2', start: 'q1', end: 'q2' },
      'q1->q1': { id: 'q1->q1', start: 'q1', end: 'q1' },
      'q1->q0': { id: 'q1->q0', start: 'q1', end: 'q0' },
    },
  },
};

/*
 * Selectors
 */
export const allArrows = (state: State): Arrow[] => (
  Object.values(currentLatest(state.entities.arrows).byId)
);

export const arrowById = (state: State, id: string): Arrow => {
  const arrow = allArrows(state).find(a => a.id === id);
  if (!arrow) {
    throw new Error(`No Arrow with ID "${id}"`);
  }
  return arrow;
};
