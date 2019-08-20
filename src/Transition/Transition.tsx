import React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import * as actions from '../state/actions';
import { State, Transition as TransitionType } from '../state/reducers/reducer';
import { nodeById } from '../state/selectors';

export interface TransitionProps {
  info: TransitionType;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  isSelfLoop: boolean;
  mouseDown: () => void;
  mouseUp: () => void;
}

class Transition extends React.Component<TransitionProps> {
  render() {
    const { controlX, controlY } = this.props.info;
    return (
      <g>
        <path d={this.computePathString()} fill="none" stroke="black" />
        <circle cx={controlX}
                cy={controlY}
                r="5"
                fill="black"
                onMouseDown={this.handleMouseDown}
                onMouseUp={this.handleMouseUp} />
      </g>
    );
  }

  private handleMouseDown = () => {
    this.props.mouseDown();
  };

  private handleMouseUp = () => {
    this.props.mouseUp();
  };

  private computePathString() {
    if (this.props.isSelfLoop) {
      return this.computeSelfLoopString();
    } else {
      return this.computeStandardPathString();
    }
  }

  private computeStandardPathString() {
    const { x1, y1, x2, y2 } = this.props;
    const { controlX, controlY } = this.props.info;
    const midX = (x1 + x2) / 2;
    const midY = (y1 + y2) / 2;
    const cX = 2 * controlX - midX;
    const cY = 2 * controlY - midY;
    return `M ${x1} ${y1} Q ${cX} ${cY}, ${x2} ${y2}`;
  }

  private computeSelfLoopString() {
    const { x1, y1 } = this.props;
    const { controlX, controlY } = this.props.info;
    const midX = x1 + 4 / 3 * (controlX - x1);
    const midY = y1 + 4 / 3 * (controlY - y1);
    const deltaX = controlY - y1;
    const deltaY = x1 - controlX;
    const alpha = 1 / Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const sepFactor = 80;
    const cX1 = midX + sepFactor * alpha * deltaX;
    const cY1 = midY + sepFactor * alpha * deltaY;
    const cX2 = midX - sepFactor * alpha * deltaX;
    const cY2 = midY - sepFactor * alpha * deltaY;
    return `M ${x1} ${y1} C ${cX1} ${cY1}, ${cX2} ${cY2} ${x1} ${y1}`;
  }
}

const mapStateToProps = (state: State, ownProps: any) => {
  const startNode = nodeById(state, ownProps.info.start);
  const endNode = nodeById(state, ownProps.info.end);
  return {
    x1: startNode.x,
    y1: startNode.y,
    x2: endNode.x,
    y2: endNode.y,
    isSelfLoop: ownProps.info.start === ownProps.info.end,
  };
};

const mapDispatchToProps = (dispatch: Dispatch, ownProps: any) => ({
  mouseDown: () => dispatch(actions.mouseDownTransitionControl(ownProps.info.id)),
  mouseUp: () => dispatch(actions.mouseUpTransitionControl()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Transition);
