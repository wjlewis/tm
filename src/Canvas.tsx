import React from 'react';
import { connect } from 'react-redux';
import { selectNodes } from './state/selectors';
import Node from './Node';
import { State, Node as NodeType } from './state/reducers';

export interface CanvasProps {
  nodes: NodeType[];
}

class Canvas extends React.Component<CanvasProps> {
  render() {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width="800" height="400">
        {this.props.nodes.map(node => <Node key={node.id} info={node} />)}
      </svg>
    );
  }
}

const mapStateToProps = (state: State) => ({
  nodes: selectNodes(state),
});

export default connect(
  mapStateToProps,
)(Canvas);
