import uuid from 'uuid/v4';
import { Action } from './actions'
import * as A from './actions';
import { State, initState } from './state';
import { nodesReducer, selectedNodes, nodeById } from './Node';
import { arrowsReducer, arrowForEndpoints } from './Arrow';
import { controlPointsReducer } from './ControlPoint';
import { transitionDetailsReducer } from './TransitionDetail';
import { uiReducer } from './UI';
import Vector from '../tools/Vector';

const reducer = (state: State=initState, action: Action): State => {
  switch (action.type) {
    case A.ADD_TRANSITION:
      return addTransition(state);

    // Most actions are handled by reducers specific to a particular part of the
    // state
    default:
      return {
        ...state,
        entities: {
          ...state.entities,
          nodes: nodesReducer(state, action),
          arrows: arrowsReducer(state, action),
          controlPoints: controlPointsReducer(state, action),
          transitionDetails: transitionDetailsReducer(state, action),
        },
        ui: uiReducer(state, action),
      };
  }
};

const addTransition = (state: State): State => {
  const nodes = selectedNodes(state).map(id => nodeById(state, id));
  const start = nodes[0];
  const end = nodes[1] || nodes[0];

  const transitionDetailId = uuid();
  const existingArrow = arrowForEndpoints(state, start.id, end.id);
  if (!existingArrow) {
    const arrowId = uuid();
    const controlPos = nodes.length === 1
    ? start.pos.minus(new Vector(0, 120))
    : end.pos.minus(start.pos).scale(1 / 2).plus(start.pos);
    const controlPointId = uuid();
    return {
      ...state,
      entities: {
        ...state.entities,
        arrows: {
          ...state.entities.arrows,
          wip: null,
          committed: {
            ...state.entities.arrows.committed,
            byId: {
              ...state.entities.arrows.committed.byId,
              [arrowId]: { id: arrowId, start: start.id, end: end.id },
            },
          },
        },
        controlPoints: {
          ...state.entities.controlPoints,
          wip: null,
          committed: {
            ...state.entities.controlPoints.committed,
            byId: {
              ...state.entities.controlPoints.committed.byId,
              [controlPointId]: { id: controlPointId, arrow: arrowId, pos: controlPos },
            },
          },
        },
        transitionDetails: {
          ...state.entities.transitionDetails,
          wip: null,
          committed: {
            ...state.entities.transitionDetails.committed,
            byId: {
              ...state.entities.transitionDetails.committed.byId,
              [transitionDetailId]: { id: transitionDetailId, arrow: arrowId, read: '', write: '', move: ''},
            },
          },
        },
      },
    };
  }

  return {
    ...state,
    entities: {
      ...state.entities,
      transitionDetails: {
        ...state.entities.transitionDetails,
        wip: null,
        committed: {
          ...state.entities.transitionDetails.committed,
          byId: {
            ...state.entities.transitionDetails.committed.byId,
            [transitionDetailId]: { id: transitionDetailId, arrow: existingArrow.id, read: '', write: '', move: ''},
          },
        },
      },
    },
  };
};

export default reducer;
