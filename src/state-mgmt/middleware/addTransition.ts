import uuid from 'uuid/v4';
import { Middleware } from 'redux';
import * as A from '../actions';
import { selectedNodes } from '../Node';
import { arrowForEndpoints } from '../Arrow';

// When we add a new transition, we need to check if there is already an arrow
// between its two endpoints. If so, we simply add an additional detail to this
// arrow; if not we need to construct a new arrow and control point, and then
// add the detail to that.
export const addTransition: Middleware = api => next => action => {
  if (action.type !== A.ADD_TRANSITION_BETWEEN_SELECTED) return next(action);

  const state = api.getState();
  const nodes = selectedNodes(state);
  const start = nodes[0];
  const end = nodes[1] || nodes[0];
  const existingArrow = arrowForEndpoints(state, start, end);

  if (existingArrow) {
    return next(A.addTransitionDetail(existingArrow.id));
  } else {
    const arrowId = uuid();
    return next(A.addArrow(start, end, arrowId));
  }
};
