import { Middleware } from 'redux';
import { Action } from '../actions';
import * as A from '../actions';
import { State } from '../state';
import { selectedNodes } from '../Node';

// Each key may be "bound" to an alternative redux action, such that when the
// user presses it, the action is dispatched.
const keyBindings: { [key: string]: KeyHandler } = {
  'a': (_, e) => {
    if (e.ctrlKey) {
      return A.selectAllNodes();
    }
    return null;
  },
  'k': (_, e) => {
    if (e.ctrlKey) {
      return A.deleteSelectedNodes();
    }
    return null;
  },
  ' ': (_, e) => {
    if (e.ctrlKey) {
      e.preventDefault();
      return A.startAddingNode();
    }
    return null;
  },
  't': (st, e) => {
    const multipleSelected = selectedNodes(st).length > 0;
    if (multipleSelected && e.ctrlKey) {
      e.preventDefault();
      return A.addTransitionBetweenSelected();
    }
    return null;
  },
  'f': (st, e) => {
    if (selectedNodes(st).length > 0 && e.ctrlKey) {
      return A.toggleSelectedFinalNodes();
    }
    return null;
  },
  'i': (st, e) => {
    if (selectedNodes(st).length === 1 && e.ctrlKey) {
      return A.makeSelectedStartNode();
    }
    return null;
  },
  'z': (_, e) => {
    if (e.ctrlKey || e.metaKey) return A.undo();
    return null;
  },
  'y': (_, e) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      return A.redo();
    }
    return null;
  },
};

type KeyHandler = (state: State, event: React.KeyboardEvent) => null | Action;

export const keyboardShortcuts: Middleware = api => next => action => {
  if (action.type !== A.KEY_DOWN) return next(action);

  const state = api.getState();
  const { key, event } = action.payload;

  const keyHandler = keyBindings[key];
  if (!keyHandler) return next(action);

  const altAction = keyHandler(state, event);
  if (!altAction) return next(action);

  next(action);
  return next(altAction);
};
