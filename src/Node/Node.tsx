import React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import classNames from 'classnames';
import { State } from '../state-mgmt/state';
import * as A from '../state-mgmt/actions';
import { Node as NodeDetails, isNodeSelected } from '../state-mgmt/Node';
import './Node.css';

// A Node represents a state in the machine.

export interface NodeProps {
  details: NodeDetails;
  isSelected: boolean;
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
        <circle className={className}
                cx={pos.x}
                cy={pos.y}
                r={NODE_RADIUS}
                onMouseDown={this.handleMouseDown}
                onMouseUp={this.handleMouseUp} />
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
