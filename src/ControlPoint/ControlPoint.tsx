import React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import * as A from '../state-mgmt/actions';
import { State } from '../state-mgmt/state';
import { arrowById } from '../state-mgmt/Arrow';
import { nodeById } from '../state-mgmt/Node';
import { ControlPoint as ControlPointDetails } from '../state-mgmt/ControlPoint';
import Vector from '../tools/Vector';
import './ControlPoint.css';

// A ControlPoint is a handle associated with an Arrow that allows the user to
// change the Arrow's shape. We render it as an arrowhead pointing indicating
// the direction of the Arrow.

export interface ControlPointProps {
  details: ControlPointDetails;
  start: Vector;
  end: Vector;
  isSelfLoop: boolean;
  mouseDown: () => void;
  mouseUp: () => void;
}

const ARROW_LENGTH = 18;

class ControlPoint extends React.Component<ControlPointProps> {
  render() {
    const pathString = this.props.isSelfLoop
    ? this.computeSelfLoopPathString()
    : this.computeStandardPathString();
    return <path className="control-point"
                 d={pathString}
                 onMouseDown={this.handleMouseDown}
                 onMouseUp={this.handleMouseUp} />;
  }

  private computeStandardPathString() {
    const { start, end } = this.props;
    const { pos } = this.props.details;
    const v1 = end.minus(start).normalize().scale(ARROW_LENGTH);
    const v2 = v1.perp().scale(1 / 3);
    const p1 = pos.minus(v1).plus(v2);
    const p2 = pos.minus(v1).minus(v2);
    return `M ${p1.x} ${p1.y} L ${pos.x} ${pos.y} L ${p2.x} ${p2.y}`;
  }

  private computeSelfLoopPathString() {
    const { start } = this.props;
    const { pos } = this.props.details;
    const v1 = pos.minus(start).normalize();
    const v2 = v1.perp().scale(ARROW_LENGTH);
    const tip = pos.plus(v2.scale(1 / 2));
    const p1 = tip.minus(v2).plus(v1.scale(ARROW_LENGTH / 3));
    const p2 = tip.minus(v2).minus(v1.scale(ARROW_LENGTH / 3));
    return `M ${p1.x} ${p1.y} L ${tip.x} ${tip.y} L ${p2.x} ${p2.y}`;
  }

  private handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    this.props.mouseDown();
  };

  private handleMouseUp = (e: React.MouseEvent) => {
    this.props.mouseUp();
    e.stopPropagation();
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
