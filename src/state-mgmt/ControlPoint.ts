import _ from 'lodash';
import uuid from 'uuid/v4';
import { Action } from './actions';
import * as A from './actions';
import { Transient, currentLatest } from './auxiliary';
import { arrowById } from './Arrow';
import { nodeById, selectedNodes } from './Node';
import { isMouseDownNode, isMouseDownControlPoint } from './UI';
import { State } from './state';
import Vector from '../tools/Vector';
import { xOr } from '../tools/auxiliary';
import { isInEditMode } from './Mode';

// A control point is a draggable handle associated with a particular arrow. It
// is used to control the curve of the arrow in order to create aesthetically
// pleasing machine layouts. Despite (or more likely, because of) the fact that
// control points exist purely for display purposes, their management involves
// quite a bit of computation. This is mainly due to the fact that they are
// draggable, and also that each time a node is moved, all of the control points
// associated with the arrows connected to the node are moved as well.

export interface ControlPointState extends Transient<ControlPointInfo> {}

// A few of these items require explanation: the "fullOffsets" and "halfOffsets"
// properties are populated when a *NODE* is moved: it turns out that when a
// node is moved, it is quite desirable to have any control points associated
// with arrows connected to the node move as well, and in a particular way.
export interface ControlPointInfo {
  byId: { [key: string]: ControlPoint };
  selected: null | string;
  selectedOffset: null | Vector;
  fullOffsets: { [key: string]: Vector };
  halfOffsets: { [key: string]: FixedOffset };
}

export interface ControlPoint {
  id: string;
  arrow: string;
  pos: Vector;
}

// Suppose we move a node away from another node, and imagine that both of these
// nodes are connected with an arrow. How should the control point for that
// arrow move in order to maintain the arrow's overall "shape"? We have chosen
// to move the control point as if it were "fixed" in a sense to the line
// connecting the two endpoint nodes. This requires keeping track of the
// position of the non-moving node, the position of the moving node, the
// distance between the control point and one of the endpoints, and the
// perpendicular distance between the line connecting the nodes and the control
// point. The calculations for generating and restoring these offsets is spelled
// out below.
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
    selected: null,
    selectedOffset: null,
    fullOffsets: {},
    halfOffsets: {},
  },
};

// Return an array containing all control points.
export const allControlPoints = (state: State): ControlPoint[] => (
  Object.values(currentLatest(state.entities.controlPoints).byId)
);

// Return the control point for the given arrow, if one exists.
export const controlPointForArrow = (state: State, arrowId: string): ControlPoint => {
  const cp = allControlPoints(state).find(({ arrow }) => arrow === arrowId);
  if (!cp) {
    throw new Error(`No ControlPoint associated with Arrow having ID "${arrowId}"`);
  }
  return cp;
};

export const controlPointsReducer = (state: State, action: Action): ControlPointState => {
  if (isInEditMode(state)) {
    switch (action.type) {
      case A.ADD_ARROW:
        return addArrow(state, action.payload.start, action.payload.end, action.payload.id);
      case A.DELETE_ENTITIES:
        return deleteEntities(state, action.payload.controlPoints);
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
  }
  else {
    return state.entities.controlPoints;
  }
};

// Whenever we add a new arrow, we also add a new control point for it. The
// position of the control point is determined by the position of the arrow's
// start and end nodes, and whether the transition is a self-loop or not.
const addArrow = (state: State, start: string, end: string, arrow: string): ControlPointState => {
  const id = uuid();
  const startPos = nodeById(state, start).pos;
  const endPos = start === end ? startPos : nodeById(state, end).pos;

  const constructStandardPos = (start: Vector, end: Vector): Vector => {
    const diff = end.minus(start);
    // We offset the control point ever so slightly from the line joining the
    // endpoints; this forces the transition details into a better position.
    const perp = diff.perp().normalize().scale(1);
    return diff.scale(1 / 2).plus(perp).plus(start);
  };

  const controlPos = start === end
  ? startPos.minus(new Vector(0, 120))
  : constructStandardPos(startPos, endPos);

  return {
    wip: null,
    committed: _.merge({}, state.entities.controlPoints.committed, {
      byId: {
        [id]: { id, arrow, pos: controlPos },
      }
    }),
  };
};

const deleteEntities = (state: State, ids: string[]): ControlPointState => ({
  wip: null,
  committed: {
    ...state.entities.controlPoints.committed,
    byId: _.omit(state.entities.controlPoints.committed.byId, ids),
  },
});

// When the user presses the mouse over a control point, we revert to the last
// committed state and record the control point as the current selection. We do
// NOT calculate an offset here, since we need the cursor's position relative to
// the containing (SVG) element in order to do so.
const mouseDownControlPoint = (state: State, id: string): ControlPointState => ({
  ...state.entities.controlPoints,
  wip: null,
  committed: {
    ...state.entities.controlPoints.committed,
    selected: id,
  },
});

// When the mouse is released over a control point, we COMMIT the wip state, and
// remove any selection and offset that might have been created before a move.
const mouseUpControlPoint = (state: State): ControlPointState => ({
  wip: null,
  committed: {
    ...currentLatest(state.entities.controlPoints),
    selected: null,
    selectedOffset: null,
  },
});

// Here's where things start to get a little tricky: if a mouse press has been
// received by the canvas, we check if the cursor is currently down over a
// control point or a node. If it is down over a control point, we compute the
// current offset in preparation for a move; if it is down over a node, we
// compute the required offsetS in preparation for the node being moved.
const mouseDownCanvas = (state: State, mousePos: Vector): ControlPointState => {
  if (isMouseDownControlPoint(state)) return prepForDirectMove(state, mousePos);
  else if (isMouseDownNode(state)) return prepForIndirectMove(state, mousePos);
  else return state.entities.controlPoints;
};

// In order to prepare for a control point to be moved, we compute its offset
// from the cursor position. We also copy the current committed state into the
// WIP state at this point, since we update the WIP state throughout the move.
const prepForDirectMove = (state: State, mousePos: Vector): ControlPointState => {
  const controlPoints = state.entities.controlPoints.committed;
  if (!controlPoints.selected) {
    return state.entities.controlPoints;
  }
  const controlPoint = controlPoints.byId[controlPoints.selected];
  const selectedOffset = controlPoint.pos.minus(mousePos);
  return {
    ...state.entities.controlPoints,
    wip: _.merge({}, controlPoints, {
      selectedOffset,
    }),
  };
};

// Before a node is moved, we compute some information about any control points
// that are associated with any arrows connected to the node. This information
// includes offsets of 2 varieties: "full" and "half". A full offset is simply a
// difference between the current mouse position and a control point. We compute
// a full offset whenever all nodes associated with a control point are
// selected, since the control point will simply get translated along with the
// cursor in this case. Computing a half offset is more involved. In this case,
// we calculate the position of the control point relative to the node that is
// moving.
const prepForIndirectMove = (state: State, mousePos: Vector): ControlPointState => {
  const controlPoints = state.entities.controlPoints.committed;
  const selected = selectedNodes(state);

  // A control point is fully affected if both of the nodes associated with its
  // arrow are selected.
  const fullyAffected = Object.values(controlPoints.byId).filter(controlPoint => {
    const arrow = arrowById(state, controlPoint.arrow);
    return selected.includes(arrow.start) && selected.includes(arrow.end);
  });

  const fullOffsets = fullyAffected.reduce((acc, cp) => ({
    ...acc,
    [cp.id]: new Vector(cp.pos.x - mousePos.x, cp.pos.y - mousePos.y),
  }), {});

  // A control point is half affected if exactly one of the nodes associated
  // with its arrow is selected.
  const halfOffsets = Object.values(controlPoints.byId).reduce((acc, p) => {
    const arrow = arrowById(state, p.arrow);
    const includesStart = selected.includes(arrow.start);
    const includesEnd = selected.includes(arrow.end);
    if (!xOr(includesStart, includesEnd)) {
      return acc;
    }

    const fixedPos = nodeById(state, includesEnd ? arrow.start : arrow.end).pos;
    const movingPos = nodeById(state, includesStart ? arrow.start : arrow.end).pos;
    const movingOffset = movingPos.minus(mousePos);
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

  // Just as in a direct move, we move the committed state into the WIP state in
  // preparation for movement.
  return {
    ...state.entities.controlPoints,
    wip: {
      ...controlPoints,
      fullOffsets,
      halfOffsets,
    },
  };
};

// Just as we needed to handle two cases when the mouse is pressed over the
// canvas, so too must we manage two cases when the mouse is moved. In this
// case, we distinguish between a "direct" move -- when the user is moving the
// control point by dragging it, and an "indirect" move -- when the control
// point is moved as a result of a node moving.
const mouseMoveCanvas = (state: State, mousePos: Vector): ControlPointState => {
  if (isMouseDownControlPoint(state)) return moveDirect(state, mousePos);
  else if (isMouseDownNode(state)) return moveIndirect(state, mousePos);
  else return state.entities.controlPoints;
};

// To perform a direct move, we simply add the computed offset to the current
// cursor position, and use this as the new position for the selected control
// point. This is only slightly complicated by the need to check that the
// "selected" and "offset" properties must be non-null.
const moveDirect = (state: State, mousePos: Vector): ControlPointState => {
  const { controlPoints } = state.entities;

  if (!controlPoints.wip || !controlPoints.wip.selected || !controlPoints.wip.selectedOffset) {
    return controlPoints;
  }

  const controlPoint = controlPoints.wip.byId[controlPoints.wip.selected];
  const updatedPos = mousePos.plus(controlPoints.wip.selectedOffset);

  return {
    ...controlPoints,
    wip: _.merge({}, controlPoints.wip, {
      byId: {
        [controlPoint.id]: { ...controlPoint, pos: updatedPos },
      },
    }),
  };
};

// To perform an indirect move, we essentially reverse the process of computing
// the full and half offsets in order to update the positions of the affected
// control points in the WIP state.
const moveIndirect = (state: State, mousePos: Vector): ControlPointState => {
  const { controlPoints } = state.entities;

  if (!controlPoints.wip) {
    return controlPoints;
  }

  const fullMoved = Object.keys(controlPoints.wip.fullOffsets).reduce((acc, id) => {
    const controlPoint = controlPoints.wip!.byId[id];
    const updatedPos = mousePos.plus(controlPoints.wip!.fullOffsets[id]);
    return {
      ...acc,
      [id]: { ...controlPoint, pos: updatedPos },
    };
  }, {});

  const halfMoved = Object.keys(controlPoints.wip.halfOffsets).reduce((acc, id) => {
    const controlPoint = controlPoints.wip!.byId[id];
    const { fixedPos, movingOffset, fractionAlong, perpLength } = controlPoints.wip!.halfOffsets[id];
    const newPos = mousePos.plus(movingOffset);
    const diff = fixedPos.minus(newPos);
    const alongDiff = diff.scale(fractionAlong).plus(newPos);
    const updatedPos = diff.perp().normalize().scale(perpLength).plus(alongDiff);

    return {
      ...acc,
      [id]: { ...controlPoint, pos: updatedPos },
    };
  }, {});

  return {
    ...controlPoints,
    wip: _.merge({}, controlPoints.wip, {
      byId: {
        ...fullMoved,
        ...halfMoved,
      },
    }),
  };
};

// When the mouse is released, we commit the wip state and remove all offsets
// that might have been created before a move.
const mouseUpNodeOrCanvas = (state: State): ControlPointState => ({
  ...state.entities.controlPoints,
  wip: null,
  committed: {
    ...currentLatest(state.entities.controlPoints),
    selected: null,
    selectedOffset: null,
    fullOffsets: {},
    halfOffsets: {},
  },
});
