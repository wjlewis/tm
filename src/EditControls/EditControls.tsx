import React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { State } from '../state-mgmt/state';
import *  as A from '../state-mgmt/actions';
import { whichButtonTypes, EditButtonType, EditButtonTypes } from '../state-mgmt/EditControls';
import { isInEditMode } from '../state-mgmt/Mode';
import './EditControls.css';

export interface EditControlsProps {
  inEditMode: boolean;
  buttonTypes: EditButtonType[];
  undo: () => void;
  redo: () => void;
  addState: () => void;
  removeStates: () => void;
  addTransition: () => void;
  makeStart: () => void;
  toggleFinal: () => void;
}

class EditControls extends React.Component<EditControlsProps> {
  render() {
    return (
      <div className="edit-controls">
        <div className="edit-controls__undo-redo-buttons">
          <button className="edit-controls__button edit-controls__undo-button"
                  title="undo"
                  onClick={this.handleUndoButtonClick} />
          <button className="edit-controls__button edit-controls__redo-button"
                  title="redo"
                  onClick={this.handleRedoButtonClick} />
        </div>

        {this.props.inEditMode && this.props.buttonTypes.map(type => {
          const config = this.buttonConfig[type];
          return config && (
            <button className={`edit-controls__button edit-controls__${config.className}-button`}
                    title={config.title}
                    key={type}
                    onClick={config.action} />
          );
        })}
      </div>
    );
  }

  private handleUndoButtonClick = () => {
    this.props.undo();
  };

  private handleRedoButtonClick = () => {
    this.props.redo();
  };

  private buttonConfig: { [key: string]: { action: () => void, className: string, title: string } } = {
    [EditButtonTypes.ADD_STATE]: {
      action: () => this.props.addState(),
      className: 'add-state',
      title: 'add new state',
    },
    [EditButtonTypes.REMOVE_STATE]: {
      action: () => this.props.removeStates(),
      className: 'remove-state',
      title: 'remove state',
    },
    [EditButtonTypes.REMOVE_TWO_STATES]: {
      action: () => this.props.removeStates(),
      className: 'remove-two-states',
      title: 'remove states',
    },
    [EditButtonTypes.REMOVE_MANY_STATES]: {
      action: () => this.props.removeStates(),
      className: 'remove-many-states',
      title: 'remove states',
    },
    [EditButtonTypes.ADD_SELF_TRANSITION]: {
      action: () => this.props.addTransition(),
      className: 'add-self-transition',
      title: 'add self transition',
    },
    [EditButtonTypes.ADD_TRANSITION]: {
      action: () => this.props.addTransition(),
      className: 'add-transition',
      title: 'add transition',
    },
    [EditButtonTypes.MAKE_START]: {
      action: () => this.props.makeStart(),
      className: 'make-start',
      title: 'distinguish as initial state',
    },
    [EditButtonTypes.TOGGLE_ACCEPTING]: {
      action: () => this.props.toggleFinal(),
      className: 'toggle-accepting',
      title: 'toggle state\'s status as final'
    },
    [EditButtonTypes.TOGGLE_TWO_ACCEPTING]: {
      action: () => this.props.toggleFinal(),
      className: 'toggle-two-accepting',
      title: 'toggle states\' statuses as final',
    },
    [EditButtonTypes.TOGGLE_MANY_ACCEPTING]: {
      action: () => this.props.toggleFinal(),
      className: 'toggle-many-accepting',
      title: 'toggle states\' statuses as final',
    },
  };
}

const mapStateToProps = (state: State) => ({
  inEditMode: isInEditMode(state),
  buttonTypes: whichButtonTypes(state),
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  undo: () => dispatch(A.undo()),
  redo: () => dispatch(A.redo()),
  addState: () => dispatch(A.startAddingNode()),
  removeStates: () => dispatch(A.deleteSelectedNodes()),
  addTransition: () => dispatch(A.addTransitionBetweenSelected()),
  makeStart: () => dispatch(A.makeSelectedStartNode()),
  toggleFinal: () => dispatch(A.toggleSelectedFinalNodes()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(EditControls);
