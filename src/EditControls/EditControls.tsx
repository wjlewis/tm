import React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { State } from '../state-mgmt/state';
import *  as A from '../state-mgmt/actions';
import { whichButtonTypes, EditButtonType, EditButtonTypes } from '../state-mgmt/EditControls';
import './EditControls.css';

export interface EditControlsProps {
  buttonTypes: EditButtonType[];
  addState: () => void;
  removeStates: () => void;
  addTransition: () => void;
  makeStart: () => void;
  toggleAccepting: () => void;
}

class EditControls extends React.Component<EditControlsProps> {
  render() {
    return (
      <div className="edit-controls">
        {this.props.buttonTypes.map(type => (
          <button key={type}
                  onClick={this.actions[type]}>{type}</button>
        ))}
      </div>
    );
  }

  private actions: { [key: string]: () => void } = {
    [EditButtonTypes.ADD_STATE]: () => this.props.addState(),
    [EditButtonTypes.REMOVE_STATE]: () => this.props.removeStates(),
    [EditButtonTypes.REMOVE_STATES]: () => this.props.removeStates(),
    [EditButtonTypes.ADD_SELF_TRANSITION]: () => this.props.addTransition(),
    [EditButtonTypes.ADD_TRANSITION]: () => this.props.addTransition(),
    [EditButtonTypes.MAKE_START]: () => this.props.makeStart(),
    [EditButtonTypes.TOGGLE_ACCEPTING]: () => this.props.toggleAccepting(),
  };
}

const mapStateToProps = (state: State) => ({
  buttonTypes: whichButtonTypes(state),
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  addState: () => dispatch(A.startAddingNode()),
  removeStates: () => dispatch(A.deleteSelectedNodes()),
  addTransition: () => dispatch(A.addTransition()),
  makeStart: () => dispatch(A.makeStartNode()),
  toggleAccepting: () => dispatch(A.toggleAcceptingNodes()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(EditControls);
