import { State, NodeEntities } from './reducers';

export const mouseUpCanvas = (state: State): NodeEntities => ({
  ...state.entities.nodes,
  committed: {
    ...state.entities.nodes.committed,
    selected: [],
  },
});

export const mouseUpNode = (state: State, id: string): NodeEntities => {
  const selected = state.entities.nodes.committed.selected;
  return {
    ...state.entities.nodes,
    committed: {
      ...state.entities.nodes.committed,
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
