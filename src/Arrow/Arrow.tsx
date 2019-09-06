import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { State } from '../state-mgmt/state';
import { Arrow as ArrowDetails } from '../state-mgmt/Arrow';
import { controlPointForArrow } from '../state-mgmt/ControlPoint';
import { nodeById } from '../state-mgmt/Node';
import { isInEditMode } from '../state-mgmt/Mode';
import { isArrowActive } from '../state-mgmt/Sim';
import Vector from '../tools/Vector';
import './Arrow.css';

// An arrow represents one or more transitions between machine states (which are
// represented by nodes). We render an arrow as a curved line between nodes,
// using the arrow's control points to construct this curve. There are two cases
// we need to consider: (1) if the arrow represents a self-transition, we render
// it using a cubic bezier curve, (2) if the arrow represents a standard
// transition, we use a quadratic curve.

export interface ArrowProps {
  details: ArrowDetails;
  start: Vector;
  end: Vector;
  control: Vector;
  isSelfLoop: boolean;
  isEditable: boolean;
  isActive: boolean;
}

class Arrow extends React.Component<ArrowProps> {
  render() {
    const className = classNames('arrow', {
      'arrow--editable': this.props.isEditable,
      'arrow--active': this.props.isActive,
    });

    const pathString = this.props.isSelfLoop
      ? this.computeCubicPathString()
      : this.computeQuadraticPathString();
    return <path className={className} d={pathString} />;
  }

  private computeQuadraticPathString() {
    // We need to distinguish between two types of "control point": the USER
    // control point, which is represented by an arrowhead that the user can
    // drag around, and the BEZIER control point, which is determined by the
    // position of the user control point and in turn determines the shape of
    // the arrow's curve. The main task here is to derive the BEZIER control
    // point from the USER control point. To do so, we first find the midpoint
    // between the nodes. We then construct the vector pointing from this
    // midpoint to the USER control point, and scale it by 2. The bezier control
    // point is described by the sum of this vector and the midpoint vector. I
    // discovered this via experimentation, but it works like a charm.
    const { start, end, control} = this.props;
    const mid = start.plus(end.minus(start).scale(1 / 2));
    const bezierControl= mid.plus(control.minus(mid).scale(2));
    return `M ${start.x} ${start.y} Q ${bezierControl.x} ${bezierControl.y} ${end.x} ${end.y}`;
  }

  private computeCubicPathString() {
    // To construct the bezier control pointS in this case, we first construct
    // the vector pointing from the node to the USER control point and scale it
    // by 4 / 3 (as above, I discovered this experimentally, and it appears to
    // work perfectly although I don't know why). We then move a specified
    // distance (`separation`) perpendicular to this vector in either direction.
    // This separation distance determines how wide the loop is.
    const { start, control } = this.props;
    const v1 = control.minus(start).scale(4 / 3);
    const separation = 80;
    // If the control point is on top of its associated node, we place the
    // bezier control points horizontally to the left and right.
    const v2 = v1.magnitude() !== 0
      ? v1.perp().normalize().scale(separation)
      : new Vector(separation, 0);
    const ctrl1 = start.plus(v1).plus(v2);
    const ctrl2 = start.plus(v1).minus(v2);
    return `M ${start.x} ${start.y} C ${ctrl1.x} ${ctrl1.y} ${ctrl2.x} ${ctrl2.y} ${start.x} ${start.y}`;
  }
}

const mapStateToProps = (state: State, ownProps: any) => {
  const start = nodeById(state, ownProps.details.start);
  const end = nodeById(state, ownProps.details.end);
  const controlPoint = controlPointForArrow(state, ownProps.details.id);
  return {
    start: Vector.from(start.pos),
    end: Vector.from(end.pos),
    control: Vector.from(controlPoint.pos),
    isSelfLoop: start.id === end.id,
    isEditable: isInEditMode(state),
    isActive: isArrowActive(state, ownProps.details.id),
  };
};

export default connect(
  mapStateToProps,
)(Arrow);
