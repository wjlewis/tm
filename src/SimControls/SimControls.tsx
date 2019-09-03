import React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import * as A from '../state-mgmt/actions';
import './SimControls.css';

export interface SimControlsProps {
  reset: () => void;
  togglePlayPause: () => void;
  step: () => void;
}

class SimControls extends React.Component<SimControlsProps> {
  render() {
    return (
      <div className="sim-controls">
        <button onClick={this.reset}>Reset</button>
        <button onClick={this.togglePlayPause}>Toggle Play/Pause</button>
        <button onClick={this.step}>Step</button>
      </div>
    );
  }

  private reset = () => {
    this.props.reset();
  };

  private togglePlayPause = () => {
    this.props.togglePlayPause();
  };

  private step = () => {
    this.props.step();
  };
}

const mapDispatchToProps = (dispatch: Dispatch) => ({
  reset: () => dispatch(A.resetSim()),
  togglePlayPause: () => dispatch(A.togglePlayPauseSim()),
  step: () => dispatch(A.stepSim()),
});

export default connect(
  null,
  mapDispatchToProps,
)(SimControls);
