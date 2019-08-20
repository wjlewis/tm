export interface Action {
  type: string;
  payload?: any;
}

export const MOUSE_UP_CANVAS = 'MOUSE_UP_CANVAS';
export const mouseUpCanvas = (): Action => ({
  type: MOUSE_UP_CANVAS,
});

export const MOUSE_DOWN_CANVAS = 'MOUSE_DOWN_CANVAS';
export const mouseDownCanvas = (offsetX: number, offsetY: number): Action => ({
  type: MOUSE_DOWN_CANVAS,
  payload: { offsetX, offsetY },
});

export const MOUSE_UP_NODE = 'MOUSE_UP_NODE';
export const mouseUpNode = (): Action => ({
  type: MOUSE_UP_NODE,
});

export const MOUSE_DOWN_NODE = 'MOUSE_DOWN_NODE';
export const mouseDownNode = (id: string): Action => ({
  type: MOUSE_DOWN_NODE,
  payload: { id },
});

export const MOUSE_MOVE = 'MOUSE_MOVE';
export const mouseMove = (offsetX: number, offsetY: number): Action => ({
  type: MOUSE_MOVE,
  payload: { offsetX, offsetY },
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

export const REMOVE_SELECTED_NODES = 'REMOVE_SELECTED_NODES';
export const removeSelectedNodes = (): Action => ({
  type: REMOVE_SELECTED_NODES,
});

export const BEGIN_ADD_NODE = 'BEGIN_ADD_NODE';
export const beginAddNode = (): Action => ({
  type: BEGIN_ADD_NODE,
});

export const ADD_NODE = 'ADD_NODE';
export const addNode = (id: string, x: number, y: number): Action => ({
  type: ADD_NODE,
  payload: { id, x, y },
});

export const MOUSE_DOWN_TRANSITION_CONTROL = 'MOUSE_DOWN_TRANSITION_CONTROL';
export const mouseDownTransitionControl = (id: string): Action => ({
  type: MOUSE_DOWN_TRANSITION_CONTROL,
  payload: { id },
});

export const MOUSE_UP_TRANSITION_CONTROL = 'MOUSE_UP_TRANSITION_CONTROL';
export const mouseUpTransitionControl = (): Action => ({
  type: MOUSE_UP_TRANSITION_CONTROL,
});
