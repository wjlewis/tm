import _ from 'lodash';
import { Action } from './actions';
import * as A from './actions';
import { Editable, currentLatest } from './auxiliary';
import { State } from './state';
import Vector from '../tools/Vector';
import { mod2Include } from '../tools/auxiliary';
import { isMultiselect, isMouseDownNode } from './UI';

export interface NodeState extends Editable<NodeInfo> {}

export interface NodeInfo {
  byId: { [key: string]: Node };
  selected: string[];
  offsets: { [key: string]: Vector };
}

// A Node represents a machine state. It has an optional "mnemonic" -- a short
// name to make the state's purpose clearer, along with coordinates within the
// enclosing element.
export interface Node {
  id: string;
  mnemonic: string;
  pos: Vector;
}

export const initNodeState: NodeState = {
  wip: null,
  committed: {
    byId: {
      'q0': { id: 'q0', mnemonic: 'q0', pos: new Vector(100, 100) },
      'q1': { id: 'q1', mnemonic: 'q1', pos: new Vector(520, 300) },
      'q2': { id: 'q2', mnemonic: 'q2', pos: new Vector(300, 400) },
    },
    selected: [],
    offsets: {},
  },
};

// Selectors
export const allNodes = (state: State) => (
  Object.values(currentLatest(state.entities.nodes).byId)
);

export const nodeById = (state: State, id: string) => {
  const node = allNodes(state).find(n => n.id === id);
  if (!node) {
    throw new Error(`No Node with ID "${id}"`);
  }
  return node;
};

export const isNodeSelected = (state: State, id: string): boolean => (
  currentLatest(state.entities.nodes).selected.includes(id)
);

export const selectedNodes = (state: State): string[] => (
  currentLatest(state.entities.nodes).selected
);

// Reducer
export const nodesReducer = (state: State, action: Action): NodeState => {
  switch (action.type) {
    case A.CHANGE_MNEMONIC:
      return changeMnemonic(state, action.payload.id, action.payload.value);
    case A.MOUSE_DOWN_NODE:
      return mouseDownNode(state, action.payload.id);
    case A.MOUSE_UP_NODE:
      return mouseUpNode(state);
    case A.MOUSE_DOWN_CANVAS:
      return mouseDownCanvas(state, action.payload.pos);
    case A.MOUSE_UP_CANVAS:
    case A.MOUSE_UP_CONTROL_POINT:
      return mouseUpCanvas(state);
    case A.MOUSE_MOVE_CANVAS:
      return mouseMoveCanvas(state, action.payload.pos);
    default:
      return state.entities.nodes;
  }
};

const changeMnemonic = (state: State, id: string, value: string): NodeState => ({
  ...state.entities.nodes,
  committed: _.merge({}, state.entities.nodes.committed, {
    byId: {
      [id]: { mnemonic: value }
    },
  }),
});

// When the user presses the mouse over a node, we update the selection as
// follows: if we are in "multiselect" mode, we select the node if it is not
// selected, and deselect it if it is; otherwise, if the current selection
// includes the node, we keep the current selection, and if it doesn't, we throw
// out the current selection in favor of the clicked node.
const mouseDownNode = (state: State, id: string): NodeState => {
  const { nodes } = state.entities;
  const { selected } = nodes.committed;
  return {
    wip: null,
    committed: {
      ...nodes.committed,
      // The selection behavior is determined by the next 3 lines.
      selected: isMultiselect(state)
        ? mod2Include(id, selected)
        : selected.includes(id) ? selected : [id],
    },
  };
};

// When the user releases the mouse over a Node, we replace the committed state
// with the wip state (to account for any movement).
const mouseUpNode = (state: State): NodeState => ({
  wip: null,
  committed: {
    ...currentLatest(state.entities.nodes),
    offsets: {},
  },
});

// If the user has pressed the mouse down over a node, that press is also
// reported by the canvas. In this case, we prepare for potential movement by
// moving the committed state to wip, and computing offsets for each of the
// selected nodes.
const mouseDownCanvas = (state: State, pos: Vector): NodeState => {
  if (!isMouseDownNode(state)) return state.entities.nodes;
  const { nodes } = state.entities;
  const offsets = nodes.committed.selected.reduce((acc, nodeId) => {
    const node = nodes.committed.byId[nodeId];
    return {
      ...acc,
      [nodeId]: node.pos.minus(pos),
    };
  }, {});

  return {
    ...nodes,
    wip: {
      ...nodes.committed,
      offsets,
    },
  };
};

// When the mouse is released over the canvas, we deselect any selected nodes.
const mouseUpCanvas = (state: State): NodeState => ({
  ...state.entities.nodes,
  wip: null,
  committed: {
    ...state.entities.nodes.committed,
    selected: [],
  },
});

// If the mouse is moved while it is down (i.e. pressed) over a node, we update
// all of the offsets in the wip state according to the mouse position.
const mouseMoveCanvas = (state: State, pos: Vector): NodeState => {
  if (!isMouseDownNode(state)) return state.entities.nodes;

  const { nodes } = state.entities;
  if (!state.entities.nodes.wip) return nodes;

  // We computed each offset as the difference between the node's position and
  // the mouse position (i.e. offset = node - mouse). Thus, to compute the new
  // node position, we add the mouse position and the offset:
  const moved = Object.keys(nodes.wip!.offsets).reduce((acc, id) => {
    const node = nodes.wip!.byId[id];
    return {
      ...acc,
      [id]: { ...node, pos: pos.plus(nodes.wip!.offsets[id])},
    };
  }, {});

  return {
    ...nodes,
    wip: {
      ...nodes.wip!,
      byId: {
        ...nodes.wip!.byId,
        ...moved,
      },
    },
  };
};
