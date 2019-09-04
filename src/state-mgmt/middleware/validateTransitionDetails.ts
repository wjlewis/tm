import { Middleware } from 'redux';
import * as A from '../actions';
import { duplicateTransitionDetails } from '../TransitionDetail';

// Each time the user modifies or adds a transition detail, we find all
// transition details that share an arrow and have the same read symbol. These
// represent nondeterministic transitions and should be marked as errors.
export const validateTransitionDetails: Middleware = api => next => action => {
  const validateOn = [
    A.ADD_TRANSITION_DETAIL,
    A.CHANGE_TRANSITION_DETAIL,
    A.DELETE_TRANSITION_DETAIL,
    A.ADD_ARROW,
  ];
  if (!validateOn.includes(action.type)) return next(action);

  next(action);
  const duplicates = duplicateTransitionDetails(api.getState());
  return next(A.markDuplicateTransitions(duplicates));
};
