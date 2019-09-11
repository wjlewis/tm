import { Middleware } from 'redux';
import { Action } from '../actions';
import * as A from '../actions';
import { State } from '../state';
import { isInEditMode } from '../Mode';
import { selectedNodes } from '../Node';

// Each key may be "bound" to an alternative redux action, such that when the
// user presses it, the action is dispatched.
const keyBindings: { [key: string]: KeyHandler } = {
  'a': (st, e) => {
    if (e.ctrlKey && isInEditMode(st)) {
      return A.selectAllNodes();
    }
  },
  'k': (st, e) => {
    if (e.ctrlKey && isInEditMode(st)) {
      return A.deleteSelectedNodes();
    }
  },
  ' ': (st, e) => {
    if (e.ctrlKey && isInEditMode(st)) {
      e.preventDefault();
      return A.startAddingNode();
    }
  },
  't': (st, e) => {
    const multipleSelected = selectedNodes(st).length > 0;
    if (multipleSelected && e.ctrlKey && isInEditMode(st)) {
      e.preventDefault();
      return A.addTransitionBetweenSelected();
    }
  },
  'f': (st, e) => {
    if (selectedNodes(st).length > 0 && e.ctrlKey && isInEditMode(st)) {
      return A.toggleSelectedFinalNodes();
    }
  },
  'i': (st, e) => {
    if (selectedNodes(st).length === 1 && e.ctrlKey && isInEditMode(st)) {
      return A.makeSelectedStartNode();
    }
  },
  'z': (st, e) => {
    if ((e.ctrlKey || e.metaKey) && isInEditMode(st)) {
      return A.undo();
    }
  },
  'y': (st, e) => {
    if ((e.ctrlKey || e.metaKey) && isInEditMode(st)) {
      e.preventDefault();
      return A.redo();
    }
  },
  's': (_, e) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      return A.saveSnapshot();
    }
  },
};

type KeyHandler = (state: State, event: React.KeyboardEvent) => undefined | Action;

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
