import _ from 'lodash';
import { State } from './state';
import { Action } from './actions';
import * as A from './actions';

export interface UIState {
  keysDown: string[];
  isMouseDownNode: boolean;
  isMouseDownControlPoint: boolean;
}

export const initUIState: UIState = {
  keysDown: [],
  isMouseDownNode: false,
  isMouseDownControlPoint: false,
};

// Selectors
export const isMultiselect = (state: State): boolean => state.ui.keysDown.includes('Shift');

export const isMouseDownNode = (state: State): boolean => state.ui.isMouseDownNode;

export const isMouseDownControlPoint = (state: State): boolean => state.ui.isMouseDownControlPoint;

// Reducer
export const uiReducer = (state: State, action: Action): UIState => {
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
    case A.MOUSE_UP_CANVAS:
      return mouseUpCanvas(state);
    default:
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
});

const mouseDownControlPoint = (state: State): UIState => ({
  ...state.ui,
  isMouseDownControlPoint: true,
});

const mouseUpControlPoint = (state: State): UIState => ({
  ...state.ui,
  isMouseDownControlPoint: false,
});

const mouseUpCanvas = (state: State): UIState => ({
  ...state.ui,
  isMouseDownNode: false,
  isMouseDownControlPoint: false,
});
