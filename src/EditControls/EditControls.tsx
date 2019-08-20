import React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import * as actions from '../state/actions';
import { State } from '../state/reducers/reducer';
import { editMode, EditMode, EditModes } from '../state/selectors';

export interface EditControlsProps {
  mode: EditMode;
  addNode: () => void;
  removeSelected: () => void;
}

class EditControls extends React.Component<EditControlsProps> {
  render() {
    return (
      <div>
        {this.relevantConfig().map(info => (
          <button key={info.key} onClick={info.onClick}>{info.label}</button>
        ))}
      </div>
    );
  }

  private relevantConfig() {
    return this.config.filter(({ modes }) => modes.includes(this.props.mode));
  }

  private config = [
    {
      key: 'add-state',
      label: 'Add State',
      onClick: this.props.addNode,
      modes: [EditModes.NO_SEL, EditModes.ONE_SEL, EditModes.TWO_SEL, EditModes.MANY_SEL],
    },
    {
      key: 'remove-states',
      label: 'Remove States',
      onClick: this.props.removeSelected,
      modes: [EditModes.ONE_SEL, EditModes.TWO_SEL, EditModes.MANY_SEL],
    },
  ];
}

const mapStateToProps = (state: State) => ({
  mode: editMode(state),
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  addNode: () => dispatch(actions.beginAddNode()),
  removeSelected: () => dispatch(actions.removeSelectedNodes()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(EditControls);
