import React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import classNames from 'classnames';
import { State } from '../state-mgmt/state';
import * as A from '../state-mgmt/actions';
import { Node as NodeDetails, isNodeSelected, isStartNode } from '../state-mgmt/Node';
import { isInEditMode } from '../state-mgmt/Mode';
import { isNodeActive } from '../state-mgmt/Sim';
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
  isEditable: boolean;
  isActive: boolean;
  changeMnemonic: (value: string) => void;
  blurMnemonic: () => void;
  mouseDown: () => void;
  mouseUp: () => void;
}

export const NODE_RADIUS = 21;

class Node extends React.Component<NodeProps> {
  render() {
    const { pos, mnemonic } = this.props.details;
    const className = classNames('node', {
      'node--selected': this.props.isSelected,
      'node--final': this.props.details.isFinal,
      'node--start': this.props.isStart,
      'node--editable': this.props.isEditable,
      'node--active': !this.props.isEditable && this.props.isActive,
    });

    const mnemonicClassName = classNames('node__mnemonic-input', {
      'node__mnemonic-input--editable': this.props.isEditable,
    });

    const mnemonicPos = pos.plus(new Vector(-NODE_RADIUS + 2, NODE_RADIUS + 3));

    return (
      <div className="node__container">
        <div className={className}
             onMouseDown={this.handleMouseDown}
             onMouseUp={this.handleMouseUp}
             style={{
               position: 'absolute',
               left: pos.x - NODE_RADIUS,
               top: pos.y - NODE_RADIUS,
             }} />
        <input className={mnemonicClassName}
               disabled={!this.props.isEditable}
               value={mnemonic}
               onChange={this.handleInputChange}
               onBlur={this.handleInputBlur}
               type="text"
               maxLength={4}
               style={{
                 position: 'absolute',
                 left: mnemonicPos.x,
                 top: mnemonicPos.y,
               }}/>
      </div>
    );
  }

  private handleMouseDown = (e: React.MouseEvent) => {
    this.props.mouseDown();
  };

  private handleMouseUp = (e: React.MouseEvent) => {
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
  isEditable: isInEditMode(state),
  isActive: isNodeActive(state, ownProps.details.id),
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
