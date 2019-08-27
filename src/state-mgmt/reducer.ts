import { Action } from './actions'
import { State, initState } from './state';
import { nodesReducer } from './Node';
import { arrowsReducer } from './Arrow';
import { controlPointsReducer } from './ControlPoint';
import { transitionDetailsReducer } from './TransitionDetail';
import { uiReducer } from './UI';

const reducer = (state: State=initState, action: Action): State => ({
  ...state,
  entities: {
    ...state.entities,
    nodes: nodesReducer(state, action),
    arrows: arrowsReducer(state, action),
    controlPoints: controlPointsReducer(state, action),
    transitionDetails: transitionDetailsReducer(state, action),
  },
  ui: uiReducer(state, action),
});

export default reducer;
