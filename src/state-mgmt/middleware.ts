import _ from 'lodash';
import uuid from 'uuid/v4';
import { Middleware } from 'redux';
import * as A from './actions';
import { transitionDetailsForArrow, duplicateTransitionDetails } from './TransitionDetail';
import { controlPointForArrow } from './ControlPoint';
import { selectedNodes } from './Node';
import { arrowsForNode, arrowForEndpoints } from './Arrow';

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

// When a transition detail is deleted, we need to check if it was the last one
// for its associated arrow. If it is, we need to also delete the arrow its
// control point.
export const deleteTransitionDetail: Middleware = api => next => action => {
  if (action.type !== A.DELETE_TRANSITION_DETAIL) return next(action);

  const { id, arrow } = action.payload;
  const state = api.getState();
  const remainingDetails = transitionDetailsForArrow(state, arrow).filter(detail => detail.id !== id);

  if (remainingDetails.length > 0) return next(action);

  const controlPointId = controlPointForArrow(state, arrow).id;
  return next(A.deleteEntities([], [arrow], [controlPointId], [id]));
};

// When we delete a node, we need to remove anything that was "attached" to it:
// any arrows, and control points and transition details associated with them.
export const deleteNode: Middleware = api => next => action => {
  if (action.type !== A.DELETE_SELECTED_NODES) return next(action);

  const state = api.getState();
  const nodeIds = selectedNodes(state);
  const arrows = _.flatten(nodeIds.map(id => arrowsForNode(state, id)));
  const arrowIds = _.uniq(_.flatten(arrows.map(({ id }) => id)));
  const controlPointIds = arrowIds.map(id => controlPointForArrow(state, id)).map(({ id }) => id);
  const transitionDetails = _.flatten(arrowIds.map(id => transitionDetailsForArrow(state, id)));
  const transitionDetailIds = transitionDetails.map(({ id }) => id);

  return next(A.deleteEntities(nodeIds, arrowIds, controlPointIds, transitionDetailIds));
};

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

// Each time the user modifies or adds a transition detail, we find all
// transition details that share an arrow and have the same read symbol. These
// represent nondeterministic transitions and should be marked as errors.
export const validateTransitionDetails: Middleware = api => next => action => {
  if (![A.ADD_TRANSITION_DETAIL, A.CHANGE_TRANSITION_DETAIL, A.DELETE_TRANSITION_DETAIL].includes(action.type)) return next(action);

  next(action);
  const duplicates = duplicateTransitionDetails(api.getState());
  return next(A.markDuplicateTransitions(duplicates));
};
