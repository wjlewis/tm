import React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import * as actions from './state/actions';
import { isNodeSelected } from './state/selectors';
import { State, Node as NodeType } from './state/reducers';

export interface NodeProps {
  info: NodeType;
  isSelected: boolean;
  mouseDown: () => void;
  mouseUp: () => void;
}

class Node extends React.Component<NodeProps> {
  render() {
    const { x, y } = this.props.info;
    return (
      <g>
        {this.props.isSelected && <circle cx={x} cy={y} r="22" fill="red" />}
        <circle cx={x} cy={y} r="20" onMouseDown={this.handleMouseDown} onMouseUp={this.handleMouseUp} />
      </g>
    );
  }

  private handleMouseDown = () => {
    this.props.mouseDown();
  };

  private handleMouseUp = (evt: any) => {
    evt.stopPropagation();
    this.props.mouseUp();
  };
}

const mapStateToProps = (state: State, ownProps: any) => ({
  isSelected: isNodeSelected(state, ownProps.info.id),
});

const mapDispatchToProps = (dispatch: Dispatch, ownProps: any) => ({
  mouseDown: () => dispatch(actions.mouseDownNode(ownProps.info.id)),
  mouseUp: () => dispatch(actions.mouseUpNode()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Node);
