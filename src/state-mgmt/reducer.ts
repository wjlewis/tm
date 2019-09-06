import { Action } from './actions'
import * as A from './actions';
import { State, initState } from './state';
import { nodesReducer } from './Node';
import { arrowsReducer } from './Arrow';
import { controlPointsReducer } from './ControlPoint';
import { transitionDetailsReducer } from './TransitionDetail';
import { tapeReducer } from './Tape';
import { uiReducer } from './UI';
import { undoRedoReducer, undo, redo, addRecord } from './UndoRedo';
import { messageReducer } from './Message';
import { modeReducer } from './Mode';
import { simReducer } from './Sim';
import { metaDataReducer } from './MetaData';
import { getSnapshot, revertToSnapshot } from './auxiliary';

const reducer = (state: State=initState, action: Action): State => {
  switch (action.type) {
    case A.UNDO:
      return undo(state);
    case A.REDO:
      return redo(state);
    case A.INSTALL_SNAPSHOT:
      return installSnapshot(state, action.payload.snapshot);
    case A.NEW_MACHINE:
      return newMachine(state);
    default:
      return {
        ...state,
        entities: {
          ...state.entities,
          nodes: nodesReducer(state, action),
          arrows: arrowsReducer(state, action),
          controlPoints: controlPointsReducer(state, action),
          transitionDetails: transitionDetailsReducer(state, action),
          tape: tapeReducer(state, action),
          metaData: metaDataReducer(state, action),
        },
        ui: uiReducer(state, action),
        undoRedo: undoRedoReducer(state, action),
        message: messageReducer(state, action),
        mode: modeReducer(state, action),
        sim: simReducer(state, action),
      };
  }
};

// We manually add action records for these actions since they affect the entire
// state (the entities, at least).
const installSnapshot = (state: State, snapshot: any): State => ({
  ...revertToSnapshot(state, snapshot),
  undoRedo: addRecord(state, 'install entity snapshot'),
});

const newMachine = (state: State): State => {
  const freshSnapshot = getSnapshot(initState);
  return {
    ...revertToSnapshot(state, freshSnapshot),
    undoRedo: addRecord(state, 'create new machine'),
  };
};

export default reducer;
