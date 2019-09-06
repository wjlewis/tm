import { Middleware } from 'redux';
import * as A from '../actions';
import { getSnapshot } from '../auxiliary';

export const loadSnapshot: Middleware = _ => next => action => {
  if (action.type !== A.LOAD_SNAPSHOT) return next(action);
  try {
    const saved = localStorage.getItem('machine');
    if (!saved) return;
    const snapshot = JSON.parse(saved);
    next(A.installSnapshot(snapshot));
  } catch(_) {
    localStorage.clearItem('machine');
  }
};

export const saveSnapshot: Middleware = api => next => action => {
  if (action.type !== A.SAVE_SNAPSHOT) return next(action);
  const state = api.getState();
  const snapshot = getSnapshot(state);
  try {
    localStorage.setItem('machine', JSON.stringify(snapshot));
  } catch(_) {
    return;
  }
};
