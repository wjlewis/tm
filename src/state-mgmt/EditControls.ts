import { State } from './state';
import { selectedNodes } from './Node';

// Produces a list of all button types which should be displayed given the
// current state.
export const whichButtonTypes = (state: State): EditButtonType[] => {
  const selectedCount = selectedNodes(state).length;
  switch (selectedCount) {
    case 0: return [
      EditButtonTypes.ADD_STATE,
    ];
    case 1: return [
      EditButtonTypes.ADD_STATE,
      EditButtonTypes.REMOVE_STATE,
      EditButtonTypes.ADD_SELF_TRANSITION,
      EditButtonTypes.MAKE_START,
      EditButtonTypes.TOGGLE_ACCEPTING,
    ];
    case 2: return [
      EditButtonTypes.ADD_STATE,
      EditButtonTypes.REMOVE_TWO_STATES,
      EditButtonTypes.ADD_TRANSITION,
      EditButtonTypes.TOGGLE_TWO_ACCEPTING,
    ];
    default: return [
      EditButtonTypes.ADD_STATE,
      EditButtonTypes.REMOVE_MANY_STATES,
      EditButtonTypes.TOGGLE_MANY_ACCEPTING,
    ];
  }
};

export type EditButtonType = 'ADD_STATE'
                           | 'REMOVE_STATE'
                           | 'REMOVE_TWO_STATES'
                           | 'REMOVE_MANY_STATES'
                           | 'ADD_SELF_TRANSITION'
                           | 'ADD_TRANSITION'
                           | 'MAKE_START'
                           | 'UNMAKE_START'
                           | 'TOGGLE_ACCEPTING'
                           | 'TOGGLE_TWO_ACCEPTING'
                           | 'TOGGLE_MANY_ACCEPTING';

export const EditButtonTypes: { [key: string]: EditButtonType } = {
  ADD_STATE: 'ADD_STATE',
  REMOVE_STATE: 'REMOVE_STATE',
  REMOVE_TWO_STATES: 'REMOVE_TWO_STATES',
  REMOVE_MANY_STATES: 'REMOVE_MANY_STATES',
  ADD_SELF_TRANSITION: 'ADD_SELF_TRANSITION',
  ADD_TRANSITION: 'ADD_TRANSITION',
  MAKE_START: 'MAKE_START',
  UNMAKE_START: 'UNMAKE_START',
  TOGGLE_ACCEPTING: 'TOGGLE_ACCEPTING',
  TOGGLE_TWO_ACCEPTING: 'TOGGLE_TWO_ACCEPTING',
  TOGGLE_MANY_ACCEPTING: 'TOGGLE_MANY_ACCEPTING',
};
