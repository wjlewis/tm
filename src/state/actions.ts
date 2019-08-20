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

export const MOUSE_DRAG = 'MOUSE_DRAG';
export const mouseDrag = (offsetX: number, offsetY: number): Action => ({
  type: MOUSE_DRAG,
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
