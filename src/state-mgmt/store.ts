import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { composeWithDevTools } from 'redux-devtools-extension';
import reducer from './reducer';
import * as M from './middleware';
import saga from './saga';

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
  )),
);

sagaMiddleware.run(saga);

export default store;
