import { Action } from './actions';
import * as A from './actions';
import { State } from './state';
import { isInEditMode } from './Mode';
import { wasMouseDragged } from './UI';
import { getSnapshot, revertToSnapshot } from './auxiliary';

export interface UndoRedoState {
  actions: ActionRecord[];
  redoable: ActionRecord[];
}

export interface ActionRecord {
  value: any;
  description?: string;
}

export const initUndoRedoState: UndoRedoState = {
  actions: [],
  redoable: [],
};

export const undoRedoReducer = (state: State, action: Action): UndoRedoState => {
  if (isInEditMode(state)) {
    switch (action.type) {
      case A.MOUSE_UP_NODE:
        return mouseUpNode(state);
      case A.MOUSE_UP_CONTROL_POINT:
        return mouseUpControlPoint(state);
      case A.ADD_NODE:
        return addRecord(state, 'add node');
      case A.MAKE_SELECTED_START_NODE:
        return addRecord(state, 'change initial state');
      case A.TOGGLE_SELECTED_FINAL_NODES:
        return addRecord(state, 'toggle "final" status for selected states');
      case A.ADD_ARROW:
        return addRecord(state, 'add new transition');
      case A.ADD_TRANSITION_DETAIL:
        return addRecord(state, 'add new transition');
      case A.DELETE_ENTITIES:
        return addRecord(state, 'delete entities');
      case A.CHANGE_TRANSITION_DETAIL:
        return addRecord(state, 'change transition');
      case A.CHANGE_TAPE_CELL:
        return addRecord(state, 'change tape cell');
      case A.CLEAR_TAPE:
        return addRecord(state, 'clear tape');
      default:
        return state.undoRedo;
    }
  }
  else {
    return state.undoRedo;
  }
};

// We need to be a little careful before adding an action record when the mouse
// is released over a node (or control point), since the user may not have
// actually MOVED the node at all, but instead simply selected it. Thus, we
// first check if the mouse was dragged before adding the record.
const mouseUpNode = (state: State): UndoRedoState => {
  if (wasMouseDragged(state)) return addRecord(state, 'move node');
  else return state.undoRedo;
};

const mouseUpControlPoint = (state: State): UndoRedoState => {
  if (wasMouseDragged(state)) return addRecord(state, 'move control point');
  else return state.undoRedo;
};

export const undo = (state: State): State => {
  if (state.undoRedo.actions.length === 0) return state;
  const [record, ...rest] = state.undoRedo.actions;
  // Save current value for redo:
  const redoValue = getSnapshot(state);
  const redoRecord = { ...record, value: redoValue };
  const updated = revertToSnapshot(state, record.value);
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
  const undoValue = getSnapshot(state);
  const undoRecord = { ...record, value: undoValue };
  const updated = revertToSnapshot(state, record.value);
  return {
    ...updated,
    undoRedo: {
      ...state.undoRedo,
      actions: [undoRecord, ...state.undoRedo.actions],
      redoable: rest,
    },
  };
};

const MAX_UNDOS = 32;

export const addRecord = (state: State, description?: string): UndoRedoState => {
  const record = { description, value: getSnapshot(state) };
  return {
    // In order to prevent excessive memory usage, we limit the number of undos.
    // Each time a record is added, we make sure that the array of actions
    // contains only the N most recent records, and then add the new one.
    actions: [record, ...state.undoRedo.actions.slice(0, MAX_UNDOS)],
    // Each time we add a record to the undo stack, we clear the redo stack.
    redoable: [],
  };
};
