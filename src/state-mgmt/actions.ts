import Vector from '../tools/Vector';

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
