import _ from 'lodash';
import uuid from 'uuid/v4';
import { Action } from './actions';
import * as A from './actions';
import { Transient, currentLatest } from './auxiliary';
import { State } from './state';
import Vector, { SerializableVector } from '../tools/Vector';
import { mod2Include } from '../tools/auxiliary';
import { isMultiselect, isMouseDownNode, wasMouseReleasedOverNode } from './UI';
import { isInEditMode } from './Mode';

// A node represents a machine state in the TM formalism. Each node is
// draggable, and may come in several different varieties (it may be the start
// node, or an accepting/final node).

export interface NodeState extends Transient<NodeInfo> {}

// The "selected" and "offsets" properties are used to store information about
// selected nodes immediately before and during a move. The "startNode"
// corresponds to the start state in the TM formalism.
export interface NodeInfo {
  byId: { [key: string]: Node };
  selected: string[];
  offsets: { [key: string]: Vector };
  startNode: null | string;
}

export interface Node {
  id: string;
  mnemonic: string;
  pos: SerializableVector;
  isFinal: boolean;
}

export const initNodeState: NodeState = {
  wip: null,
  committed: {
    byId: {},
    selected: [],
    offsets: {},
    startNode: null,
  },
};

// Return an array containing all nodes in existence.
export const allNodes = (state: State): Node[] => (
  Object.values(currentLatest(state.entities.nodes).byId)
);

// Return the node with the given ID, if one exists.
export const nodeById = (state: State, id: string): Node => {
  const node = allNodes(state).find(n => n.id === id);
  if (!node) {
    throw new Error(`No Node with ID "${id}"`);
  }
  return node;
};

// Check if the given node is currently selected.
export const isNodeSelected = (state: State, id: string): boolean => (
  currentLatest(state.entities.nodes).selected.includes(id)
);

// Check if the given node is final ("accepting").
export const isNodeFinal = (state: State, id: string): boolean => (
  currentLatest(state.entities.nodes).byId[id].isFinal
);

// Return an array containing the IDs of all selected nodes.
export const selectedNodes = (state: State): string[] => (
  currentLatest(state.entities.nodes).selected
);

// Test if the given node is the start node.
export const isStartNode = (state: State, id: string): boolean => {
  const { startNode } = currentLatest(state.entities.nodes);
  return (startNode !== null) && startNode === id;
};

// Test if a node has been distinguished as the start state.
export const hasStartNode = (state: State): boolean => (
  currentLatest(state.entities.nodes).startNode !== null
);

export const startNode = (state: State): string => {
  const start = currentLatest(state.entities.nodes).startNode;
  if (start === null) {
    throw new Error('No start node has been distinguished.');
  }
  return start;
};

export const nodesReducer = (state: State, action: Action): NodeState => {
  if (isInEditMode(state)) {
    switch (action.type) {
      // These operations affect the non-positional attributes of a node.
      case A.ADD_NODE:
        return addNode(state, action.payload.pos);
      case A.ADD_ARROW:
        return addArrow(state, action.payload.start, action.payload.end);
      case A.DELETE_ENTITIES:
        return deleteEntities(state, action.payload.nodes);
      case A.MAKE_SELECTED_START_NODE:
        return makeStartNode(state);
      case A.TOGGLE_SELECTED_FINAL_NODES:
        return toggleFinalNodes(state);
      case A.CHANGE_MNEMONIC:
        return changeMnemonic(state, action.payload.id, action.payload.value);
      case A.BLUR_MNEMONIC:
        return blurMnemonic(state);
      case A.SELECT_ALL_NODES:
        return selectAllNodes(state);

      // These operations deal with movement.
      case A.MOUSE_DOWN_NODE:
        return mouseDownNode(state, action.payload.id);
      case A.MOUSE_UP_NODE:
        return mouseUpNode(state);
      case A.MOUSE_DOWN_CANVAS:
        return mouseDownCanvas(state, action.payload.pos);
      case A.MOUSE_UP_CANVAS:
        return mouseUpCanvas(state);
      case A.MOUSE_MOVE_CANVAS:
        return mouseMoveCanvas(state, action.payload.pos);
      default:
        return state.entities.nodes;
    }
  }
  else {
    return state.entities.nodes;
  }
};

// When a new node is added, we revert to the last committed state, and
// incorporate a fresh, non-final, mnemonic-free node.
const addNode = (state: State, pos: Vector): NodeState => {
  const id = uuid();
  const node = { id, pos, mnemonic: '', isFinal: false };
  return {
    wip: null,
    committed: _.mergeWith({}, state.entities.nodes.committed, {
      byId: {
        [id]: node,
      },
    // We unselect all currently selected nodes, and select the new node:
    }, (_1, _2, key) => key === 'selected' ? [id] : undefined),
  };
};

// Whenever an arrow is added between two distinct nodes, we deselect the nodes.
// This seems to be a nicer experience than keeping the nodes selected.
const addArrow = (state: State, start: string, end: string): NodeState => ({
  wip: null,
  committed: {
    ...state.entities.nodes.committed,
    selected: start !== end
      ? []
      : state.entities.nodes.committed.selected,
  },
});

const deleteEntities = (state: State, ids: string[]): NodeState => {
  const { committed } = state.entities.nodes;
  return {
    wip: null,
    committed: {
      ...committed,
      byId: _.omit(committed.byId, ids),
      selected: [],
      startNode: committed.startNode && ids.includes(committed.startNode)
        ? null
        : committed.startNode,
    },
  };
};

const makeStartNode = (state: State): NodeState => ({
  wip: null,
  committed: _.merge({}, state.entities.nodes.committed, {
    startNode: state.entities.nodes.committed.selected[0],
  }),
});

// Toggling the "final" state of a set of nodes works like this: if ANY of the
// selected nodes is currently a final node, we change all of the nodes to be
// NON-final. Otherwise, we change all of them to be final. This correctly
// subsumes the expected behavior for a single node as well.
const toggleFinalNodes = (state: State): NodeState => {
  const selected = selectedNodes(state).map(id => nodeById(state, id));
  const atLeastOneFinal = selected.some(node => node.isFinal);
  const updated = selected.reduce((acc, x) => ({
    ...acc,
    [x.id]: { ...x, isFinal: !atLeastOneFinal },
  }), {});

  return {
    wip: null,
    committed: _.merge({}, state.entities.nodes.committed, {
      byId: {
        ...updated,
      },
    }),
  };
};

const changeMnemonic = (state: State, id: string, value: string): NodeState => ({
  ...state.entities.nodes,
  wip: _.merge({}, currentLatest(state.entities.nodes), {
    byId: {
      [id]: { mnemonic: value }
    },
  }),
});

const blurMnemonic = (state: State): NodeState => ({
  wip: null,
  committed: currentLatest(state.entities.nodes),
});

const selectAllNodes = (state: State): NodeState => ({
  wip: null,
  committed: {
    ...state.entities.nodes.committed,
    selected: Object.keys(state.entities.nodes.committed.byId),
  },
});

// When the user presses the mouse over a node, we update the selection as
// follows: if we are in "multiselect" mode, we add the node to the current
// selection if it is not a member, and remove it if it is; otherwise, if the
// current selection includes the node, we keep the current selection, and if it
// doesn't, we throw out the current selection in favor of the clicked node.
// This may seem complicated, or contrived, but it results in a fairly intuitive
// behavior.
const mouseDownNode = (state: State, id: string): NodeState => {
  const { nodes } = state.entities;
  const { selected } = nodes.committed;
  return {
    wip: null,
    committed: {
      ...nodes.committed,
      selected: isMultiselect(state)
        ? mod2Include(id, selected)
        : selected.includes(id) ? selected : [id],
    },
  };
};

// When the user releases the mouse over a Node, we replace the committed state
// with the wip state (to account for any movement that may have occurred). We
// also clear any offsets that may have been computed in preparation for a move.
const mouseUpNode = (state: State): NodeState => ({
  wip: null,
  committed: {
    ...currentLatest(state.entities.nodes),
    offsets: {},
  },
});

// If the user has pressed the mouse over a node, this press is also received by
// the canvas. In this case, we prepare for any movement by computing offsets
// for each of the selected nodes.
const mouseDownCanvas = (state: State, mousePos: Vector): NodeState => {
  if (!isMouseDownNode(state)) return state.entities.nodes;

  const { nodes } = state.entities;
  const offsets = nodes.committed.selected.reduce((acc, nodeId) => {
    const node = nodes.committed.byId[nodeId];
    return {
      ...acc,
      [nodeId]: Vector.from(node.pos).minus(mousePos),
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

// When the mouse is released over the canvas, we deselect any selected nodes as
// long as we are node in multiselect mode, and revert to the last committed
// state. When selecting multiple nodes, it is easy to miss a node and click the
// canvas instead; in order to avoid an irritating deselection of all currently
// selected nodes, we simply keep what we have so far in this case.
const mouseUpCanvas = (state: State): NodeState => (
  wasMouseReleasedOverNode(state)
  ? state.entities.nodes
  : {
    wip: null,
    committed: {
      ...state.entities.nodes.committed,
      selected: isMultiselect(state) ? state.entities.nodes.committed.selected : [],
    },
  }
);

// If the mouse is moved while it is down over a node, we update all of the
// selected nodes in the WIP state using the offsets computed when the mouse was
// initially pressed down.
const mouseMoveCanvas = (state: State, mousePos: Vector): NodeState => {
  const { nodes } = state.entities;

  if (!isMouseDownNode(state) || !nodes.wip) return nodes;

  // We computed each offset as the difference between the node's position and
  // the mouse position (i.e. offset = node - mouse). Thus, to compute the new
  // node position, we add the mouse position and the offset:
  const moved = Object.keys(nodes.wip.offsets).reduce((acc, id) => {
    const node = nodes.wip!.byId[id];
    const updatedPos = mousePos.plus(nodes.wip!.offsets[id]);
    return {
      ...acc,
      [id]: { ...node, pos: updatedPos },
    };
  }, {});

  return _.merge({}, nodes, {
    wip: {
      byId: {
        ...moved,
      },
    },
  });
};
