import { Middleware } from 'redux';
import * as A from './actions';
import { transitionDetailsForArrow } from './TransitionDetail';
import { controlPointForArrow } from './ControlPoint';

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
  next(A.deleteArrow(arrow));
  next(A.deleteControlPoint(controlPoint.id));
};
