import { State, Node, NodeInfo } from './reducers';

const currentNodeInfo = (state: State): NodeInfo => (
  state.entities.nodes.wip || state.entities.nodes.committed
);

export const selectNodes = (state: State): Node[] => (
  Object.values(
    currentNodeInfo(state).byId
  )
);

export const isNodeSelected = (state: State, id: string): boolean => (
  currentNodeInfo(state).selected.includes(id)
);
