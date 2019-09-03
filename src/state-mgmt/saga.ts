import { takeEvery, take, fork, put, cancel, delay } from 'redux-saga/effects';
import * as A from './actions';
import { Modes } from './Mode';

function* play(singleStep: boolean) {
  const playTask = yield fork(playSim, singleStep);
  yield take([A.PAUSE_SIM, A.RESET_SIM]);
  yield cancel(playTask);
}

function* playSim(singleStep: boolean) {
  try {
    yield put(A.switchMode(Modes.SIM));
    if (singleStep) {
      yield makeStep();
    } else {
      while (true) {
        yield makeStep();
      }
    }
  } finally {
    yield put(A.switchMode(Modes.EDIT));
  }
}

function* makeStep() {
  console.log('stepping...');
  yield delay(1000);
}

function* resetSim() {
  console.log('resetting...');
  yield null;
}

export default function* saga() {
  yield takeEvery(A.STEP_SIM, play, true);
  yield takeEvery(A.PLAY_SIM, play, false);
  yield takeEvery(A.RESET_SIM, resetSim);
}
