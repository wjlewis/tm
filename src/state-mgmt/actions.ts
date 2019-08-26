import Vector from '../tools/Vector';
import { TransitionDetail as TransitionDetailInfo } from './TransitionDetail';

export interface Action {
  type: string;
  payload?: any;
}

// Indicates that the user wishes to change a Node's mnemonic. `id` is the ID of
// the Node in question, and `value is the new value.
export const CHANGE_MNEMONIC = 'CHANGE_MNEMONIC';
export const changeMnemonic = (id: string, value: string): Action => ({
  type: CHANGE_MNEMONIC,
  payload: { id, value },
});

// Indicates that the mouse has been pressed down over a Node. `id` is the ID of
// the pressed Node.
export const MOUSE_DOWN_NODE = 'MOUSE_DOWN_NODE';
export const mouseDownNode = (id: string): Action => ({
  type: MOUSE_DOWN_NODE,
  payload: { id },
});

// Indicates that the mouse has been released over a Node.
export const MOUSE_UP_NODE = 'MOUSE_UP_NODE';
export const mouseUpNode = (): Action => ({
  type: MOUSE_UP_NODE,
});

// Indicates that a key has been pressed.
export const KEY_DOWN = 'KEY_DOWN';
export const keyDown = (key: string): Action => ({
  type: KEY_DOWN,
  payload: { key },
});

// Indicates that a key has been released.
export const KEY_UP = 'KEY_UP';
export const keyUp = (key: string): Action => ({
  type: KEY_UP,
  payload: { key },
});

// Indicates that the mouse has been pressed on the canvas. `pos` is the
// position of the mouse relative to the canvas.
export const MOUSE_DOWN_CANVAS = 'MOUSE_DOWN_CANVAS';
export const mouseDownCanvas = (pos: Vector): Action => ({
  type: MOUSE_DOWN_CANVAS,
  payload: { pos },
});

// Indicates that the mouse has been released on the canvas.
export const MOUSE_UP_CANVAS = 'MOUSE_UP_CANVAS';
export const mouseUpCanvas = (): Action => ({
  type: MOUSE_UP_CANVAS,
});

// Indicates that the mouse has been moved within the canvas. `pos` is the
// position of the mouse relative to the canvas.
export const MOUSE_MOVE_CANVAS = 'MOUSE_MOVE_CANVAS';
export const mouseMoveCanvas = (pos: Vector): Action => ({
  type: MOUSE_MOVE_CANVAS,
  payload: { pos },
});

// Indicates that the mouse has been pressed on a control point. `id` is the ID
// of the pressed control point.
export const MOUSE_DOWN_CONTROL_POINT = 'MOUSE_DOWN_CONTROL_POINT';
export const mouseDownControlPoint = (id: string): Action => ({
  type: MOUSE_DOWN_CONTROL_POINT,
  payload: { id },
});

// Indicates that the mouse has been released over a control point.
export const MOUSE_UP_CONTROL_POINT = 'MOUSE_UP_CONTROL_POINT';
export const mouseUpControlPoint = (): Action => ({
  type: MOUSE_UP_CONTROL_POINT,
});

// Indicates that a transition detail has been changed
export const CHANGE_TRANSITION_DETAIL = 'CHANGE_TRANSITION_DETAIL';
export const changeTransitionDetail = (detail: TransitionDetailInfo): Action => ({
  type: CHANGE_TRANSITION_DETAIL,
  payload: { detail },
});

// Indicates that a transition detail has been removed
export const DELETE_TRANSITION_DETAIL = 'DELETE_TRANSITION_DETAIL';
export const deleteTransitionDetail = (id: string, arrow: string): Action => ({
  type: DELETE_TRANSITION_DETAIL,
  payload: { id, arrow },
});

// Indicates that an arrow should be removed
export const DELETE_ARROW = 'DELETE_ARROW';
export const deleteArrow = (id: string): Action => ({
  type: DELETE_ARROW,
  payload: { id },
});

// Indicates that a control point should be removed
export const DELETE_CONTROL_POINT = 'DELETE_CONTROL_POINT';
export const deleteControlPoint = (id: string): Action => ({
  type: DELETE_CONTROL_POINT,
  payload: { id },
});

export const ADD_TRANSITION_DETAIL = 'ADD_TRANSITION_DETAIL';
export const addTransitionDetail = (arrow: string): Action => ({
  type: ADD_TRANSITION_DETAIL,
  payload: { arrow },
});

export const START_ADDING_NODE = 'START_ADDING_NODE';
export const startAddingNode = (): Action => ({
  type: START_ADDING_NODE,
});

export const ADD_NODE = 'ADD_NODE';
export const addNode = (pos: Vector): Action => ({
  type: ADD_NODE,
  payload: { pos },
});

export const DELETE_SELECTED_NODES = 'DELETE_SELECTED_NODES';
export const deleteSelectedNodes = (): Action => ({
  type: DELETE_SELECTED_NODES,
});

export const DELETE_TRANSITION_DETAILS = 'DELETE_TRANSITION_DETAILS';
export const deleteTransitionDetails = (arrow: string): Action => ({
  type: DELETE_TRANSITION_DETAILS,
  payload: { arrow },
});

export const ADD_TRANSITION = 'ADD_TRANSITION';
export const addTransition = (): Action => ({
  type: ADD_TRANSITION,
});

export const ADD_ARROW = 'ADD_ARROW';
export const addArrow = (start: string, end: string): Action => ({
  type: ADD_ARROW,
  payload: { start, end },
});

export const ADD_CONTROL_POINT = 'ADD_CONTROL_POINT';
export const addControlPoint = (arrow: string, pos: Vector): Action => ({
  type: ADD_CONTROL_POINT,
  payload: { arrow, pos },
});

export const MAKE_START_NODE = 'MAKE_START_NODE';
export const makeStartNode = (): Action => ({
  type: MAKE_START_NODE,
});

export const TOGGLE_ACCEPTING_NODES = 'TOGGLE_ACCEPTING_NODES';
export const toggleAcceptingNodes = (): Action => ({
  type: TOGGLE_ACCEPTING_NODES,
});
