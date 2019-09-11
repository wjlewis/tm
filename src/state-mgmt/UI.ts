import _ from 'lodash';
import { State } from './state';
import { Action } from './actions';
import * as A from './actions';
import Vector from '../tools/Vector';
import { isInEditMode } from './Mode';

// The UI state is fairly self-explanatory: it consists of miscellaneous tidbits
// of information regarding where the mouse is, what keys are pressed, etc.

export interface UIState {
  mousePos: Vector;
  keysDown: string[];
  isMouseDownNode: boolean;
  isMouseDownControlPoint: boolean;
  isAddingNode: boolean;
  wasMouseReleasedOverNode: boolean;
  wasMouseDragged: boolean;
}

export const initUIState: UIState = {
  mousePos: new Vector(0, 0),
  keysDown: [],
  isMouseDownNode: false,
  isMouseDownControlPoint: false,
  isAddingNode: false,
  wasMouseReleasedOverNode: false,
  wasMouseDragged: false,
};

// Return the current mouse position.
export const mousePos = (state: State): Vector => state.ui.mousePos;

// Test if we are currently in "multiselect" mode.
export const isMultiselect = (state: State): boolean => state.ui.keysDown.includes('Shift');

// Test if the mouse is currently pressed over a node.
export const isMouseDownNode = (state: State): boolean => state.ui.isMouseDownNode;

// Test if the mouse is current pressed over a control point.
export const isMouseDownControlPoint = (state: State): boolean => state.ui.isMouseDownControlPoint;

// Test if we are in the process of adding a node.
export const isAddingNode = (state: State): boolean => state.ui.isAddingNode;

export const wasMouseReleasedOverNode = (state: State): boolean => state.ui.wasMouseReleasedOverNode;

export const wasMouseDragged = (state: State): boolean => state.ui.wasMouseDragged;

export const uiReducer = (state: State, action: Action): UIState => {
  if (isInEditMode(state)) {
    switch (action.type) {
      case A.KEY_DOWN:
        return keyDown(state, action.payload.key);
      case A.KEY_UP:
        return keyUp(state, action.payload.key);
      case A.MOUSE_DOWN_NODE:
        return mouseDownNode(state);
      case A.MOUSE_UP_NODE:
        return mouseUpNode(state);
      case A.MOUSE_DOWN_CONTROL_POINT:
        return mouseDownControlPoint(state);
      case A.MOUSE_UP_CONTROL_POINT:
        return mouseUpControlPoint(state);
      case A.MOUSE_DOWN_CANVAS:
        return mouseDownCanvas(state);
      case A.MOUSE_UP_CANVAS:
        return mouseUpCanvas(state);
      case A.START_ADDING_NODE:
        return startAddingNode(state);
      case A.ADD_NODE:
        return addNode(state);
      case A.MOUSE_MOVE_CANVAS:
        return mouseMoveCanvas(state, action.payload.pos);
      default:
        return state.ui;
    }
  }
  else {
    return state.ui;
  }
};

const keyDown = (state: State, key: string): UIState => ({
  ...state.ui,
  keysDown: _.uniq([...state.ui.keysDown, key]),
});

const keyUp = (state: State, key: string): UIState => ({
  ...state.ui,
  keysDown: state.ui.keysDown.filter(k => k !== key),
});

const mouseDownNode = (state: State): UIState => ({
  ...state.ui,
  isMouseDownNode: true,
});

const mouseUpNode = (state: State): UIState => ({
  ...state.ui,
  isMouseDownNode: false,
  wasMouseReleasedOverNode: true,
});

const mouseDownControlPoint = (state: State): UIState => ({
  ...state.ui,
  isMouseDownControlPoint: true,
});

const mouseUpControlPoint = (state: State): UIState => ({
  ...state.ui,
  isMouseDownControlPoint: false,
});

const mouseDownCanvas = (state: State): UIState => ({
  ...state.ui,
  wasMouseDragged: false,
});

const mouseUpCanvas = (state: State): UIState => ({
  ...state.ui,
  isMouseDownNode: false,
  isMouseDownControlPoint: false,
  wasMouseReleasedOverNode: false,
});

const startAddingNode = (state: State): UIState => ({
  ...state.ui,
  isAddingNode: true,
});

const addNode = (state: State): UIState => ({
  ...state.ui,
  isAddingNode: false,
  wasMouseReleasedOverNode: true,
});

const mouseMoveCanvas = (state: State, pos: Vector): UIState => ({
  ...state.ui,
  mousePos: pos,
  wasMouseDragged: true,
});
