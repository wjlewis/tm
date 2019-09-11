import React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import classNames from 'classnames';
import { State } from '../state-mgmt/state';
import * as A from '../state-mgmt/actions';
import { Node as NodeDetails, isNodeSelected, isStartNode } from '../state-mgmt/Node';
import { isInEditMode } from '../state-mgmt/Mode';
import { isNodeGlowing, isNodeCurrent, isNodeFadingIn, isNodeFadingOut, simInterval } from '../state-mgmt/Sim';
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
  isCurrent: boolean;
  isGlowing: boolean;
  isFadingIn: boolean;
  isFadingOut: boolean;
  simInterval: number;
  mouseDown: () => void;
  mouseUp: () => void;
}

export const NODE_RADIUS = 21;

class Node extends React.Component<NodeProps> {
  render() {
    const className = classNames('node', {
      'node--selected': this.props.isSelected,
      'node--final': this.props.details.isFinal,
      'node--start': this.props.isStart,
      'node--editable': this.props.isEditable,
      'node--glowing': !this.props.isEditable && this.props.isGlowing,
      'node--fading-in': !this.props.isEditable && this.props.isFadingIn,
      'node--fading-out': !this.props.isEditable && this.props.isFadingOut,
    });

    const pos = Vector.from(this.props.details.pos);

    const MARKER_WIDTH = 12;
    const MARKER_HEIGHT = 18;

    return (
      <div className="node__container">
        {this.props.isCurrent && this.props.isEditable &&
          <div className="node__current-marker"
               style={{
                 position: 'absolute',
                 left: pos.x - MARKER_WIDTH / 2,
                 top: pos.y - NODE_RADIUS - MARKER_HEIGHT - 2,
               }} />
        }
        <div className={className}
             onMouseDown={this.handleMouseDown}
             onMouseUp={this.handleMouseUp}
             style={{
               position: 'absolute',
               left: pos.x - NODE_RADIUS,
               top: pos.y - NODE_RADIUS,
               animationDuration: `${this.props.simInterval / 4}ms`,
             }} />
      </div>
    );
  }

  private handleMouseDown = (e: React.MouseEvent) => {
    this.props.mouseDown();
  };

  private handleMouseUp = (e: React.MouseEvent) => {
    this.props.mouseUp();
  };
}

const mapStateToProps = (state: State, ownProps: any) => ({
  isSelected: isNodeSelected(state, ownProps.details.id),
  isStart: isStartNode(state, ownProps.details.id),
  isEditable: isInEditMode(state),
  isCurrent: isNodeCurrent(state, ownProps.details.id),
  isGlowing: isNodeGlowing(state, ownProps.details.id),
  isFadingIn: isNodeFadingIn(state, ownProps.details.id),
  isFadingOut: isNodeFadingOut(state, ownProps.details.id),
  simInterval: simInterval(state),
});

const mapDispatchToProps = (dispatch: Dispatch, ownProps: any) => ({
  mouseDown: () => dispatch(A.mouseDownNode(ownProps.details.id)),
  mouseUp: () => dispatch(A.mouseUpNode()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Node);
