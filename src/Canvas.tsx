import React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import * as actions from './state/actions';
import { State, Node as NodeType } from './state/reducers/reducer';
import { isMouseDown, allNodes } from './state/selectors';
import Node from './Node';

export interface CanvasProps {
  nodes: NodeType[];
  isMouseDown: boolean;
  mouseUp: () => void;
  mouseDown: (offsetX: number, offsetY: number) => void;
  mouseDrag: (offsetX: number, offsetY: number) => void;
  keyDown: (key: string) => void;
  keyUp: (key: string) => void;
}

class Canvas extends React.Component<CanvasProps> {
  render() {
    return (
      <svg xmlns="http://www.w3.org/2000/svg"
           width="800"
           height="400"
           onMouseDown={this.handleMouseDown}
           onMouseMove={this.handleMouseMove}>
        {this.props.nodes.map(node => <Node key={node.id} info={node} />)}
      </svg>
    );
  }

  private handleMouseDown = (evt: any) => {
    const { offsetX, offsetY } = this.computeOffsets(evt);
    this.props.mouseDown(offsetX, offsetY);
  };

  private handleMouseMove = (evt: any) => {
    if (this.props.isMouseDown) {
      const { offsetX, offsetY } = this.computeOffsets(evt);
      this.props.mouseDrag(offsetX, offsetY);
    }
  };

  private computeOffsets(evt: any) {
    const { left, top } = evt.currentTarget.getBoundingClientRect();
    const { clientX, clientY } = evt;
    return { offsetX: clientX - left, offsetY: clientY - top };
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
  isMouseDown: isMouseDown(state),
  nodes: allNodes(state),
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  mouseUp: () => dispatch(actions.mouseUpCanvas()),
  mouseDown: (offsetX: number, offsetY: number) => dispatch(actions.mouseDownCanvas(offsetX, offsetY)),
  mouseDrag: (offsetX: number, offsetY: number) => dispatch(actions.mouseDrag(offsetX, offsetY)),
  keyDown: (key: string) => dispatch(actions.keyDown(key)),
  keyUp: (key: string) => dispatch(actions.keyUp(key)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Canvas);
