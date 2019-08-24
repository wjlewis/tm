import _ from 'lodash';
import uuid from 'uuid/v4';
import { Editable, currentLatest } from './auxiliary';
import { State } from './state';
import { Action } from './actions';
import * as A from './actions';

export interface TransitionDetailState extends Editable<TransitionDetailInfo> {}

export interface TransitionDetailInfo {
  byId: { [key: string]: TransitionDetail };
}

// A machine transition consists of an Arrow (which indicates the start and end
// states), and some details regarding when the transition should be taken, and
// what actions should be executed to effect the transition.
export interface TransitionDetail {
  id: string;
  arrow: string;
  read: string;
  write: string;
  move: string;
}

export const initTransitionDetailState: TransitionDetailState = {
  wip: null,
  committed: {
    byId: {
      'q0->q1.0': {
        id: 'q0->q1.0',
        arrow: 'q0->q1',
        read: 'A',
        write: 'B',
        move: 'L'
      },
      'q0->q1.1': {
        id: 'q0->q1.1',
        arrow: 'q0->q1',
        read: 'B',
        write: 'A',
        move: 'R',
      },
      'q1->q2.0': {
        id: 'q1->q2.0',
        arrow: 'q1->q2',
        read: '0',
        write: '1',
        move: 'N',
      },
      'q1->q1.0': {
        id: 'q1->q1.0',
        arrow: 'q1->q1',
        read: '1',
        write: '1',
        move: 'R',
      },
      'q1->q0.0': {
        id: 'q1->q0.0',
        arrow: 'q1->q0',
        read: '0',
        write: ' ',
        move: 'L',
      },
    },
  },
};

// Selectors
export const allTransitionDetails = (state: State): TransitionDetail[] => (
  Object.values(currentLatest(state.entities.transitionDetails).byId)
);

// Return an object associating each Arrow ID with a list of its
// TransitionDetails
export const allGroupedTransitionDetails = (state: State): { [key: string]: TransitionDetail[] } => (
  _.groupBy(allTransitionDetails(state), detail => detail.arrow)
);

export const transitionDetailsForArrow = (state: State, arrow: string): TransitionDetail[] => (
  allGroupedTransitionDetails(state)[arrow]
);

// Reducer
export const transitionDetailsReducer = (state: State, action: Action): TransitionDetailState => {
  switch (action.type) {
    case A.CHANGE_TRANSITION_DETAIL:
      return changeTransitionDetail(state, action.payload.detail);
    case A.DELETE_TRANSITION_DETAIL:
      return deleteTransitionDetail(state, action.payload.id);
    case A.ADD_TRANSITION_DETAIL:
      return addTransitionDetail(state, action.payload.arrow);
    default:
      return state.entities.transitionDetails;
  }
};

const changeTransitionDetail = (state: State, detail: TransitionDetail): TransitionDetailState => ({
  wip: null,
  committed: {
    ...state.entities.transitionDetails.committed,
    byId: {
      ...state.entities.transitionDetails.committed.byId,
      [detail.id]: detail,
    },
  },
});

const deleteTransitionDetail = (state: State, id: string): TransitionDetailState => ({
  wip: null,
  committed: {
    ...state.entities.transitionDetails.committed,
    byId: _.omit(state.entities.transitionDetails.committed.byId, id),
  },
});

const addTransitionDetail = (state: State, arrow: string): TransitionDetailState => {
  const detail = newEmptyTransitionDetail(arrow);
  return {
    wip: null,
    committed: {
      ...state.entities.transitionDetails.committed,
      byId: {
        ...state.entities.transitionDetails.committed.byId,
        [detail.id]: detail,
      },
    },
  };
};

const newEmptyTransitionDetail = (arrow: string): TransitionDetail => ({
  id: uuid(),
  arrow,
  read: '',
  write: '',
  move: '',
});
