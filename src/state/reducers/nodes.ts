import { State, NodeEntities } from './reducer';
import { currentNodeInfo } from '../selectors';
import { mod2Include, arrayToById } from '../../tools/tools';

export const mouseUpCanvas = (state: State): NodeEntities => ({
  ...state.entities.nodes,
  wip: null,
  committed: {
    ...currentNodeInfo(state),
    selected: [],
    offsets: null,
  },
});

export const mouseUpNode = (state: State): NodeEntities => ({
  ...state.entities.nodes,
  wip: null,
  committed: {
    ...currentNodeInfo(state),
    offsets: null,
  },
});

export const mouseDownNode = (state: State, id: string): NodeEntities => {
  const selected = currentNodeInfo(state).selected;
  return {
    ...state.entities.nodes,
    wip: null,
    committed: {
      ...currentNodeInfo(state),
      selected: state.ui.isMultiSelect
      ? mod2Include(id, selected)
      : selected.includes(id) ? selected : [id],
    },
  };
};

export const mouseDownCanvas = (state: State, mouseX: number, mouseY: number): NodeEntities => {
  const committed = state.entities.nodes.committed;
  const offsets = committed.selected.map(id => {
    const node = committed.byId[id];
    return {
      id: node.id,
      offsetX: node.x - mouseX,
      offsetY: node.y - mouseY,
    };
  });
  return {
    ...state.entities.nodes,
    wip: {
      ...state.entities.nodes.committed,
      offsets,
    },
  };
};

export const mouseDrag = (state: State, mouseX: number, mouseY: number): NodeEntities => {
  // Both the `wip` and the `offsets` properties should be non-null in this
  // case, but if either is null, we cannot execute the drag. In this case, we
  // return early (although we will consider throwing an Error as well).
  if (state.entities.nodes.wip === null || state.entities.nodes.wip.offsets === null) {
    return state.entities.nodes;
  }

  const nodes = state.entities.nodes.wip.byId;
  const movedNodes = state.entities.nodes.wip.offsets.map(info => ({
    ...nodes[info.id],
    x: info.offsetX + mouseX,
    y: info.offsetY + mouseY,
  }));

  return {
    ...state.entities.nodes,
    wip: {
      ...state.entities.nodes.wip,
      byId: {
        ...state.entities.nodes.wip.byId,
        ...arrayToById(movedNodes),
      },
    },
  };
};
