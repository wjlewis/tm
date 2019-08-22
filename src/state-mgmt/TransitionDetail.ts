import _ from 'lodash';
import { Editable, currentLatest } from './auxiliary';
import { State } from './state';

export interface TransitionDetailState extends Editable<TransitionDetailInfo> {}

export interface TransitionDetailInfo {
  byId: { [key: string]: TransitionDetail };
}

/*
 * A machine transition consists of an Arrow (which indicates the start and end
 * states), and some details regarding when the transition should be taken, and
 * what actions should be executed to effect the transition.
 */
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

/*
 * Selectors
 */
export const allTransitionDetails = (state: State): TransitionDetail[] => (
  Object.values(currentLatest(state.entities.transitionDetails).byId)
);

// Return an object associating each Arrow ID with a list of its
// TransitionDetails
export const allGroupedTransitionDetails = (state: State): { [key: string]: TransitionDetail[] } => (
  _.groupBy(allTransitionDetails(state), detail => detail.arrow)
);
