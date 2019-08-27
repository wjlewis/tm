import _ from 'lodash/fp';
import { Action } from './actions';
import * as A from './actions';
import { State } from './state';

export interface UndoRedoState {
  actions: ActionRecord[];
  redoable: ActionRecord[];
}

export interface ActionRecord {
  path: string;
  value: any;
  description?: string;
}

export const initUndoRedoState: UndoRedoState = {
  actions: [],
  redoable: [],
};

export const undoRedoReducer = (state: State, action: Action): UndoRedoState => {
  switch (action.type) {
    case A.DELETE_ENTITIES:
      return addRecord(state, 'entities', 'delete selected nodes');
    case A.ADD_NODE:
      return addRecord(state, 'entities.nodes', 'add node');
    case A.BLUR_MNEMONIC:
      return addRecord(state, 'entities.nodes.committed', 'change mnemonic');
    default:
      return state.undoRedo;
  }
};

export const undo = (state: State): State => {
  if (state.undoRedo.actions.length === 0) return state;
  const [record, ...rest] = state.undoRedo.actions;
  // Save current value for redo:
  const redoValue = _.get(record.path, state);
  const redoRecord = { ...record, value: redoValue };
  const updated = _.set(record.path, record.value, state);
  return {
    ...updated,
    undoRedo: {
      ...state.undoRedo,
      actions: rest,
      redoable: [redoRecord, ...state.undoRedo.redoable],
    },
  };
};

export const redo = (state: State): State => {
  if (state.undoRedo.redoable.length === 0) return state;
  const [record, ...rest] = state.undoRedo.redoable;
  // Save current value for undo:
  const undoValue = _.get(record.path, state);
  const undoRecord = { ...record, value: undoValue };
  const updated = _.set(record.path, record.value, state);
  return {
    ...updated,
    undoRedo: {
      ...state.undoRedo,
      actions: [undoRecord, ...state.undoRedo.actions],
      redoable: rest,
    },
  };
};

// Each time we add a record to the undo stack, we clear the redo stack.
const addRecord = (state: State, path: string, description?: string): UndoRedoState => {
  const record = { path, description, value: _.get(path, state) };
  return {
    actions: [record, ...state.undoRedo.actions],
    redoable: [],
  };
};
