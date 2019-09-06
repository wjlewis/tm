import { all } from 'redux-saga/effects';
import autoSave from './autoSave';
import sim from './sim';

export default function* main() {
  yield all([
    autoSave(),
    sim(),
  ]);
}
