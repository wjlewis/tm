import React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import classNames from 'classnames';
import { State } from '../state-mgmt/state';
import * as A from '../state-mgmt/actions';
import { Node as NodeDetails, isNodeSelected, isStartNode } from '../state-mgmt/Node';
import Vector from '../tools/Vector';
import './Node.css';

// A Node represents a state in the machine.

export interface NodeProps {
  details: NodeDetails;
  isSelected: boolean;
  isStart: boolean;
  changeMnemonic: (value: string) => void;
  mouseDown: () => void;
  mouseUp: () => void;
}

export const NODE_RADIUS = 20;

class Node extends React.Component<NodeProps> {
  render() {
    const { pos, mnemonic } = this.props.details;
    const className = classNames('node', { 'node--selected': this.props.isSelected });

    return (
      <g>
        {this.props.isStart && this.renderStartArrow()}
        <circle className={className}
                cx={pos.x}
                cy={pos.y}
                r={NODE_RADIUS}
                onMouseDown={this.handleMouseDown}
                onMouseUp={this.handleMouseUp} />
        {this.props.details.isAccepting && this.renderAcceptingCheck()}
        <foreignObject x={pos.x - 20} y={pos.y + 22} width="100" height="100">
          <input className="node__mnemonic-input"
                 value={mnemonic}
                 onChange={this.handleInputChange}
                 type="text"
                 maxLength={4} />
        </foreignObject>
      </g>
    );
  }

  private renderStartArrow = () => {
    const { pos } = this.props.details;
    const tip = pos.minus(new Vector(NODE_RADIUS, 0));
    const end = tip.minus(new Vector(18, 0));
    const wing1 = tip.plus(new Vector(-12, -5));
    const wing2 = tip.plus(new Vector(-12, 5));
    return (
      <g>
        <line className="node__start-arrow-line" x1={tip.x} y1={tip.y} x2={end.x} y2={end.y} />
        <path className="node__start-arrow-head"
              d={`M ${tip.x} ${tip.y} L ${wing1.x} ${wing1.y} L ${wing2.x} ${wing2.y}`} />
      </g>
    );
  };

  private renderAcceptingCheck = () => {
    const { pos } = this.props.details;
    return <circle cx={pos.x} cy={pos.y} r="5" fill="black" />;
  };

  private handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    this.props.mouseDown();
  };

  private handleMouseUp = (e: React.MouseEvent) => {
    e.stopPropagation();
    this.props.mouseUp();
  };

  private handleInputChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    this.props.changeMnemonic(evt.target.value);
  };
}

const mapStateToProps = (state: State, ownProps: any) => ({
  isSelected: isNodeSelected(state, ownProps.details.id),
  isStart: isStartNode(state, ownProps.details.id),
});

const mapDispatchToProps = (dispatch: Dispatch, ownProps: any) => ({
  changeMnemonic: (value: string) => dispatch(A.changeMnemonic(ownProps.details.id, value)),
  mouseDown: () => dispatch(A.mouseDownNode(ownProps.details.id)),
  mouseUp: () => dispatch(A.mouseUpNode()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Node);
