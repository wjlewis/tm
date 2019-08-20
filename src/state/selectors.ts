import { State, Node, NodeInfo, MouseInfo, Transition, TransitionInfo } from './reducers/reducer';

export const currentNodeInfo = (state: State): NodeInfo => (
  state.entities.nodes.wip || state.entities.nodes.committed
);

export const allNodes = (state: State): Node[] => (
  Object.values(currentNodeInfo(state).byId)
);

export const isNodeSelected = (state: State, id: string): boolean => (
  currentNodeInfo(state).selected.includes(id)
);

export const nodeById = (state: State, id: string): Node => (
  currentNodeInfo(state).byId[id]
);

export const isMouseDownNode = (state: State): boolean => state.ui.isMouseDownNode;

export const currentTransitionInfo = (state: State): TransitionInfo => (
  state.entities.transitions.wip || state.entities.transitions.committed
);

export const allTransitions = (state: State): Transition[] => (
  Object.values(currentTransitionInfo(state).byId)
);

/*
 * In order to take certain actions (for instance, rendering available editing
 * controls), we need to know a thing or two about the current "editing mode".
 * This is determined by the number of nodes currently selected -- whether none,
 * one, two, or more than two.
 */
export const editMode = (state: State): EditMode => {
  const selectedCount = currentNodeInfo(state).selected.length;
  switch (selectedCount) {
    case 0: return EditModes.NO_SEL;
    case 1: return EditModes.ONE_SEL;
    case 2: return EditModes.TWO_SEL;
    default: return EditModes.MANY_SEL;
  }
};

export type EditMode = 'NO_SEL' | 'ONE_SEL' | 'TWO_SEL' | 'MANY_SEL';
export const EditModes: { [key: string]: EditMode } = {
  NO_SEL: 'NO_SEL',
  ONE_SEL: 'ONE_SEL',
  TWO_SEL: 'TWO_SEL',
  MANY_SEL: 'MANY_SEL',
};

export const isAddingNode = (state: State): boolean => state.ui.isAddingNode;

export const mouseInfo = (state: State): MouseInfo => state.ui.mouse;
