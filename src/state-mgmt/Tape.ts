import { Transient } from './auxiliary';

export interface TapeState extends Transient<TapeInfo> {}

export interface TapeInfo {
  byPosition: { [key: number]: TapeEntry };
  centeredOn: number;
}

export interface TapeEntry {
  position: number;
  contents: string;
}

export const initTapeState: TapeState = {
  wip: null,
  committed: {
    byPosition: {},
    centeredOn: 0,
  },
};
