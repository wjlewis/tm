import { Action } from './actions';

export interface State {}

const initState: State = {};

const reducer = (state=initState, action: Action): State => {
  return state;
};

export default reducer;
