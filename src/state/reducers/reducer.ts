import { Action } from '../actions';
import * as actions from '../actions';
import * as nodes from './nodes';
import * as transitions from './transitions';

export interface State {
  entities: Entities;
  ui: UiInfo;
}

export interface Entities {
  nodes: NodeEntities;
  transitions: TransitionEntities;
}

export interface NodeEntities {
  wip: null | NodeInfo;
  committed: NodeInfo;
}

export interface NodeInfo {
  byId: { [key: string]: Node };
  selected: string[];
  offsets: null | NodeOffset[];
}

export interface NodeOffset {
  id: string;
  offsetX: number;
  offsetY: number;
}

export interface Node {
  id: string;
  x: number;
  y: number;
}

export interface TransitionEntities {
  wip: null | TransitionInfo;
  committed: TransitionInfo;
}

export interface TransitionInfo {
  byId: { [key: string]: Transition };
  moving: null | string;
}

export interface Transition {
  id: string;
  start: string;
  end: string;
  controlX: number;
  controlY: number;
}

export interface UiInfo {
  isMultiSelect: boolean;
  isMouseDownNode: boolean;
  isMouseDownTransitionControl: boolean;
  isAddingNode: boolean;
  mouse: MouseInfo;
}

export interface MouseInfo {
  x: number;
  y: number;
}

const initState: State = {
  entities: {
    nodes: {
      wip: null,
      committed: {
        byId: {
          'q0': { id: 'q0', x: 100, y: 240 },
          'q1': { id: 'q1', x: 400, y: 150 },
          'q2': { id: 'q2', x: 620, y: 450 },
        },
        selected: [],
        offsets: null,
      },
    },
    transitions: {
      wip: null,
      committed: {
        byId: {
          'q0->q1': { id: 'q0->q1', start: 'q0', end: 'q1', controlX: 300, controlY: 430 },
          'q1->q2': { id: 'q1->q2', start: 'q1', end: 'q2', controlX: 500, controlY: 200 },
          'q2->q1': { id: 'q2->q1', start: 'q2', end: 'q1', controlX: 500, controlY: 500 },
          'q1->q1': { id: 'q1->q1', start: 'q1', end: 'q1', controlX: 400, controlY: 40 },
        },
        moving: null,
      },
    },
  },
  ui: {
    isMultiSelect: false,
    isMouseDownNode: false,
    isMouseDownTransitionControl: false,
    isAddingNode: false,
    mouse: { x: 0, y: 0 },
  },
};

const reduce = (state: State=initState, action: Action): State => {
  switch (action.type) {
    case actions.MOUSE_UP_CANVAS:
      return mouseUpCanvas(state);
    case actions.MOUSE_UP_NODE:
      return mouseUpNode(state);
    case actions.MOUSE_DOWN_NODE:
      return mouseDownNode(state, action);
    case actions.MOUSE_DOWN_CANVAS:
      return mouseDownCanvas(state, action);
    case actions.MOUSE_MOVE:
      return mouseMove(state, action);
    case actions.KEY_DOWN:
      return keyDown(state, action);
    case actions.KEY_UP:
      return keyUp(state, action);
    case actions.REMOVE_SELECTED_NODES:
      return removeSelectedNodes(state);
    case actions.BEGIN_ADD_NODE:
      return beginAddNode(state);
    case actions.ADD_NODE:
      return addNode(state, action);
    case actions.MOUSE_DOWN_TRANSITION_CONTROL:
      return mouseDownTransitionControl(state, action);
    case actions.MOUSE_UP_TRANSITION_CONTROL:
      return mouseUpTransitionControl(state);
    default:
      return state;
  }
};

const mouseUpCanvas = (state: State): State => ({
  ...state,
  entities: {
    ...state.entities,
    nodes: nodes.mouseUpCanvas(state),
  },
  ui: {
    ...state.ui,
    isMouseDownNode: false,
    isMouseDownTransitionControl: false,
  },
});

const mouseUpNode = (state: State): State => ({
  ...state,
  entities: {
    ...state.entities,
    nodes: nodes.mouseUpNode(state),
  },
  ui: {
    ...state.ui,
    isMouseDownNode: false,
  },
});

const mouseDownNode = (state: State, action: Action): State => ({
  ...state,
  entities: {
    ...state.entities,
    nodes: nodes.mouseDownNode(state, action.payload.id),
  },
  ui: {
    ...state.ui,
    isMouseDownNode: true,
  },
});

const mouseDownCanvas = (state: State, action: Action): State => ({
  ...state,
  entities: {
    ...state.entities,
    nodes: nodes.mouseDownCanvas(state, action.payload.offsetX, action.payload.offsetY),
  },
});

const mouseMove = (state: State, action: Action): State => ({
  ...state,
  entities: {
    ...state.entities,
    nodes: nodes.mouseMove(state, action.payload.offsetX, action.payload.offsetY),
    transitions: transitions.mouseMove(state, action.payload.offsetX, action.payload.offsetY),
  },
  ui: {
    ...state.ui,
    mouse: { x: action.payload.offsetX, y: action.payload.offsetY },
  },
});

const keyDown = (state: State, action: Action): State => ({
  ...state,
  ui: {
    ...state.ui,
    isMultiSelect: action.payload.key === 'Shift' || state.ui.isMultiSelect,
  },
});

const keyUp = (state: State, action: Action): State => ({
  ...state,
  ui: {
    ...state.ui,
    isMultiSelect: action.payload.key === 'Shift' ? false : state.ui.isMultiSelect,
  },
});

const removeSelectedNodes = (state: State): State => ({
  ...state,
  entities: {
    ...state.entities,
    nodes: nodes.removeSelectedNodes(state),
    transitions: transitions.removeSelectedNodes(state),
  },
});

const beginAddNode = (state: State): State => ({
  ...state,
  ui: {
    ...state.ui,
    isAddingNode: true,
  },
});

const addNode = (state: State, action: Action): State => {
  const { id, x, y } = action.payload;
  return {
    ...state,
    entities: {
      ...state.entities,
      nodes: nodes.addNode(state, id, x, y),
    },
    ui: {
      ...state.ui,
      isAddingNode: false,
    },
  };
};

const mouseDownTransitionControl = (state: State, action: Action): State => ({
  ...state,
  entities: {
    ...state.entities,
    transitions: transitions.mouseDownTransitionControl(state, action.payload.id),
  },
  ui: {
    ...state.ui,
    isMouseDownTransitionControl: true,
  },
});

const mouseUpTransitionControl = (state: State): State => ({
  ...state,
  entities: {
    ...state.entities,
    transitions: transitions.mouseUpTransitionControl(state),
  },
});

export default reduce;
