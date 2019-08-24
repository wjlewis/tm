import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import reducer from './reducer';
import { deleteTransitionDetail } from './middleware';

const store = createStore(
  reducer,
  composeWithDevTools(applyMiddleware(
    deleteTransitionDetail,
  )),
);

export default store;
