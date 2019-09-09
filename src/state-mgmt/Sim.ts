import { State } from './state';
import { Action } from './actions';
import * as A from './actions';
import { tapeEntries, TapeDirection, TapeDirections } from './Tape';
import { startNode, isStartNode } from './Node';

export interface SimState {
  hasStarted: boolean;
  initialTapeEntries: null | string[];
  currentNode: null | string;
  activeTapeCell: number;
  isTapeWriting: boolean;
  glowingNode: null | string;
  fadeInNode: null | string;
  fadeOutNode: null | string;
  glowingArrow: null | string;
  glowingControlPoint: null | string;
  glowingTransitionDetail: null | string;
  intervalDivisor: number;
}

export const initSimState: SimState = {
  hasStarted: false,
  initialTapeEntries: null,
  currentNode: null,
  activeTapeCell: 0,
  isTapeWriting: false,
  glowingNode: null,
  fadeInNode: null,
  fadeOutNode: null,
  glowingArrow: null,
  glowingControlPoint: null,
  glowingTransitionDetail: null,
  intervalDivisor: 4,
};

export const MIN_SIM_INTERVAL = 4000;
export const MAX_SIM_DIVISOR = 15;

export const isTapeWriting = (state: State): boolean => state.sim.isTapeWriting;

export const initialTapeEntries = (state: State): null | string[] => state.sim.initialTapeEntries;

export const currentNode = (state: State): string => {
  if (state.sim.currentNode) {
    return state.sim.currentNode;
  }
  return startNode(state);
};

export const isNodeCurrent = (state: State, id: string): boolean => {
  if (state.sim.currentNode) {
    return state.sim.currentNode === id;
  }
  return isStartNode(state, id);
};

export const activeTapeCell = (state: State): number => state.sim.activeTapeCell;

export const isNodeGlowing = (state: State, id: string): boolean => state.sim.glowingNode === id;

export const isNodeFadingIn = (state: State, id: string): boolean => state.sim.fadeInNode === id;

export const isNodeFadingOut = (state: State, id: string): boolean => state.sim.fadeOutNode === id;

export const isArrowGlowing = (state: State, id: string): boolean => state.sim.glowingArrow === id;

export const isControlPointGlowing = (state: State, id: string): boolean => state.sim.glowingControlPoint === id;

export const glowingTransitionDetail = (state: State): null | string => state.sim.glowingTransitionDetail;

export const simInterval = (state: State): number => (
  Math.floor(MIN_SIM_INTERVAL / state.sim.intervalDivisor)
);

export const simIntervalDivisor = (state: State): number => state.sim.intervalDivisor;

export const simReducer = (state: State, action: Action): SimState => {
  switch (action.type) {
    case A.STEP_SIM:
      return stepSim(state);
    case A.PLAY_SIM:
      return playSim(state);
    case A.RESET_SIM:
      return resetSim(state);
    case A.SET_SIM_INTERVAL_DIVISOR:
      return setSimIntervalDivisor(state, action.payload.divisor);
    case A.SET_CURRENT_NODE:
      return setCurrentNode(state, action.payload.node);
    case A.SET_TAPE_WRITING_STATUS:
      return setTapeWritingStatus(state, action.payload.isWriting);
    case A.MOVE_TAPE:
      return moveTape(state, action.payload.direction);
    case A.SET_GLOWING_NODE:
      return setGlowingNode(state, action.payload.node);
    case A.SET_FADE_IN_NODE:
      return setFadeInNode(state, action.payload.node);
    case A.SET_FADE_OUT_NODE:
      return setFadeOutNode(state, action.payload.node);
    case A.SET_GLOWING_ARROW:
      return setGlowingArrow(state, action.payload.arrow);
    case A.SET_GLOWING_CONTROL_POINT:
      return setGlowingControlPoint(state, action.payload.controlPoint);
    case A.SET_GLOWING_TRANSITION_DETAIL:
      return setGlowingTransitionDetail(state, action.payload.transitionDetail);
    default:
      return state.sim;
  }
};

const stepSim = (state: State): SimState => ({
  ...state.sim,
  hasStarted: true,
  initialTapeEntries: state.sim.hasStarted
    ? state.sim.initialTapeEntries
    : tapeEntries(state),
});

const playSim = (state: State): SimState => ({
  ...state.sim,
  hasStarted: true,
  initialTapeEntries: state.sim.hasStarted
    ? state.sim.initialTapeEntries
    : tapeEntries(state),
});

const resetSim = (state: State): SimState => ({
  ...state.sim,
  hasStarted: false,
  initialTapeEntries: null,
  currentNode: null,
  activeTapeCell: 0,
  isTapeWriting: false,
  glowingNode: null,
  fadeInNode: null,
  fadeOutNode: null,
  glowingArrow: null,
  glowingControlPoint: null,
  glowingTransitionDetail: null,
});

const setSimIntervalDivisor = (state: State, divisor: number): SimState => ({
  ...state.sim,
  intervalDivisor: divisor,
});

const setCurrentNode = (state: State, node: null | string): SimState => ({
  ...state.sim,
  currentNode: node,
});

const setTapeWritingStatus = (state: State, isWriting: boolean): SimState => ({
  ...state.sim,
  isTapeWriting: isWriting,
});

const moveTape = (state: State, direction: TapeDirection): SimState => ({
  ...state.sim,
  activeTapeCell: direction === TapeDirections.R
    ? Math.max(0, state.sim.activeTapeCell - 1)
    : state.sim.activeTapeCell + 1,
});

const setGlowingNode = (state: State, node: null | string): SimState => ({
  ...state.sim,
  glowingNode: node,
});

const setFadeInNode = (state: State, node: null | string): SimState => ({
  ...state.sim,
  fadeInNode: node,
});

const setFadeOutNode = (state: State, node: null | string): SimState => ({
  ...state.sim,
  fadeOutNode: node,
});

const setGlowingArrow = (state: State, arrow: null | string): SimState => ({
  ...state.sim,
  glowingArrow: arrow,
});

const setGlowingControlPoint = (state: State, controlPoint: null | string): SimState => ({
  ...state.sim,
  glowingControlPoint: controlPoint,
});

const setGlowingTransitionDetail = (state: State, transitionDetail: null | string): SimState => ({
  ...state.sim,
  glowingTransitionDetail: transitionDetail,
});
