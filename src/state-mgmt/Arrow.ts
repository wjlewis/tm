import _ from 'lodash';
import { State } from './state';
import { Action } from './actions';
import * as A from './actions';
import { isInEditMode } from './Mode';

// An arrow represents one or more transitions between two states in the
// machine. Therefore, we can describe them using the IDs of their start and end
// nodes (along with their own unique ID). For the most part, arrows are
// passive: they are drawn entirely according to the positions of their start
// and end nodes, along with their control point.

export interface ArrowState {
  byId: { [key: string]: Arrow };
}

export interface Arrow {
  id: string;
  start: string;
  end: string;
}

export const initArrowState: ArrowState = {
  byId: {},
};

// Return an array containing all arrows in existence.
export const allArrows = (state: State): Arrow[] => (
  Object.values(state.entities.arrows.byId)
);

// Return the arrow with the given ID.
export const arrowById = (state: State, id: string): Arrow => {
  const arrow = state.entities.arrows.byId[id];
  if (!arrow) {
    throw new Error(`No Arrow with ID "${id}"`);
  }
  return arrow;
};

// Return an array containing all arrows associated with the given node (i.e.
// arrows that either start or end at the node).
export const arrowsForNode = (state: State, nodeId: string): Arrow[] => (
  allArrows(state).filter(arrow => arrow.start === nodeId || arrow.end === nodeId)
);

// If an arrow exists joining the two given nodes, return it; otherwise return
// null.
export const arrowForEndpoints = (state: State, startId: string, endId: string): null | Arrow => {
  const arrow = allArrows(state).find(a => a.start === startId && a.end === endId);
  return arrow || null;
};

// Return an array containing all arrows starting at the given node.
export const arrowsForStart = (state: State, nodeId: string): Arrow[] => (
  allArrows(state).filter(arrow => arrow.start === nodeId)
);

export const arrowsReducer = (state: State, action: Action): ArrowState => {
  if (isInEditMode(state)) {
    switch (action.type) {
      case A.ADD_ARROW:
        return addArrow(state, action.payload.start, action.payload.end, action.payload.id);
      case A.DELETE_ENTITIES:
        return deleteEntities(state, action.payload.arrows);
      default:
        return state.entities.arrows;
    }
  }
  else {
    return state.entities.arrows;
  }
};

const addArrow = (state: State, start: string, end: string, id: string): ArrowState => (
  _.merge({}, state.entities.arrows, {
    byId: {
      [id]: { start, end, id },
    },
  })
);

const deleteEntities = (state: State, ids: string[]): ArrowState => ({
  ...state.entities.arrows,
  byId: _.omit(state.entities.arrows.byId, ids)
});
