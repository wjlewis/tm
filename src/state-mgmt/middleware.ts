import _ from 'lodash';
import { Middleware } from 'redux';
import * as A from './actions';
import { transitionDetailsForArrow } from './TransitionDetail';
import { controlPointForArrow } from './ControlPoint';
import { selectedNodes } from './Node';
import { arrowsForNode } from './Arrow';
import { isAddingNode, mousePos } from './UI';

// When a transition detail is removed, we need to check if it was the last one
// for its arrow. If it was, we need to also remove the arrow and the control
// point.
export const deleteTransitionDetail: Middleware = api => next => action => {
  if (action.type !== A.DELETE_TRANSITION_DETAIL) return next(action);

  const { id, arrow } = action.payload;
  const state = api.getState();
  const remainingDetails = transitionDetailsForArrow(state, arrow).filter(detail => detail.id !== id);

  if (remainingDetails.length > 0) return next(action);

  // Otherwise, we need to find the ID of the control point and remove it and
  // the arrow.
  const controlPoint = controlPointForArrow(state, arrow);
  next(action);
  next(A.deleteControlPoint(controlPoint.id));
  next(A.deleteArrow(arrow));
};

export const deleteNode: Middleware = api => next => action => {
  if (action.type !== A.DELETE_SELECTED_NODES) return next(action);

  const state = api.getState();
  const selected = selectedNodes(state);
  const arrowIds = _.uniq(_.flatten(selected.map(id => arrowsForNode(state, id))).map(({ id }) => id));

  arrowIds.forEach(id => {
    const controlPoint = controlPointForArrow(state, id);
    next(A.deleteTransitionDetails(id));
    next(A.deleteControlPoint(controlPoint.id));
    next(A.deleteArrow(id));
  });

  return next(action);
};

export const addNode: Middleware = api => next => action => {
  if (action.type !== A.MOUSE_UP_CANVAS) return next(action);

  const state = api.getState();
  if (!isAddingNode(state)) return next(action);

  return next(A.addNode(mousePos(state)));
};
