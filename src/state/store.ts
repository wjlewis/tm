import { createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import reduce from './reducers/reducer';

const store = createStore(
  reduce,
  composeWithDevTools(),
);

export default store;
