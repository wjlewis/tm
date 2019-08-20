import React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import * as actions from '../state/actions';
import { State, Node as NodeType, MouseInfo, Transition as TransitionType } from '../state/reducers/reducer';
import { isMouseDownNode, isAddingNode, allNodes, mouseInfo, allTransitions } from '../state/selectors';
import Node from '../Node/Node';
import Transition from '../Transition/Transition';

export interface CanvasProps {
  nodes: NodeType[];
  transitions: TransitionType[];
  isMouseDownNode: boolean;
  isAddingNode: boolean;
  mouseInfo: MouseInfo;
  mouseUp: () => void;
  mouseDown: (offsetX: number, offsetY: number) => void;
  mouseMove: (offsetX: number, offsetY: number) => void;
  keyDown: (key: string) => void;
  keyUp: (key: string) => void;
}

class Canvas extends React.Component<CanvasProps> {
  render() {
    return (
      <svg className="canvas"
           xmlns="http://www.w3.org/2000/svg"
           width="100%"
           height="100%"
           onMouseDown={this.handleMouseDown}
           onMouseUp={this.handleMouseUp}
           onMouseMove={this.handleMouseMove}>
        {this.props.transitions.map(trans => <Transition key={trans.id} info={trans} />)}
        {this.props.nodes.map(node => <Node key={node.id} info={node} />)}
        {this.props.isAddingNode && this.renderPhantomNode()}
      </svg>
    );
  }

  private handleMouseDown = (evt: any) => {
    const { offsetX, offsetY } = this.computeOffsets(evt);
    this.props.mouseDown(offsetX, offsetY);
  };

  private handleMouseMove = (evt: any) => {
    const { offsetX, offsetY } = this.computeOffsets(evt);
    this.props.mouseMove(offsetX, offsetY);
  };

  private computeOffsets(evt: any) {
    const { left, top } = evt.currentTarget.getBoundingClientRect();
    const { clientX, clientY } = evt;
    return { offsetX: clientX - left, offsetY: clientY - top };
  }

  componentDidMount() {
    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('keyup', this.handleKeyUp);
  }

  componentWillUnmount() {
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

  private renderPhantomNode() {
    const { x, y } = this.props.mouseInfo;
    return (
      <circle cx={x} cy={y} r="20" fill="blue" />
    );
  }
}

const mapStateToProps = (state: State) => ({
  isMouseDownNode: isMouseDownNode(state),
  isAddingNode: isAddingNode(state),
  mouseInfo: mouseInfo(state),
  nodes: allNodes(state),
  transitions: allTransitions(state),
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  mouseUp: () => dispatch(actions.mouseUpCanvas()),
  mouseDown: (offsetX: number, offsetY: number) => dispatch(actions.mouseDownCanvas(offsetX, offsetY)),
  mouseMove: (offsetX: number, offsetY: number) => dispatch(actions.mouseMove(offsetX, offsetY)),
  keyDown: (key: string) => dispatch(actions.keyDown(key)),
  keyUp: (key: string) => dispatch(actions.keyUp(key)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Canvas);
