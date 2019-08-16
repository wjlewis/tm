import { State, Node } from './reducers';

export const selectNodes = (state: State): Node[] => (
  Object.values(
    state.entities.nodes.wip === null
    ? state.entities.nodes.committed.byId
    : state.entities.nodes.wip.byId
  )
);
