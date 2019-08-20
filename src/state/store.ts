import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import reduce from './reducers/reducer';
import { addNode } from './middleware';

const store = createStore(
  reduce,
  composeWithDevTools(applyMiddleware(addNode)),
);

export default store;
