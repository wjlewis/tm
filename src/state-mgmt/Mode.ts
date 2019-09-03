import { State } from './state';
import { Action } from './actions';

export interface ModeState {
  mode: Mode;
}

export type Mode = 'EDIT' | 'SIM';

export const Modes: { [key: string]: Mode } = {
  EDIT: 'EDIT',
  SIM: 'SIM',
};

export const initModeState: ModeState = {
  mode: Modes.EDIT,
};

// Test if we are currently in edit mode:
export const isInEditMode = (state: State): boolean => state.mode.mode === Modes.EDIT;

export const modeReducer = (state: State, action: Action): ModeState => {
  switch (action.type) {
    default:
      return state.mode;
  }
};
