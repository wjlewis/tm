import { Action } from './actions'
import * as A from './actions';
import { State, initState } from './state';
import { nodesReducer } from './Node';
import { arrowsReducer } from './Arrow';
import { controlPointsReducer } from './ControlPoint';
import { transitionDetailsReducer } from './TransitionDetail';
import { tapeReducer } from './Tape';
import { uiReducer } from './UI';
import { undoRedoReducer, undo, redo } from './UndoRedo';
import { messageReducer } from './Message';
import { modeReducer } from './Mode';
import { simReducer } from './Sim';
import { metaDataReducer } from './MetaData';
import { revertToSnapshot } from './auxiliary';

const reducer = (state: State=initState, action: Action): State => {
  switch (action.type) {
    case A.UNDO:
      return undo(state);
    case A.REDO:
      return redo(state);
    case A.INSTALL_SNAPSHOT:
      return revertToSnapshot(state, action.payload.snapshot);
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

export default reducer;
