import _ from 'lodash';
import uuid from 'uuid/v4';
import { State } from './state';
import { Action } from './actions';
import * as A from './actions';

// A transition detail provides the information that is missing in an arrow: an
// arrow indicates the start and end states for a number of transitions; a
// transition detail supplies the read symbol, write symbol, and tape direction
// for a particular transition. Thus, a transition consists of an arrow along
// with a transition detail.

export interface TransitionDetailState {
  byId: { [key: string]: TransitionDetail };
}

export interface TransitionDetail {
  id: string;
  arrow: string;
  read: string;
  write: string;
  move: string;
  isFocused: boolean;
}

export const initTransitionDetailState: TransitionDetailState = {
  byId: {
    'q0->q1.0': {
      id: 'q0->q1.0',
      arrow: 'q0->q1',
      read: 'A',
      write: 'B',
      move: 'L',
      isFocused: false,
    },
    'q0->q1.1': {
      id: 'q0->q1.1',
      arrow: 'q0->q1',
      read: 'B',
      write: 'A',
      move: 'R',
      isFocused: false,
    },
    'q1->q2.0': {
      id: 'q1->q2.0',
      arrow: 'q1->q2',
      read: '0',
      write: '1',
      move: 'N',
      isFocused: false,
    },
    'q1->q1.0': {
      id: 'q1->q1.0',
      arrow: 'q1->q1',
      read: '1',
      write: '1',
      move: 'R',
      isFocused: false,
    },
    'q1->q0.0': {
      id: 'q1->q0.0',
      arrow: 'q1->q0',
      read: '0',
      write: ' ',
      move: 'L',
      isFocused: false,
    },
  },
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

export const transitionDetailsReducer = (state: State, action: Action): TransitionDetailState => {
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
      return blurTransitionDetail(state, action.payload.id);
    default:
      return state.entities.transitionDetails;
  }
};

const addTransitionDetail = (state: State, arrow: string): TransitionDetailState => {
  const id = uuid();
  const detail = { id, arrow, read: '', write: '', move: '', isFocused: false };
  return _.merge({}, state.entities.transitionDetails, {
    byId: {
      [id]: detail,
    },
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

const focusTransitionDetail = (state: State, id: string): TransitionDetailState => (
  _.merge({}, state.entities.transitionDetails, {
    byId: {
      [id]: { isFocused: true },
    },
  })
);

const blurTransitionDetail = (state: State, id: string): TransitionDetailState => (
  _.merge({}, state.entities.transitionDetails, {
    byId: {
      [id]: { isFocused: false },
    }
  })
);
