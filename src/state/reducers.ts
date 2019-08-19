import { Action } from './actions';
import * as actions from './actions';
import { mouseUpCanvas, mouseUpNode } from './nodes';

export interface State {
  entities: Entities;
  ui: UiInfo;
}

export interface Entities {
  nodes: NodeEntities;
}

export interface NodeEntities {
  wip: null | NodeInfo;
  committed: NodeInfo;
}

export interface NodeInfo {
  byId: { [key: string]: Node };
  selected: string[];
}

export interface Node {
  id: string;
  x: number;
  y: number;
}

export interface UiInfo {
  multiSelect: boolean;
}

const initState: State = {
  entities: {
    nodes: {
      wip: null,
      committed: {
        byId: {
          'q0': {
            id: 'q0',
            x: 300,
            y: 150,
          },
          'q1': {
            id: 'q1',
            x: 500,
            y: 310,
          },
          'q2': {
            id: 'q2',
            x: 40,
            y: 360,
          },
        },
        selected: [],
      },
    },
  },
  ui: {
    multiSelect: false,
  },
};

const reduce = (state: State=initState, action: Action): State => {
  switch (action.type) {
    case actions.MOUSE_UP_CANVAS:
      return {
        ...state,
        entities: {
          ...state.entities,
          nodes: mouseUpCanvas(state),
        },
      };
    case actions.MOUSE_UP_NODE:
      return {
        ...state,
        entities: {
          ...state.entities,
          nodes: mouseUpNode(state, action.payload.id),
        },
      };
    case actions.KEY_DOWN:
      return {
        ...state,
        ui: {
          multiSelect: action.payload.key === 'Shift' || state.ui.multiSelect,
        },
      };
    case actions.KEY_UP:
      return {
        ...state,
        ui: {
          multiSelect: action.payload.key === 'Shift' ? false : state.ui.multiSelect,
        },
      };
    default:
      return state;
  }
};

export default reduce;
