import React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import classNames from 'classnames';
import * as A from '../state-mgmt/actions';
import { State } from '../state-mgmt/state';
import { arrowById } from '../state-mgmt/Arrow';
import { nodeById } from '../state-mgmt/Node';
import { ControlPoint as ControlPointDetails } from '../state-mgmt/ControlPoint';
import { isInEditMode } from '../state-mgmt/Mode';
import { isControlPointActive } from '../state-mgmt/Sim';
import Vector from '../tools/Vector';
import './ControlPoint.css';

// A control point is a draggable handle that the user can position to alter the
// curve of an arrow. Control points are essential in being able to layout a
// machine in an aesthetically pleasing way. As for arrows, there are 2 cases to
// consider here: (1) the control point is for a self-transition, and (2) it is
// for a standard transition. In both cases, we render the control point as an
// arrowhead pointing in the direction of the transition that its arrow
// represents.

export interface ControlPointProps {
  details: ControlPointDetails;
  start: Vector;
  end: Vector;
  isSelfLoop: boolean;
  isEditable: boolean;
  isActive: boolean;
  mouseDown: () => void;
  mouseUp: () => void;
}

const ARROW_LENGTH = 18;

class ControlPoint extends React.Component<ControlPointProps> {
  render() {
    const className = classNames('control-point', {
      'control-point--editable': this.props.isEditable,
      'control-point--active': this.props.isActive,
    });

    const pathString = this.props.isSelfLoop
    ? this.computeCubicString()
    : this.computeQuadraticPathString();
    return <path className={className}
                 d={pathString}
                 onMouseDown={this.handleMouseDown}
                 onMouseUp={this.handleMouseUp} />;
  }

  // In the quadratic (i.e. standard transition) case, we render the control
  // point as an arrowhead that is parallel to the line segment connecting the
  // two nodes that its arrow joins.
  private computeQuadraticPathString() {
    const { start, end } = this.props;
    const { pos } = this.props.details;
    const v1 = end.minus(start).normalize().scale(ARROW_LENGTH);
    const v2 = v1.perp().scale(1 / 3);
    const p1 = pos.minus(v1).plus(v2);
    const p2 = pos.minus(v1).minus(v2);
    return `M ${p1.x} ${p1.y} L ${pos.x} ${pos.y} L ${p2.x} ${p2.y}`;
  }

  // For a self-transition, we render the control point as an arrowhead that is
  // perpendicular to the line connecting it to the node that its arrow
  // connects.
  private computeCubicString() {
    const { start } = this.props;
    const { pos } = this.props.details;
    const v1 = pos.minus(start).normalize();
    const v2 = v1.perp().scale(ARROW_LENGTH);
    const tip = pos.plus(v2.scale(1 / 2));
    const p1 = tip.minus(v2).plus(v1.scale(ARROW_LENGTH / 3));
    const p2 = tip.minus(v2).minus(v1.scale(ARROW_LENGTH / 3));
    return `M ${p1.x} ${p1.y} L ${tip.x} ${tip.y} L ${p2.x} ${p2.y}`;
  }

  // As for nodes, we call "preventDefault" on the event in order to prevent the
  // annoying text-highlighting that occurs when a user drags the mouse around.
  private handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    this.props.mouseDown();
  };

  private handleMouseUp = (e: React.MouseEvent) => {
    this.props.mouseUp();
  };
}

const mapStateToProps = (state: State, ownProps: any) => {
  const arrow = arrowById(state, ownProps.details.arrow);
  const start = nodeById(state, arrow.start);
  const end = nodeById(state, arrow.end);
  return {
    start: start.pos,
    end: end.pos,
    isSelfLoop: start.id === end.id,
    isEditable: isInEditMode(state),
    isActive: isControlPointActive(state, ownProps.details.id),
  };
};

const mapDispatchToProps = (dispatch: Dispatch, ownProps: any) => ({
  mouseDown: () => dispatch(A.mouseDownControlPoint(ownProps.details.id)),
  mouseUp: () => dispatch(A.mouseUpControlPoint()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ControlPoint);
