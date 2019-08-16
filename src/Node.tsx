import React from 'react';
import { Node as NodeType } from './state/reducers';

export interface NodeProps {
  info: NodeType;
}

class Node extends React.Component<NodeProps> {
  render() {
    const { x, y } = this.props.info;
    return (
      <circle cx={x} cy={y} r="20" />
    );
  }
}

export default Node;
