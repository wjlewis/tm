import _ from 'lodash';
import { Action } from './actions';
import * as A from './actions';
import { State } from './state';
import { repeat } from '../tools/auxiliary';

export interface TapeState {
  entries: string[];
  scrollLeft: number;
  active: number;
  focused: number | null;
}

export const CELL_WIDTH = 36;
export const VISIBLE_CELL_COUNT = 20;

export const initTapeState: TapeState = {
  entries: repeat('', VISIBLE_CELL_COUNT),
  scrollLeft: 0,
  active: 0,
  focused: null,
};

export type TapeDirection = 'L' | 'R';
export const TapeDirections: { [key: string]: TapeDirection } = {
  L: 'L',
  R: 'R',
};

// Return an array containing all of the tape entries, along with entries
// containing empty values for nonexistent intermediate entries.
export const tapeEntries = (state: State): string[] => state.entities.tape.entries;

export const activeTapeCell = (state: State): number => state.entities.tape.active;

export const focusedTapeCell = (state: State): null | number => state.entities.tape.focused;

export const currentReadSymbol = (state: State): string => {
  const { tape } = state.entities;
  return tape.entries[tape.active];
};

export const tapeReducer = (state: State, action: Action): TapeState => {
  switch (action.type) {
    case A.CHANGE_TAPE_CELL:
      return changeTapeCell(state, action.payload.pos, action.payload.value);
    case A.UPDATE_SCROLL_LEFT:
      return updateScrollLeft(state, action.payload.scrollLeft);
    case A.FOCUS_TAPE_CELL:
      return focusTapeCell(state, action.payload.pos);
    case A.CLEAR_TAPE:
      return clearTape(state);
    case A.MOVE_TAPE:
      return moveTape(state, action.payload.direction);
    case A.WRITE_TAPE_SYMBOL:
      return writeTapeSymbol(state, action.payload.symbol);
    default:
      return state.entities.tape;
  }
};

const changeTapeCell = (state: State, pos: number, value: string): TapeState => ({
  ...state.entities.tape,
  entries: _.update(_.clone(state.entities.tape.entries), pos, _ => value),
  focused: value.length > 0 && state.entities.tape.focused !== null
    ? state.entities.tape.focused + 1
    : state.entities.tape.focused,
});

const focusTapeCell = (state: State, pos: number): TapeState => ({
  ...state.entities.tape,
  focused: pos,
});

const clearTape = (state: State): TapeState => initTapeState;

const updateScrollLeft = (state: State, scrollLeft: number): TapeState => ({
  ...state.entities.tape,
  entries: updateBlocks(state.entities.tape.entries, scrollLeft),
  scrollLeft,
});

const updateBlocks = (entries: string[], leftPos: number): string[] => {
  const BLOCK_SIZE = 20;
  const cellDiff = entries.length - Math.floor(leftPos / CELL_WIDTH);
  // If there is less than a block between the current scroll position and the
  // end of the tape, we add a new empty block.
  if (cellDiff < BLOCK_SIZE) {
    return [...entries, ...repeat('', BLOCK_SIZE)];
  }
  // If there is an EMPTY block at the end of the tape, and there are at least 2
  // blocks between the current scroll position and the end, we remove the empty
  // block.
  else if (cellDiff > 2 * BLOCK_SIZE && entries.slice(-BLOCK_SIZE).every(val => val.length === 0)) {
    return entries.slice(0, -BLOCK_SIZE);
  }
  return entries;
};

const moveTape = (state: State, direction: 'L' | 'R'): TapeState => ({
  ...state.entities.tape,
  active: state.entities.tape.active + (direction === 'L' ? +1 : -1),
});

const writeTapeSymbol = (state: State, symbol: string): TapeState => {
  const { tape } = state.entities;
  return {
    ...tape,
    entries: _.set(_.clone(tape.entries), tape.active, symbol),
  };
};
