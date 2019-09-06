import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { composeWithDevTools } from 'redux-devtools-extension';
import reducer from './reducer';
import * as M from './middleware';
import mainSaga from './sagas';

const sagaMiddleware = createSagaMiddleware();

const store = createStore(
  reducer,
  composeWithDevTools(applyMiddleware(
    M.keyboardShortcuts,
    M.addTransition,
    M.deleteTransitionDetail,
    M.deleteNode,
    M.validateTransitionDetails,
    M.validatePreSim,
    sagaMiddleware,
    M.halt,
    M.loadSnapshot,
    M.saveSnapshot,
    M.download,
    M.upload,
  )),
);

sagaMiddleware.run(mainSaga);

export default store;
