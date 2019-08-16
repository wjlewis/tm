import { Action } from './actions';

export interface State {
  entities: Entities;
}

export interface Entities {
  nodes: NodeEntities;
}

export interface NodeEntities {
  wip: null | NodeInfo;
  committed: NodeInfo;
}

export interface NodeInfo {
  byId: { [key: string]: Node };
}

export interface Node {
  id: string;
  x: number;
  y: number;
}

const initState: State = {
  entities: {
    nodes: {
      wip: null,
      committed: {
        byId: {
          'q0': {
            id: 'q0',
            x: 300,
            y: 150,
          },
          'q1': {
            id: 'q1',
            x: 500,
            y: 310,
          },
          'q2': {
            id: 'q2',
            x: 40,
            y: 360,
          },
        },
      },
    },
  },
};

const reduce = (state: State=initState, action: Action): State => {
  return state;
};

export default reduce;
