import _ from 'lodash';
import { takeEvery, take, fork, select, put, cancel, delay } from 'redux-saga/effects';
import * as A from '../actions';
import { State } from '../state';
import { Modes } from '../Mode';
import { currentNode, simInterval } from '../Sim';
import { isNodeFinal } from '../Node';
import { TapeDirection, currentReadSymbol } from '../Tape';
import { arrowsForStart } from '../Arrow';
import { transitionDetailsForArrow } from '../TransitionDetail';
import { controlPointForArrow } from '../ControlPoint';

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
  const current = yield select(currentNode);
  const readSym = yield select(currentReadSymbol);

  // Determine the next arrow, control point, transition detail, write symbol,
  // tape direction, and node, if available; if no transitions are available, we
  // halt the machine.
  const transitionInfo = yield select(availableTransitionInfo, current, readSym);
  if (!transitionInfo) {
    const isFinal = yield select(state => isNodeFinal(state, current));
    if (isFinal) {
      yield put(A.haltAccept());
    } else {
      yield put(A.haltReject());
    }
    return;
  }

  const {
    nodeId, controlPointId, arrowId, transitionDetailId, writeSymbol, tapeDirection
  } = transitionInfo;

  const interval = yield select(simInterval);

  yield fork(nodeStep, interval, current, nodeId);
  yield fork(tapeStep, interval, writeSymbol, tapeDirection);
  yield fork(arrowStep, interval, arrowId);
  yield fork(transitionDetailStep, interval, transitionDetailId);
  yield fork(controlPointStep, interval, controlPointId);
}

const availableTransitionInfo = (state: State, currentNode: string, readSym: string): null | TransitionInfo => {
  const outgoingArrows = arrowsForStart(state, currentNode);
  const details = _.flatten(outgoingArrows.map(arrow => transitionDetailsForArrow(state, arrow.id)));
  const detail = details.find(detail => detail.read === readSym);

  if (!detail) {
    return null;
  }

  const arrow = outgoingArrows.find(arrow => arrow.id === detail.arrow);
  if (!arrow) {
    throw new Error(`Inconsistency in state: transition detail references nonexistent arrow "${detail.arrow}"`);
  }

  const controlPoint = controlPointForArrow(state, arrow.id);

  return {
    nodeId: arrow.end,
    arrowId: arrow.id,
    controlPointId: controlPoint.id,
    transitionDetailId: detail.id,
    writeSymbol: detail.write,
    tapeDirection: detail.move,
  };
};

interface TransitionInfo {
  nodeId: string;
  arrowId: string;
  controlPointId: string;
  transitionDetailId: string;
  writeSymbol: string;
  tapeDirection: TapeDirection;
}

function* nodeStep(interval: number, current: string, next: string) {
  try {
    // Glow the current node for a short period
    yield put(A.setGlowingNode(current));
    yield delay(interval / 8);

    // Fade the current node out
    yield put(A.setFadeOutNode(current));
    yield put(A.setGlowingNode(null));
    yield delay(interval / 4);
    yield put(A.setFadeOutNode(null));
    yield delay(interval / 4);

    // Set the next node as current and fade it in
    yield put(A.setCurrentNode(next));
    yield put(A.setFadeInNode(next));
    yield delay(interval / 4);
    yield put(A.setFadeInNode(null));
    yield put(A.setGlowingNode(next));
    yield delay(interval / 8);
  } finally {
    yield put(A.setCurrentNode(next));
  }
}

function* tapeStep(interval: number, writeSymbol: string, direction: TapeDirection) {
  try {
    yield delay(interval / 4);
    
    // "Erase" current tape symbol
    yield put(A.setTapeWritingStatus(true));
    yield delay(interval / 4);
    
    // Write new tape symbol
    yield put(A.writeTapeSymbol(writeSymbol));
    yield delay(interval / 4);
    yield put(A.setTapeWritingStatus(false));
    
    // Move the tape
    yield put(A.moveTape(direction));
  } finally {
    yield put(A.writeTapeSymbol(writeSymbol));
    yield put(A.moveTape(direction));
  }
}

function* arrowStep(interval: number, arrowId: string) {
  yield delay(interval / 8);
  yield put(A.setGlowingArrow(arrowId));
  yield delay(3 * interval / 4);
  yield put(A.setGlowingArrow(null));
}

function* transitionDetailStep(interval: number, transitionDetailId: string) {
  yield delay(interval / 4);
  yield put(A.setGlowingTransitionDetail(transitionDetailId));
  yield delay(interval / 2);
  yield put(A.setGlowingTransitionDetail(null));
}

function* controlPointStep(interval: number, controlPointId: string) {
  yield delay(interval / 4);
  yield put(A.setGlowingControlPoint(controlPointId));
  yield delay(interval / 2);
  yield put(A.setGlowingControlPoint(null));
}

export default function* sim() {
  yield takeEvery(A.STEP_SIM, play, true);
  yield takeEvery(A.PLAY_SIM, play, false);
}
