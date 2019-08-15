import { Action } from './actions';

/*
 * The state is the heart of most react/redux applications, and this one is no
 * exception. There are a few choices here that may require explanation. First,
 * I've decided to name the toplevel application state interface `AppState`
 * instead of the more customary `State`. This is to avoid confusion between the
 * application state and individual (Turing Machine) states. Secondly, the
 * application state is divided into 2 main subparts: "entities" and the "mode".
 * The entities sub-state contains all of the information required to render the
 * Turing Machine itself in its current state -- all of the machine states,
 * transitions, tape, etc; the mode sub-state contains the current mode (such as
 * "edit", or "play"), along with information relevant to actions occurring in
 * that mode (for instance, whether or not the mouse is currently being
 * pressed). Additionally, the entities sub-state is further divided into
 * categories likes "states", "transitions", "tape", etc. Each of these
 * sub-states contains two internal divisions: "wip" and "committed". The wip
 * sub-state contains any work-in-progress modifications, and the UI ALWAYS
 * reflects the wip state. The committed sub-state contains the most recent undo
 * point in the state. When a user takes action (e.g. by moving a state), that
 * action is immediately reflected in the wip state, and later in the committed
 * state.
 */
export interface AppState {
  entities: Entities;
  mode: Mode;
}

export interface Entities {
  machineStates: MachineStateEntities;
}

export interface MachineStateEntities {
  wip: MachineStateInfo;
  committed: MachineStateInfo;
}

export interface MachineStateInfo {
  byId: { [key: string]: MachineState };
}

/*
 * A machine state consists of an ID, along with a position (in SVG
 * coordinates).
 */
export interface MachineState {
  id: string;
  position: { x: number, y: number };
}

export type Mode = EditMode | PlayMode;

export interface EditMode {
  name: 'EDIT_MODE',
  info: EditModeInfo;
}

export type EditModeInfo = EditModeSelectionInfo | EditModeNoSelectionInfo;

export interface EditModeSelectionInfo {
  name: 'SELECTION',
}

export interface EditModeNoSelectionInfo {
  name: 'NO_SELECTION',
}

export interface PlayMode {
  name: 'PLAY_MODE',
}

const initAppState: AppState = {
  entities: {
    machineStates: {
      wip: {
        byId: {},
      },
      committed: {
        byId: {},
      },
    },
  },
  mode: {
    name: 'EDIT_MODE',
    info: {
      name: 'NO_SELECTION',
    },
  },
};

const reduce = (state: AppState=initAppState, action: Action): AppState => {
  switch (action.type) {
    default:
      return state;
  }
};

export default reduce;
