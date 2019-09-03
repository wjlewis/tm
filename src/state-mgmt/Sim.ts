import { State } from './state';
import { Action } from './actions';
import * as A from './actions';

export interface SimState {
  currentState: null | string;
  activeNode: null | string;
  activeArrow: null | string;
  activeTransitionDetail: null | string;
}

export const initSimState: SimState = {
  currentState: null,
  activeNode: null,
  activeArrow: null,
  activeTransitionDetail: null,
};

// Return the current simulation state.
export const currentState = (state: State): null | string => state.sim.currentState;

export const isNodeActive = (state: State, id: string): boolean => (
  state.sim.activeNode === id
);

export const isArrowActive = (state: State, id: string): boolean => (
  state.sim.activeArrow === id
);

export const activeTransitionDetail = (state: State): null | string => (
  state.sim.activeTransitionDetail
);

export const simReducer = (state: State, action: Action): SimState => {
  switch (action.type) {
    case A.SET_CURRENT_STATE:
      return setCurrentState(state, action.payload.id);
    case A.SET_ACTIVE_NODE:
      return setActiveNode(state, action.payload.id);
    case A.SET_ACTIVE_TRANSITION_DETAIL:
      return setActiveTransitionDetail(state, action.payload.id);
    case A.SET_ACTIVE_ARROW:
      return setActiveArrow(state, action.payload.id);
    default:
      return state.sim;
  }
};

const setCurrentState = (state: State, id: string): SimState => ({
  ...state.sim,
  currentState: id,
});

const setActiveNode = (state: State, id: null | string): SimState => ({
  ...state.sim,
  activeNode: id,
});

const setActiveTransitionDetail = (state: State, id: null | string): SimState => ({
  ...state.sim,
  activeTransitionDetail: id,
});

const setActiveArrow = (state: State, id: null | string): SimState => ({
  ...state.sim,
  activeArrow: id,
});
