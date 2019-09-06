import { delay, put } from 'redux-saga/effects';
import * as A from '../actions';

export default function* autoSave() {
  const FIVE_SECONDS = 5 * 1000;
  while (true) {
    yield delay(FIVE_SECONDS);
    yield put(A.saveSnapshot());
  }
}
