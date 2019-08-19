export interface Action {
  type: string;
  payload?: any;
}

export const MOUSE_UP_CANVAS = 'MOUSE_UP_CANVAS';
export const mouseUpCanvas = (): Action => ({
  type: MOUSE_UP_CANVAS,
});

export const MOUSE_UP_NODE = 'MOUSE_UP_NODE';
export const mouseUpNode = (id: string): Action => ({
  type: MOUSE_UP_NODE,
  payload: { id },
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
