import { Action } from './actions';
import * as A from './actions';
import { Editable, currentLatest } from './auxiliary';
import { arrowById } from './Arrow';
import { nodeById, selectedNodes } from './Node';
import { isMouseDownNode, isMouseDownControlPoint } from './UI';
import { State } from './state';
import Vector from '../tools/Vector';
import { xOr } from '../tools/auxiliary';

export interface ControlPointState extends Editable<ControlPointInfo> {}

export interface ControlPointInfo {
  byId: { [key: string]: ControlPoint };
  selected: string[];
  offsets: { [key: string]: Vector };
  fullOffsets: { [key: string]: Vector };
  halfOffsets: { [key: string]: FixedOffset };
}

// We display Arrows using bezier curves. In order to make the Arrows
// adjustable, we associate a Control Point with each one (specifically, the
// `arrow` property is associated with the ID of the associated Arrow).
export interface ControlPoint {
  id: string;
  arrow: string;
  pos: Vector;
}

export interface FixedOffset {
  fixedPos: Vector;
  movingOffset: Vector;
  fractionAlong: number;
  perpLength: number;
}

export const initControlPointState: ControlPointState = {
  wip: null,
  committed: {
    byId: {
      'q0->q1': { id: 'q0->q1', arrow: 'q0->q1', pos: new Vector(340, 100) },
      'q1->q2': { id: 'q1->q2', arrow: 'q1->q2', pos: new Vector(400, 360) },
      'q1->q1': { id: 'q1->q1', arrow: 'q1->q1', pos: new Vector(600, 200) },
      'q1->q0': { id: 'q1->q0', arrow: 'q1->q0', pos: new Vector(300, 230) },
    },
    selected: [],
    offsets: {},
    fullOffsets: {},
    halfOffsets: {},
  },
};


// Selectors
export const allControlPoints = (state: State): ControlPoint[] => (
  Object.values(currentLatest(state.entities.controlPoints).byId)
);

export const controlPointForArrow = (state: State, arrowId: string): ControlPoint => {
  const cp = allControlPoints(state).find(({ arrow }) => arrow === arrowId);
  if (!cp) {
    throw new Error(`No ControlPoint associated with Arrow having ID "${arrowId}"`);
  }
  return cp;
};

// Reducer
export const controlPointsReducer = (state: State, action: Action): ControlPointState => {
  switch (action.type) {
    case A.MOUSE_DOWN_CONTROL_POINT:
      return mouseDownControlPoint(state, action.payload.id);
    case A.MOUSE_UP_CONTROL_POINT:
      return mouseUpControlPoint(state);
    case A.MOUSE_DOWN_CANVAS:
      return mouseDownCanvas(state, action.payload.pos);
    case A.MOUSE_MOVE_CANVAS:
      return mouseMoveCanvas(state, action.payload.pos);
    case A.MOUSE_UP_CANVAS:
    case A.MOUSE_UP_NODE:
      return mouseUpNodeOrCanvas(state);
    default:
      return state.entities.controlPoints;
  }
};

// When the user presses the mouse over a control point, we record it as the
// current selected point (user's cannot select multiple control points like
// they can nodes).
const mouseDownControlPoint = (state: State, id: string): ControlPointState => ({
  ...state.entities.controlPoints,
  wip: null,
  committed: {
    ...state.entities.controlPoints.committed,
    selected: [id],
  },
});

// When the mouse is released over a control point, we commit the wip state and
// remove any offsets that might have been created before a move.
const mouseUpControlPoint = (state: State): ControlPointState => ({
  wip: null,
  committed: {
    ...currentLatest(state.entities.controlPoints),
    selected: [],
    offsets: {},
  },
});

// If the mouse is pressed down over the canvas AND it's been pressed down over
// a node, we compute offsets for all of the control points that might be
// affected by a move, and place this updated state in wip.
const mouseDownCanvas = (state: State, pos: Vector): ControlPointState => {
  if (isMouseDownControlPoint(state)) return prepForStandardMove(state, pos);
  else if (isMouseDownNode(state)) return prepForNodeMove(state, pos);
  else return state.entities.controlPoints;
};

// When the user presses the mouse over a control point, we perform many of the
// same actions as when they press it over a node: we compute an offset and move
// the committed state into the wip state.
const prepForStandardMove = (state: State, pos: Vector): ControlPointState => {
  const { controlPoints } = state.entities;
  const offsets = controlPoints.committed.selected.reduce((acc, cpId) => {
    const cp = controlPoints.committed.byId[cpId];
    return {
      ...acc,
      [cpId]: cp.pos.minus(pos),
    };
  }, {});

  return {
    ...controlPoints,
    wip: {
      ...controlPoints.committed,
      offsets,
    },
  };
};

const prepForNodeMove = (state: State, pos: Vector): ControlPointState => {
  const points = state.entities.controlPoints.committed;
  const selected = selectedNodes(state);

  const fullyAffected = Object.values(points.byId).filter(p => {
    const arrow = arrowById(state, p.arrow);
    return selected.includes(arrow.start) && selected.includes(arrow.end);
  });

  const fullOffsets = fullyAffected.reduce((acc, cp) => ({
    ...acc,
    [cp.id]: new Vector(cp.pos.x - pos.x, cp.pos.y - pos.y),
  }), {});

  const halfOffsets = Object.values(points.byId).reduce((acc, p) => {
    const arrow = arrowById(state, p.arrow);
    const includesStart = selected.includes(arrow.start);
    const includesEnd = selected.includes(arrow.end);
    if (!xOr(includesStart, includesEnd)) {
      return acc;
    }

    const fixedPos = nodeById(state, includesEnd ? arrow.start : arrow.end).pos;
    const movingPos = nodeById(state, includesStart ? arrow.start : arrow.end).pos;
    const movingOffset = movingPos.minus(pos);
    const diff = fixedPos.minus(movingPos);
    const toCP = p.pos.minus(movingPos);
    const cpShadow = toCP.project(diff);
    const fractionAlong = cpShadow.magnitude() / diff.magnitude();
    const perp = toCP.minus(cpShadow);
    const perpSign = perp.dot(cpShadow.perp()) > 0 ? 1 : -1;
    const perpLength = perpSign * perp.magnitude();

    return {
      ...acc,
      [p.id]: { fixedPos, movingOffset, fractionAlong, perpLength },
    };
  }, {});

  return {
    ...state.entities.controlPoints,
    wip: {
      ...points,
      fullOffsets,
      halfOffsets,
    },
  };
};

// If the mouse is moved while it is down over a node, we update the positions
// of any affected control points.
const mouseMoveCanvas = (state: State, pos: Vector): ControlPointState => {
  if (isMouseDownControlPoint(state)) return moveStandard(state, pos);
  else if (isMouseDownNode(state)) return moveWithNode(state, pos);
  else return state.entities.controlPoints;
};

const moveStandard = (state: State, pos: Vector): ControlPointState => {
  const { controlPoints } = state.entities;

  if (!controlPoints.wip) return controlPoints;

  const moved = Object.keys(controlPoints.wip!.offsets).reduce((acc, id) => {
    const controlPoint = controlPoints.wip!.byId[id];
    return {
      ...acc,
      [id]: { ...controlPoint, pos: pos.plus(controlPoints.wip!.offsets[id]) },
    };
  }, {});

  return {
    ...controlPoints,
    wip: {
      ...controlPoints.wip!,
      byId: {
        ...controlPoints.wip!.byId,
        ...moved,
      },
    },
  };
};

const moveWithNode = (state: State, pos: Vector): ControlPointState => {
  const { controlPoints } = state.entities;
  if (!controlPoints.wip) return controlPoints;

  const fullMoved = Object.keys(controlPoints.wip!.fullOffsets).reduce((acc, id) => {
    const controlPoint = controlPoints.wip!.byId[id];
    return {
      ...acc,
      [id]: { ...controlPoint, pos: pos.plus(controlPoints.wip!.fullOffsets[id]) },
    };
  }, {});

  const halfMoved = Object.keys(controlPoints.wip!.halfOffsets).reduce((acc, id) => {
    const controlPoint = controlPoints.wip!.byId[id];
    const { fixedPos, movingOffset, fractionAlong, perpLength } = controlPoints.wip!.halfOffsets[id];
    const newPos = pos.plus(movingOffset);
    const diff = fixedPos.minus(newPos);
    const alongDiff = diff.scale(fractionAlong).plus(newPos);
    const cpPos = diff.perp().normalize().scale(perpLength).plus(alongDiff);

    return {
      ...acc,
      [id]: { ...controlPoint, pos: cpPos },
    };
  }, {});

  return {
    ...controlPoints,
    wip: {
      ...controlPoints.wip!,
      byId: {
        ...controlPoints.wip!.byId,
        ...fullMoved,
        ...halfMoved,
      },
    },
  };
};

// When the mouse is released, we commit the wip state and remove all offsets
// that might have been created before a move.
const mouseUpNodeOrCanvas = (state: State): ControlPointState => ({
  ...state.entities.controlPoints,
  wip: null,
  committed: {
    ...currentLatest(state.entities.controlPoints),
    selected: [],
    offsets: {},
    fullOffsets: {},
    halfOffsets: {},
  },
});
