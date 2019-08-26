import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import reducer from './reducer';
import { deleteTransitionDetail, deleteNode, addNode } from './middleware';

const store = createStore(
  reducer,
  composeWithDevTools(applyMiddleware(
    deleteTransitionDetail,
    deleteNode,
    addNode,
  )),
);

export default store;
