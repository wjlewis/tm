import React from 'react';
import { connect } from 'react-redux';
import { State } from '../state-mgmt/state';
import { isAddingNode, mousePos } from '../state-mgmt/UI';
import { NODE_RADIUS } from '../Node/Node';
import Vector from '../tools/Vector';
import './ShadowNode.css';

// When the user is in the process of adding a new node, we render a "shadow
// node" underneath the cursor to indicate the change in state. This node looks
// much like a real node but lacks all of the functionality.

export interface ShadowNodeProps {
  isVisible: boolean;
  pos: Vector;
}

class ShadowNode extends React.Component<ShadowNodeProps> {
  render() {
    const { isVisible, pos } = this.props;
    return (isVisible &&
      <circle className="shadow-node" cx={pos.x} cy={pos.y} r={NODE_RADIUS} />
    );
  }
}

const mapStateToProps = (state: State) => ({
  isVisible: isAddingNode(state),
  pos: mousePos(state),
});

export default connect(
  mapStateToProps,
)(ShadowNode);
