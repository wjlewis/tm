import { Middleware } from 'redux';
import * as A from '../actions';
import { hasStartNode } from '../Node';
import { duplicateTransitionDetails } from '../TransitionDetail';
import MissingStartState from '../../ErrorReport/MissingStartState';
import NondeterministicTransition from '../../ErrorReport/NondeterministicTransition';

export const validatePreSim: Middleware = api => next => action => {
  if (![A.STEP_SIM, A.TOGGLE_PLAY_PAUSE_SIM].includes(action.type)) return next(action);

  const state = api.getState();
  if (!hasStartNode(state)) {
    return next(A.displayMessage('Missing start state', MissingStartState));
  }
  else if (duplicateTransitionDetails(state).length > 0) {
    return next(A.displayMessage('Nondeterministic transitions', NondeterministicTransition));
  }

  return next(action);
};
