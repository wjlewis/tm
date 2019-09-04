import React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import * as A from '../state-mgmt/actions';
import { State } from '../state-mgmt/state';
import{ Arrow as ArrowDetails, allArrows } from '../state-mgmt/Arrow';
import { Node as NodeDetails, allNodes } from '../state-mgmt/Node';
import { ControlPoint as ControlPointDetails, allControlPoints } from '../state-mgmt/ControlPoint';
import { TransitionDetail, allGroupedTransitionDetails } from '../state-mgmt/TransitionDetail';
import Arrow from '../Arrow/Arrow';
import Node from '../Node/Node';
import ControlPoint from '../ControlPoint/ControlPoint';
import TransitionDetails from '../TransitionDetails/TransitionDetails';
import ShadowNode from '../ShadowNode/ShadowNode';
import Vector from '../tools/Vector';
import './Canvas.css';

// The canvas is the editing surface for the machine. It is responsible for
// rendering all nodes, arrows, control points, and transition details.

export interface CanvasProps {
  arrows: ArrowDetails[];
  nodes: NodeDetails[];
  controlPoints: ControlPointDetails[];
  transitionDetails: { [key: string]: TransitionDetail[] };
  mouseDown: (pos: Vector) => void;
  mouseUp: () => void;
  mouseMove: (pos: Vector) => void;
}

class Canvas extends React.Component<CanvasProps> {
  render() {
    const { arrows, nodes, controlPoints, transitionDetails } = this.props;
    // This configuration probably warrants an explanation. Some of the machine
    // components (e.g. arrows, control points) need to be rendered in an SVG
    // context. However, we cannot render the nodes and transition details
    // inside of one (strictly speaking, we could use "foreignObject" elements,
    // but this proved to be far more complicated). Therefore, we render an SVG
    // element inside of a containing div, and render the HTML elements inside
    // of the latter.
    return (
      <div className="canvas"
             onMouseDown={this.handleMouseDown}
             onMouseUp={this.handleMouseUp}
             onMouseMove={this.handleMouseMove}>
        <svg xmlns="http://www.w3.org/2000/svg"
             width="100%"
             height="100%">
          {arrows.map(details => <Arrow key={details.id} details={details} />)}
          {controlPoints.map(details => <ControlPoint key={details.id} details={details} />)}
        </svg>
        {nodes.map(details => <Node key={details.id} details={details} />)}
        {Object.keys(transitionDetails).map(arrowId => (
          <TransitionDetails key={arrowId} arrowId={arrowId} details={transitionDetails[arrowId]} />
        ))}
        <ShadowNode />
      </div>
    );
  }

  private handleMouseDown = (e: React.MouseEvent) => {
    this.props.mouseDown(this.computeMousePos(e));
  };

  private handleMouseUp = () => {
    this.props.mouseUp();
  };

  private handleMouseMove = (e: React.MouseEvent) => {
    this.props.mouseMove(this.computeMousePos(e));
  };

  // Here we compute the position of the mouse relative to the canvas itself
  // (rather than the browser client, or some other frame of reference).
  private computeMousePos(e: React.MouseEvent) {
    const { left, top } = e.currentTarget.getBoundingClientRect();
    const { clientX, clientY } = e;
    return new Vector(clientX - left, clientY - top);
  };
}

const mapStateToProps = (state: State) => ({
  arrows: allArrows(state),
  nodes: allNodes(state),
  controlPoints: allControlPoints(state),
  transitionDetails: allGroupedTransitionDetails(state),
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  mouseDown: (pos: Vector) => dispatch(A.mouseDownCanvas(pos)),
  mouseUp: () => dispatch(A.mouseUpCanvas()),
  mouseMove: (pos: Vector) => dispatch(A.mouseMoveCanvas(pos)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Canvas);
