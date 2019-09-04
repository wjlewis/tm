import { Middleware } from 'redux';
import * as A from '../actions';
import Accept from '../../HaltReport/Accept';
import Reject from '../../HaltReport/Reject';

export const halt: Middleware = api => next => action => {
  if (![A.HALT_ACCEPT, A.HALT_REJECT].includes(action.type)) return next(action);

  if (action.type === A.HALT_ACCEPT) {
    return next(A.displayMessage('Machine Halted', Accept));
  }
  else if (action.type === A.HALT_REJECT) {
    return next(A.displayMessage('Machine Halted', Reject));
  }
};
