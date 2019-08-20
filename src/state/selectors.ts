import { State, Node, NodeInfo } from './reducers/reducer';

export const currentNodeInfo = (state: State): NodeInfo => (
  state.entities.nodes.wip || state.entities.nodes.committed
);

export const allNodes = (state: State): Node[] => (
  Object.values(
    currentNodeInfo(state).byId
  )
);

export const isNodeSelected = (state: State, id: string): boolean => (
  currentNodeInfo(state).selected.includes(id)
);

export const isMouseDown = (state: State): boolean => state.ui.isMouseDown;
