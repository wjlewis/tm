import React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { State } from '../state-mgmt/state';
import * as A from '../state-mgmt/actions';
import { machineName } from '../state-mgmt/MetaData';
import './NameInput.css';

export interface NameInputProps {
  name: string;
  changeName: (name: string) => void;
}

class NameInput extends React.Component<NameInputProps> {
  render() {
    return (
      <input className="name-input"
             type="text"
             value={this.props.name}
             onChange={this.handleNameChange}
             placeholder="Machine name" />
    );
  }

  private handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.props.changeName(e.target.value);
  };
}

const mapStateToProps = (state: State) => ({
  name: machineName(state),
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  changeName: (name: string) => dispatch(A.changeMachineName(name)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(NameInput);
