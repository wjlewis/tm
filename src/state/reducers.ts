import { Action } from './actions';

export interface AppState {}

const initAppState: AppState = {};

const reduce = (state: AppState=initAppState, action: Action): AppState => {
  switch (action.type) {
    default:
      return state;
  }
};

export default reduce;
