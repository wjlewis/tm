import { NodeState, initNodeState } from './Node';
import { ArrowState, initArrowState } from './Arrow';
import { ControlPointState, initControlPointState } from './ControlPoint';
import { TransitionDetailState, initTransitionDetailState } from './TransitionDetail';
import { UIState, initUIState } from './UI';

export interface State {
  entities: {
    nodes: NodeState;
    arrows: ArrowState;
    controlPoints: ControlPointState;
    transitionDetails: TransitionDetailState;
  }
  ui: UIState;
}

export const initState: State = {
  entities: {
    nodes: initNodeState,
    arrows: initArrowState,
    controlPoints: initControlPointState,
    transitionDetails: initTransitionDetailState,
  },
  ui: initUIState,
};
