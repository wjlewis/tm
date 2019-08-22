import React from 'react';
import { connect } from 'react-redux';
import { State } from '../state-mgmt/state';
import { Arrow as ArrowDetails } from '../state-mgmt/Arrow';
import { controlPointForArrow } from '../state-mgmt/ControlPoint';
import { nodeById } from '../state-mgmt/Node';
import Vector from '../tools/Vector';
import './Arrow.css';

/*
 * An Arrow is simply a curve connecting two (not necessarily distinct Nodes).
 * If the start and end nodes are distinct, we render the Arrow as a quadratic
 * bezier curve; if they are the same, we render it as a cubic curve.
 */

export interface ArrowProps {
  details: ArrowDetails;
  start: Vector;
  end: Vector;
  control: Vector;
  isSelfLoop: boolean;
}

class Arrow extends React.Component<ArrowProps> {
  render() {
    const pathString = this.props.isSelfLoop
      ? this.computeCubicPathString()
      : this.computeQuadraticPathString();
    return <path className="arrow" d={pathString} />;
  }

  private computeQuadraticPathString() {
    // To compute the bezier control point from the user control point, we first
    // find the midpoint between the nodes. We then construct the vector
    // pointing from this midpoint to the user control point, and scale it by 2.
    // The bezier control point is described by the sum of this vector and the
    // midpoint vector.
    const { start, end, control} = this.props;
    const mid = start.plus(end.minus(start).scale(1 / 2));
    const bezierControl= mid.plus(control.minus(mid).scale(2));
    return `M ${start.x} ${start.y} Q ${bezierControl.x} ${bezierControl.y} ${end.x} ${end.y}`;
  }

  private computeCubicPathString() {
    // To construct the bezier control points in this case, we first construct
    // the vector pointing from the node to the user control point and scale it
    // by 4 / 3 (I discovered this experimentally, and it appears to work
    // perfectly although I don't know why). We then move a specified distance
    // (`separation`) perpendicular to this vector in either direction.
    const { start, control } = this.props;
    const v1 = control.minus(start).scale(4 / 3);
    const separation = 80;
    const v2 = v1.perp().normalize().scale(separation);
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
    start: start.pos,
    end: end.pos,
    control: controlPoint.pos,
    isSelfLoop: start.id === end.id,
  };
};

export default connect(
  mapStateToProps,
)(Arrow);
