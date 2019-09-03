import { Middleware } from 'redux';
import * as A from '../actions';
import { transitionDetailsForArrow } from '../TransitionDetail';
import { controlPointForArrow } from '../ControlPoint';

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
