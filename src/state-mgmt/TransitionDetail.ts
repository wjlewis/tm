import _ from 'lodash';
import uuid from 'uuid/v4';
import { State } from './state';
import { Action } from './actions';
import * as A from './actions';
import { isInEditMode } from './Mode';
import { arrowById } from './Arrow';
import { TapeDirection, TapeDirections } from './Tape';

// A transition detail provides the information that is missing in an arrow: an
// arrow indicates the start and end states for a number of transitions; a
// transition detail supplies the read symbol, write symbol, and tape direction
// for a particular transition. Thus, a transition consists of an arrow along
// with a transition detail.

export interface TransitionDetailState {
  byId: { [key: string]: TransitionDetail };
  focused: null | string;
}

export interface TransitionDetail {
  id: string;
  arrow: string;
  read: string;
  write: string;
  move: TapeDirection;
  isDuplicate: boolean;
}

export const initTransitionDetailState: TransitionDetailState = {
  byId: {},
  focused: null,
};

// Return an array containing all transition details.
export const allTransitionDetails = (state: State): TransitionDetail[] => (
  Object.values(state.entities.transitionDetails.byId)
);

// Return an object associating each Arrow ID with a list of its
// TransitionDetails.
export const allGroupedTransitionDetails = (state: State): { [key: string]: TransitionDetail[] } => (
  _.groupBy(allTransitionDetails(state), detail => detail.arrow)
);

// Return an array of transition details associated with the given arrow.
export const transitionDetailsForArrow = (state: State, arrow: string): TransitionDetail[] => (
  allGroupedTransitionDetails(state)[arrow]
);

export const transitionDetailsByStart = (state: State): { [key: string]: TransitionDetail[] } => (
  _.groupBy(allTransitionDetails(state), detail => arrowById(state, detail.arrow).start)
);

// Return an array of IDs of transition details that share "read" symbols with
// at least one other detail.
export const duplicateTransitionDetails = (state: State): string[] => {
  const byStart = Object.values(transitionDetailsByStart(state));
  const byReadSym = byStart.map(ds => Object.values(_.groupBy(ds, detail => detail.read)));
  const duplicates = byReadSym.map(ds => ds.filter(group => group.length > 1)); 
  const flattened = _.flattenDeep(duplicates) as TransitionDetail[];
  return flattened.map(detail => detail.id);
};

// Return the currently focused transition detail
export const focusedDetail = (state: State): null | string => state.entities.transitionDetails.focused;

export const transitionDetailsReducer = (state: State, action: Action): TransitionDetailState => {
  if (isInEditMode(state)) {
    switch (action.type) {
      case A.ADD_TRANSITION_DETAIL:
        return addTransitionDetail(state, action.payload.arrow);
      case A.ADD_ARROW:
        return addArrow(state, action.payload.id);
      case A.CHANGE_TRANSITION_DETAIL:
        return changeTransitionDetail(state, action.payload.detail);
      case A.DELETE_TRANSITION_DETAIL:
        return deleteTransitionDetail(state, action.payload.id);
      case A.DELETE_ENTITIES:
        return deleteEntities(state, action.payload.transitionDetails);
      case A.FOCUS_TRANSITION_DETAIL:
        return focusTransitionDetail(state, action.payload.id);
      case A.BLUR_TRANSITION_DETAIL:
        return blurTransitionDetail(state);
      case A.MARK_DUPLICATE_TRANSITIONS:
        return markDuplicateTransitions(state, action.payload.ids);
      default:
        return state.entities.transitionDetails;
    }
  }
  else {
    return state.entities.transitionDetails;
  }
};

const addTransitionDetail = (state: State, arrow: string): TransitionDetailState => {
  const id = uuid();
  const detail = { id, arrow, read: '', write: '', move: TapeDirections.L, isFocused: false };
  return _.merge({}, state.entities.transitionDetails, {
    byId: {
      [id]: detail,
    },
    focused: id,
  });
};

// Whenever we add a new arrow, we also add a fresh transition detail.
const addArrow = (state: State, arrow: string): TransitionDetailState => (
  addTransitionDetail(state, arrow)
);

const changeTransitionDetail = (state: State, detail: TransitionDetail): TransitionDetailState => (
  _.merge({}, state.entities.transitionDetails, {
    byId: {
      [detail.id]: detail,
    },
  })
);

const deleteTransitionDetail = (state: State, id: string): TransitionDetailState => {
  const { transitionDetails } = state.entities;
  return {
    ...transitionDetails,
    byId: _.omit(transitionDetails.byId, id),
  };
};

const deleteEntities = (state: State, ids: string[]): TransitionDetailState => ({
  ...state.entities.transitionDetails,
  byId: _.omit(state.entities.transitionDetails.byId, ids),
});

const focusTransitionDetail = (state: State, id: string): TransitionDetailState => ({
  ...state.entities.transitionDetails,
  focused: id,
});

const blurTransitionDetail = (state: State): TransitionDetailState => ({
  ...state.entities.transitionDetails,
  focused: null,
});

const markDuplicateTransitions = (state: State, ids: string[]): TransitionDetailState => ({
  ...state.entities.transitionDetails,
  byId: _.mapValues(state.entities.transitionDetails.byId, detail => ({
    ...detail,
    isDuplicate: ids.includes(detail.id),
  })),
});
