import { State, TransitionEntities } from './reducer';
import { allTransitions, currentTransitionInfo, currentNodeInfo } from '../selectors';
import { arrayToById } from '../../tools/tools';

export const mouseDownTransitionControl = (state: State, id: string): TransitionEntities => ({
  ...state.entities.transitions,
  wip: {
    ...currentTransitionInfo(state),
    moving: id,
  },
});

export const mouseMove = (state: State, mouseX: number, mouseY: number): TransitionEntities => {
  if (!state.ui.isMouseDownTransitionControl) {
    return state.entities.transitions;
  }
  else if (state.entities.transitions.wip === null || state.entities.transitions.wip.moving === null) {
    return state.entities.transitions;
  }

  const id = state.entities.transitions.wip.moving;
  const transition = state.entities.transitions.wip.byId[id];

  const moved = {
    ...transition,
    controlX: mouseX,
    controlY: mouseY,
  };

  return {
    ...state.entities.transitions,
    wip: {
      ...state.entities.transitions.wip,
      byId: {
        ...state.entities.transitions.wip.byId,
        [id]: moved,
      },
    },
  };
};

export const mouseUpTransitionControl = (state: State): TransitionEntities => ({
  ...state.entities.transitions,
  wip: null,
  committed: {
    ...currentTransitionInfo(state),
    moving: null,
  },
});

export const removeSelectedNodes = (state: State): TransitionEntities => {
  const selected = currentNodeInfo(state).selected;
  const remaining = allTransitions(state).filter(trans => (
    !(selected.includes(trans.start) || selected.includes(trans.end))
  ));

  return {
    ...state.entities.transitions,
    wip: null,
    committed: {
      ...state.entities.transitions.committed,
      byId: arrayToById(remaining),
    },
  };
};
