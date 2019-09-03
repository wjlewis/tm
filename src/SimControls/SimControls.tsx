import React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { State } from '../state-mgmt/state';
import * as A from '../state-mgmt/actions';
import { isInEditMode } from '../state-mgmt/Mode';
import './SimControls.css';

export interface SimControlsProps {
  reset: () => void;
  pause: () => void;
  step: () => void;
  play: () => void;
  isInEditMode: boolean;
}

class SimControls extends React.Component<SimControlsProps> {
  render() {
    const { isInEditMode } = this.props;
    return (
      <div className="sim-controls">
        <button onClick={this.reset}>
          Reset
        </button>
        <button onClick={this.togglePlayPause}>
          {isInEditMode ? 'Play' : 'Pause'}
        </button>
        <button disabled={!isInEditMode}
                onClick={this.step}>
          Step
        </button>
      </div>
    );
  }

  private reset = () => {
    this.props.reset();
  };

  private togglePlayPause = () => {
    if (this.props.isInEditMode) this.props.play();
    else this.props.pause();
  };

  private step = () => {
    this.props.step();
  };
}

const mapStateToProps = (state: State) => ({
  isInEditMode: isInEditMode(state),
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  reset: () => dispatch(A.resetSim()),
  pause: () => dispatch(A.pauseSim()),
  step: () => dispatch(A.stepSim()),
  play: () => dispatch(A.playSim()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SimControls);
