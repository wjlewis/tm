import Vector from '../tools/Vector';
import { TransitionDetail as TransitionDetailInfo } from './TransitionDetail';

// Many actions are specific to a particular part of the state (e.g. to nodes,
// or arrows), and I've grouped these for easy access. However, a number of
// actions are more general; these I've placed at the bottom of the file.

export interface Action {
  type: string;
  payload?: any;
}

// Node actions:
export const MOUSE_DOWN_NODE = 'MOUSE_DOWN_NODE';
export const mouseDownNode = (id: string): Action => ({
  type: MOUSE_DOWN_NODE,
  payload: { id },
});

export const MOUSE_UP_NODE = 'MOUSE_UP_NODE';
export const mouseUpNode = (): Action => ({
  type: MOUSE_UP_NODE,
});

// We have 2 actions related to adding a node instead of one: the first
// indicates that the user is in the process of adding a node, but has not yet
// fixed its placement on the screen; the second indicates that the node should
// be added at a particular location -- where the user has clicked.
export const START_ADDING_NODE = 'START_ADDING_NODE';
export const startAddingNode = (): Action => ({
  type: START_ADDING_NODE,
});

export const ADD_NODE = 'ADD_NODE';
export const addNode = (pos: Vector): Action => ({
  type: ADD_NODE,
  payload: { pos },
});

export const CHANGE_MNEMONIC = 'CHANGE_MNEMONIC';
export const changeMnemonic = (id: string, value: string): Action => ({
  type: CHANGE_MNEMONIC,
  payload: { id, value },
});

export const BLUR_MNEMONIC = 'BLUR_MNEMONIC';
export const blurMnemonic = (): Action => ({
  type: BLUR_MNEMONIC,
});

export const DELETE_SELECTED_NODES = 'DELETE_SELECTED_NODES';
export const deleteSelectedNodes = (): Action => ({
  type: DELETE_SELECTED_NODES,
});

export const MAKE_SELECTED_START_NODE = 'MAKE_SELECTED_START_NODE';
export const makeSelectedStartNode = (): Action => ({
  type: MAKE_SELECTED_START_NODE,
});

export const TOGGLE_SELECTED_FINAL_NODES = 'TOGGLE_SELECTED_FINAL_NODES';
export const toggleSelectedFinalNodes = (): Action => ({
  type: TOGGLE_SELECTED_FINAL_NODES,
});

// Arrow actions:
// We include the arrow's ID as part of the payload because when we create a new
// arrow, we also create a control point and transition detail for it as well
// (and these require the arrow's ID).
export const ADD_ARROW = 'ADD_ARROW';
export const addArrow = (start: string, end: string, id: string): Action => ({
  type: ADD_ARROW,
  payload: { start, end, id },
});

// Control point actions:
export const MOUSE_DOWN_CONTROL_POINT = 'MOUSE_DOWN_CONTROL_POINT';
export const mouseDownControlPoint = (id: string): Action => ({
  type: MOUSE_DOWN_CONTROL_POINT,
  payload: { id },
});

export const MOUSE_UP_CONTROL_POINT = 'MOUSE_UP_CONTROL_POINT';
export const mouseUpControlPoint = (): Action => ({
  type: MOUSE_UP_CONTROL_POINT,
});

// Transition-detail actions:
export const CHANGE_TRANSITION_DETAIL = 'CHANGE_TRANSITION_DETAIL';
export const changeTransitionDetail = (detail: TransitionDetailInfo): Action => ({
  type: CHANGE_TRANSITION_DETAIL,
  payload: { detail },
});

export const ADD_TRANSITION_DETAIL = 'ADD_TRANSITION_DETAIL';
export const addTransitionDetail = (arrow: string): Action => ({
  type: ADD_TRANSITION_DETAIL,
  payload: { arrow },
});

export const DELETE_TRANSITION_DETAIL = 'DELETE_TRANSITION_DETAIL';
export const deleteTransitionDetail = (id: string, arrow: string): Action => ({
  type: DELETE_TRANSITION_DETAIL,
  payload: { id, arrow },
});

export const FOCUS_TRANSITION_DETAIL = 'FOCUS_TRANSIITON_DETAIL';
export const focusTransitionDetail = (id: string): Action => ({
  type: FOCUS_TRANSITION_DETAIL,
  payload: { id },
});

export const BLUR_TRANSITION_DETAIL = 'BLUR_TRANSITION_DETAIL';
export const blurTransitionDetail = (id: string): Action => ({
  type: BLUR_TRANSITION_DETAIL,
  payload: { id },
});

export const MARK_DUPLICATE_TRANSITIONS = 'MARK_DUPLICATE_TRANSITIONS';
export const markDuplicateTransitions = (ids: string[]): Action => ({
  type: MARK_DUPLICATE_TRANSITIONS,
  payload: { ids },
});

// Tape actions:
export const SET_TAPE_CENTER = 'SET_TAPE_CENTER';
export const setTapeCenter = (pos: number): Action => ({
  type: SET_TAPE_CENTER,
  payload: { pos },
});

export const CHANGE_TAPE_CELL = 'CHANGE_TAPE_CELL';
export const changeTapeCell = (pos: number, value: string): Action => ({
  type: CHANGE_TAPE_CELL,
  payload: { pos, value },
});

// Canvas and UI actions:
export const MOUSE_DOWN_CANVAS = 'MOUSE_DOWN_CANVAS';
export const mouseDownCanvas = (pos: Vector): Action => ({
  type: MOUSE_DOWN_CANVAS,
  payload: { pos },
});

export const MOUSE_UP_CANVAS = 'MOUSE_UP_CANVAS';
export const mouseUpCanvas = (): Action => ({
  type: MOUSE_UP_CANVAS,
});

export const MOUSE_MOVE_CANVAS = 'MOUSE_MOVE_CANVAS';
export const mouseMoveCanvas = (pos: Vector): Action => ({
  type: MOUSE_MOVE_CANVAS,
  payload: { pos },
});

export const KEY_DOWN = 'KEY_DOWN';
export const keyDown = (key: string): Action => ({
  type: KEY_DOWN,
  payload: { key },
});

export const KEY_UP = 'KEY_UP';
export const keyUp = (key: string): Action => ({
  type: KEY_UP,
  payload: { key },
});

// General actions:
export const ADD_TRANSITION_BETWEEN_SELECTED = 'ADD_TRANSITION_BETWEEN_SELECTED';
export const addTransitionBetweenSelected = (): Action => ({
  type: ADD_TRANSITION_BETWEEN_SELECTED,
});

export const DELETE_ENTITIES = 'DELETE_ENTITIES';
export const deleteEntities = (nodes: string[], arrows: string[], controlPoints: string[], transitionDetails: string[]): Action => ({
  type: DELETE_ENTITIES,
  payload: { nodes, arrows, controlPoints, transitionDetails },
});

export const UNDO = 'UNDO';
export const undo = (): Action => ({
  type: UNDO,
});

export const REDO = 'REDO';
export const redo = (): Action => ({
  type: REDO,
});
