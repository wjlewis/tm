import { Middleware } from 'redux';
import * as A from '../actions';

export const keyboardShortcuts: Middleware = _ => next => action => {
  if (action.type !== A.KEY_DOWN) return next(action);
  switch (action.payload.key) {
    case 'u':
      return next(A.undo());
    case 'r':
      return next(A.redo());
    default:
      return next(action);
  }
};
