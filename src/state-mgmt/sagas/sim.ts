import _ from 'lodash';
import { channel, Channel } from 'redux-saga';
import { takeEvery, take, fork, select, put, call, cancel, cancelled, delay } from 'redux-saga/effects';
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
  const completedChan = yield call(channel);
  const playTask = yield fork(playSim, singleStep, completedChan);
  const stopAction = yield take([A.PAUSE_SIM, A.RESET_RUNNING_SIM, A.HALT_ACCEPT, A.HALT_REJECT]);
  yield cancel(playTask);
  if (stopAction.type === A.RESET_RUNNING_SIM) {
    // If the reset button has been clicked, we wait until we've completed all
    // required state changes atomically, and then reset the simulation.
    yield take(completedChan);
    yield put(A.resetSim());
  }
}

function* playSim(singleStep: boolean, completedChan: Channel<any>) {
  try {
    yield put(A.switchMode(Modes.SIM));
    if (singleStep) {
      yield call(makeStep, completedChan);
    } else {
      while (true) {
        yield call(makeStep, completedChan);
      }
    }
  } finally {
    yield put(A.switchMode(Modes.EDIT));
  }
}

function* makeStep(completedChan: Channel<any>) {
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
  yield fork(tapeStep, interval, writeSymbol, tapeDirection, completedChan);
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
  // We change this flag to `true` after updating the current node to avoid
  // duplicating this state change in the `finally` block below in the event
  // that the user pauses the simulation.
  let hasUpdatedCurrent = false;
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
    hasUpdatedCurrent = true;
    yield put(A.setFadeInNode(next));
    yield delay(interval / 4);
    yield put(A.setFadeInNode(null));
    yield put(A.setGlowingNode(next));
    yield delay(interval / 8);
  } finally {
    if (yield cancelled()) {
      if (!hasUpdatedCurrent) yield put(A.setCurrentNode(next));
    }
  }
}

function* tapeStep(interval: number, writeSymbol: string, direction: TapeDirection, completedChan: Channel<any>) {
  // As in the case of `nodeStep` above, we use these flags to avoid duplicating
  // state changes in the event of a simulation pause.
  let hasWrittenSymbol = false;
  let hasMovedTape = false;
  try {
    yield delay(interval / 4);
    
    // "Erase" current tape symbol
    yield put(A.setTapeWritingStatus(true));
    yield delay(interval / 4);
    
    // Write new tape symbol
    yield put(A.writeTapeSymbol(writeSymbol));
    hasWrittenSymbol = true;
    yield delay(interval / 4);
    yield put(A.setTapeWritingStatus(false));
    
    // Move the tape
    yield put(A.moveTape(direction));
    hasMovedTape = true;
  } finally {
    if (yield cancelled()) {
      if (!hasWrittenSymbol) yield put(A.writeTapeSymbol(writeSymbol));
      if (!hasMovedTape) yield put(A.moveTape(direction));
      yield put(completedChan, true);
    }
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
