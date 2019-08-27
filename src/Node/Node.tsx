import React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import classNames from 'classnames';
import { State } from '../state-mgmt/state';
import * as A from '../state-mgmt/actions';
import { Node as NodeDetails, isNodeSelected, isStartNode } from '../state-mgmt/Node';
import Vector from '../tools/Vector';
import './Node.css';

// A node represents a machine state in the TM formalization. We render nodes as
// circles (with additional embellishments if they are also start or accepting
// nodes). Additionally, a node may be given a "mnemonic" -- a 0-4 character
// string -- to clarify its purpose.

export interface NodeProps {
  details: NodeDetails;
  isSelected: boolean;
  isStart: boolean;
  changeMnemonic: (value: string) => void;
  blurMnemonic: () => void;
  mouseDown: () => void;
  mouseUp: () => void;
}

export const NODE_RADIUS = 20;

class Node extends React.Component<NodeProps> {
  render() {
    const { pos, mnemonic } = this.props.details;
    const className = classNames('node', { 'node--selected': this.props.isSelected });

    // This was determined experimentally, although it is obviously related to NODE_RADIUS.
    const mnemonicPos = pos.plus(new Vector(-20, 22));

    return (
      <g>
        <g onMouseDown={this.handleMouseDown}
           onMouseUp={this.handleMouseUp}>
          <circle className={className}
                  cx={pos.x}
                  cy={pos.y}
                  r={NODE_RADIUS} />
          {this.props.isStart && this.renderStartArrow()}
          {this.props.details.isFinal && this.renderFinalCircle()}
        </g>
        <foreignObject x={mnemonicPos.x} y={mnemonicPos.y} width="100" height="100">
          <input className="node__mnemonic-input"
                 value={mnemonic}
                 onChange={this.handleInputChange}
                 onBlur={this.handleInputBlur}
                 type="text"
                 maxLength={4} />
        </foreignObject>
      </g>
    );
  }

  // In order to distinguish the starting state from other states, we render a
  // small arrow to the left of it. This arrow consists of two parts: a head and
  // a line.
  private renderStartArrow = () => {
    const { pos } = this.props.details;
    const lineLength =  25;
    const headLength = 15;
    const wingLength = 5;
    const tip = pos.minus(new Vector(NODE_RADIUS, 0));
    const end = tip.minus(new Vector(lineLength, 0));
    const wing1 = tip.plus(new Vector(-headLength, -wingLength));
    const wing2 = tip.plus(new Vector(-headLength, wingLength));

    return (
      <g>
        <line className="node__start-arrow-line" x1={tip.x} y1={tip.y} x2={end.x} y2={end.y} />
        <path className="node__start-arrow-head"
              d={`M ${tip.x} ${tip.y} L ${wing1.x} ${wing1.y} L ${wing2.x} ${wing2.y}`} />
      </g>
    );
  };

  // If the node is represents an accepting (or "final") state, then we render
  // an additional circle inside of it, as is customary.
  private renderFinalCircle = () => {
    const { pos } = this.props.details;
    return <circle className="node__final-circle" cx={pos.x} cy={pos.y} r={NODE_RADIUS-3} />;
  };

  // We call "preventDefault" on this event to prevent the ugly text
  // highlighting behavior that occurs when a user drags the mouse across the
  // screen.
  private handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    this.props.mouseDown();
  };

  // We call "stopPropagation" on this event to prevent it from bubbling to the
  // canvas component. This is because it is useful to be able to detect if the
  // mouse has been released over the canvas and NOT over a node or control
  // point.
  private handleMouseUp = (e: React.MouseEvent) => {
    e.stopPropagation();
    this.props.mouseUp();
  };

  private handleInputChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    this.props.changeMnemonic(evt.target.value);
  };

  private handleInputBlur = () => {
    this.props.blurMnemonic();
  };
}

const mapStateToProps = (state: State, ownProps: any) => ({
  isSelected: isNodeSelected(state, ownProps.details.id),
  isStart: isStartNode(state, ownProps.details.id),
});

const mapDispatchToProps = (dispatch: Dispatch, ownProps: any) => ({
  changeMnemonic: (value: string) => dispatch(A.changeMnemonic(ownProps.details.id, value)),
  blurMnemonic: () => dispatch(A.blurMnemonic()),
  mouseDown: () => dispatch(A.mouseDownNode(ownProps.details.id)),
  mouseUp: () => dispatch(A.mouseUpNode()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Node);
