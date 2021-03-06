import { NodeState, initNodeState } from './Node';
import { ArrowState, initArrowState } from './Arrow';
import { ControlPointState, initControlPointState } from './ControlPoint';
import { TransitionDetailState, initTransitionDetailState } from './TransitionDetail';
import { TapeState, initTapeState } from './Tape';
import { UIState, initUIState } from './UI';
import { UndoRedoState, initUndoRedoState } from './UndoRedo';
import { MessageState, initMessageState } from './Message';
import { ModeState, initModeState } from './Mode';
import { SimState, initSimState } from './Sim';
import { MetaDataState, initMetaDataState } from './MetaData';

// The application state consists of a number of "entities" (objects -- in the
// general sense -- that are displayed and interacted with), along with some UI
// info. The UI info is generally useful for a number of the entities.

export interface State {
  entities: {
    nodes: NodeState;
    arrows: ArrowState;
    controlPoints: ControlPointState;
    transitionDetails: TransitionDetailState;
    tape: TapeState;
    metaData: MetaDataState;
  }
  ui: UIState;
  undoRedo: UndoRedoState;
  message: MessageState;
  mode: ModeState;
  sim: SimState;
}

export const initState: State = {
  entities: {
    nodes: initNodeState,
    arrows: initArrowState,
    controlPoints: initControlPointState,
    transitionDetails: initTransitionDetailState,
    tape: initTapeState,
    metaData: initMetaDataState,
  },
  ui: initUIState,
  undoRedo: initUndoRedoState,
  message: initMessageState,
  mode: initModeState,
  sim: initSimState,
};
