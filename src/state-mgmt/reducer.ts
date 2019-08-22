import { Action } from './actions'
import { State, initState } from './state';
import { nodesReducer } from './Node';
import { controlPointsReducer } from './ControlPoint';
import { uiReducer } from './UI';

const reducer = (state: State=initState, action: Action): State => {
  switch (action.type) {

    // Most actions are handled by reducers specific to a particular part of the
    // state
    default:
      return {
        ...state,
        entities: {
          ...state.entities,
          nodes: nodesReducer(state, action),
          controlPoints: controlPointsReducer(state, action),
        },
        ui: uiReducer(state, action),
      };
  }
};

export default reducer;
