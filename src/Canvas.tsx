import React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import * as actions from './state/actions';
import { selectNodes } from './state/selectors';
import Node from './Node';
import { State, Node as NodeType } from './state/reducers';

export interface CanvasProps {
  nodes: NodeType[];
  mouseUp: () => void;
  keyDown: (key: string) => void;
  keyUp: (key: string) => void;
}

class Canvas extends React.Component<CanvasProps> {
  render() {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width="800" height="400">
        {this.props.nodes.map(node => <Node key={node.id} info={node} />)}
      </svg>
    );
  }

  componentDidMount() {
    window.addEventListener('mouseup', this.handleMouseUp);
    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('keyup', this.handleKeyUp);
  }

  componentWillUnmount() {
    window.removeEventListener('mouseup', this.handleMouseUp);
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('keyup', this.handleKeyUp);
  }

  private handleMouseUp = () => {
    this.props.mouseUp();
  };

  private handleKeyDown = (evt: any) => {
    this.props.keyDown(evt.key);
  };

  private handleKeyUp = (evt: any) => {
    this.props.keyUp(evt.key);
  };
}

const mapStateToProps = (state: State) => ({
  nodes: selectNodes(state),
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  mouseUp: () => dispatch(actions.mouseUpCanvas()),
  keyDown: (key: string) => dispatch(actions.keyDown(key)),
  keyUp: (key: string) => dispatch(actions.keyUp(key)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Canvas);
