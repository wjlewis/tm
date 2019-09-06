import { State } from './state';
import { Action } from './actions';
import * as A from './actions';

export interface MetaDataState {
  name: string;
}

export const initMetaDataState: MetaDataState = {
  name: 'Untitled',
};

export const machineName = (state: State): string => state.entities.metaData.name;

export const metaDataReducer = (state: State, action: Action): MetaDataState => {
  switch (action.type) {
    case A.CHANGE_MACHINE_NAME:
      return changeMachineName(state, action.payload.name);
    default:
       return state.entities.metaData;
  }
};

const changeMachineName = (state: State, name: string): MetaDataState => ({
  ...state.entities.metaData,
  name,
});
