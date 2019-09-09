import { Middleware } from 'redux';
import * as A from '../actions';
import accept from '../../HaltReport/Accept';
import reject from '../../HaltReport/Reject';
import { tapeEntries } from '../Tape';
import { initialTapeEntries } from '../Sim';

export const halt: Middleware = api => next => action => {
  if (![A.HALT_ACCEPT, A.HALT_REJECT].includes(action.type)) return next(action);

  const state = api.getState();
  const initTapeEntries = initialTapeEntries(state) || [];
  const finalTapeEntries = tapeEntries(state);

  next(A.resetSim());

  const contentProducer = action.type === A.HALT_ACCEPT ? accept : reject;
  return next(A.displayMessage('Machine Halted', contentProducer(initTapeEntries, finalTapeEntries)));
};
