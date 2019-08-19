import { State, NodeEntities } from './reducers';

export const mouseUpCanvas = (state: State): NodeEntities => ({
  ...state.entities.nodes,
  wip: null,
  committed: {
    ...(state.entities.nodes.wip || state.entities.nodes.committed),
    selected: [],
    offsets: null,
  },
});

export const mouseUpNode = (state: State): NodeEntities => ({
  ...state.entities.nodes,
  wip: null,
  committed: {
    ...(state.entities.nodes.wip || state.entities.nodes.committed),
    offsets: null,
  },
});

export const mouseDownNode = (state: State, id: string): NodeEntities => {
  const selected = (state.entities.nodes.wip || state.entities.nodes.committed).selected;
  return {
    ...state.entities.nodes,
    wip: null,
    committed: {
      ...(state.entities.nodes.wip || state.entities.nodes.committed),
      selected: state.ui.multiSelect
      ? mod2Include(selected, id)
      : selected.includes(id) ? selected : [id],
    },
  };
};

/*
 * If x is already in xs, then remove it; otherwise, add it.
 */
const mod2Include = <A>(xs: A[], x: A): A[] => (
  xs.includes(x) ? xs.filter(y => y !== x) : [...xs, x]
);

export const mouseDownCanvas = (state: State, mouseX: number, mouseY: number): NodeEntities => {
  const offsets = state.entities.nodes.committed.selected.map(id => {
    const node = state.entities.nodes.committed.byId[id];
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
  const nodes = state.entities.nodes.wip!.byId;
  const movedNodes = state.entities.nodes.wip!.offsets!.map(info => ({
    ...nodes[info.id],
    x: info.offsetX + mouseX,
    y: info.offsetY + mouseY,
  }));
  return {
    ...state.entities.nodes,
    wip: {
      ...state.entities.nodes.wip!,
      byId: {
        ...state.entities.nodes.wip!.byId,
        ...movedNodes.reduce((acc, node) => ({
          ...acc,
          [node.id]: node,
        }), {}),
      },
    },
  };
};
