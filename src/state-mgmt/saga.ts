import _ from 'lodash';
import { takeEvery, take, select, fork, put, cancel, delay } from 'redux-saga/effects';
import * as A from './actions';
import { State } from './state';
import { Modes } from './Mode';
import { currentState } from './Sim';
import { currentReadSymbol } from './Tape';
import { isNodeFinal } from './Node';
import { arrowsForStart } from './Arrow';
import { transitionDetailsForArrow } from './TransitionDetail';
import { controlPointForArrow } from './ControlPoint';

function* play(singleStep: boolean) {
  const playTask = yield fork(playSim, singleStep);
  yield take([A.PAUSE_SIM, A.RESET_SIM, A.HALT_ACCEPT, A.HALT_REJECT]);
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
  // We first collect the current state and read symbol. These determine which
  // transition we can take (if one is available).
  const current = yield select(currentState);
  const readSymbol = yield select(currentReadSymbol);
  const transitionInfo = yield select(state => availableTransitionInfo(state, current, readSymbol));

  const interval = 1000;

  yield put(A.setActiveNode(current));
  yield delay(interval / 4);

  // If there are no available transitions, the machine halts. Whether it
  // accepts or rejects the input is determined by whether the currents state
  // has been designated as "final" or not.
  if (transitionInfo === null) {
    const accept = yield select(state => isNodeFinal(state, current));
    if (accept) yield put(A.haltAccept());
    else yield put(A.haltReject());
  }

  const { endId, arrowId, controlPointId, transitionDetailId, writeSymbol, tapeDirection } = transitionInfo as TransitionInfo;

  yield put(A.setActiveArrow(arrowId));
  yield put(A.setActiveControlPoint(controlPointId));
  yield put(A.setActiveTransitionDetail(transitionDetailId));
  yield put(A.writeTapeSymbol(writeSymbol));
  yield put(A.moveTape(tapeDirection));
  yield delay(interval / 4);

  yield put(A.setActiveNode(endId));
  yield put(A.setCurrentState(endId));
  yield delay(interval / 4);

  yield put(A.setActiveArrow(null));
  yield put(A.setActiveControlPoint(null));
  yield put(A.setActiveTransitionDetail(null));
  yield delay(interval / 4);
}

interface TransitionInfo {
  endId: string;
  arrowId: string;
  controlPointId: string;
  transitionDetailId: string;
  writeSymbol: string;
  tapeDirection: 'L' | 'R';
}

const availableTransitionInfo = (state: State, current: string, readSymbol: string): null | TransitionInfo => {
  const outgoing = arrowsForStart(state, current);
  const details = _.flatten(outgoing.map(arrow => transitionDetailsForArrow(state, arrow.id)));
  const detail = details.find(detail => detail.read === readSymbol);

  if (!detail) return null;
  const arrow = outgoing.find(arrow => arrow.id === detail.arrow);
  if (!arrow) {
    throw new Error(`Inconsistency in state: transition detail references nonexistent arrow "${detail.arrow}"`);
  }
  const controlPoint = controlPointForArrow(state, arrow.id);
  return {
    endId: arrow.end,
    arrowId: arrow.id,
    controlPointId: controlPoint.id,
    transitionDetailId: detail.id,
    writeSymbol: detail.write,
    tapeDirection: detail.move,
  };
};

export default function* saga() {
  yield takeEvery(A.STEP_SIM, play, true);
  yield takeEvery(A.PLAY_SIM, play, false);
}
