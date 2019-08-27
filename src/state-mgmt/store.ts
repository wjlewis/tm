import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import reducer from './reducer';
import { addTransition, deleteTransitionDetail, deleteNode } from './middleware';

const store = createStore(
  reducer,
  composeWithDevTools(applyMiddleware(
    addTransition,
    deleteTransitionDetail,
    deleteNode,
  )),
);

export default store;
