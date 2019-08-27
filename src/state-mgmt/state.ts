import { NodeState, initNodeState } from './Node';
import { ArrowState, initArrowState } from './Arrow';
import { ControlPointState, initControlPointState } from './ControlPoint';
import { TransitionDetailState, initTransitionDetailState } from './TransitionDetail';
import { UIState, initUIState } from './UI';
import { UndoRedoState, initUndoRedoState } from './UndoRedo';

// The application state consists of a number of "entities" (objects -- in the
// general sense -- that are displayed and interacted with), along with some UI
// info. The UI info is generally useful for a number of the entities.

export interface State {
  entities: {
    nodes: NodeState;
    arrows: ArrowState;
    controlPoints: ControlPointState;
    transitionDetails: TransitionDetailState;
  }
  ui: UIState;
  undoRedo: UndoRedoState;
}

export const initState: State = {
  entities: {
    nodes: initNodeState,
    arrows: initArrowState,
    controlPoints: initControlPointState,
    transitionDetails: initTransitionDetailState,
  },
  ui: initUIState,
  undoRedo: initUndoRedoState,
};
