import React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import classNames from 'classnames';
import { State } from '../state-mgmt/state';
import * as A from '../state-mgmt/actions';
import { isInEditMode } from '../state-mgmt/Mode';
import { MAX_SIM_DIVISOR, simIntervalDivisor } from '../state-mgmt/Sim';
import './SimControls.css';

export interface SimControlsProps {
  isInEditMode: boolean;
  intervalDivisor: number;
  reset: () => void;
  resetRunning: () => void;
  pause: () => void;
  step: () => void;
  play: () => void;
  setIntervalDivisor: (divisor: number) => void;
}

class SimControls extends React.Component<SimControlsProps> {
  render() {
    const { isInEditMode } = this.props;
    const playPauseClassName = classNames(
      'sim-controls__button', 
      isInEditMode ? 'sim-controls__play-button' : 'sim-controls__pause-button',
    );

    return (
      <div className="sim-controls">
        <button className="sim-controls__button sim-controls__reset-button"
                title="reset simulation"
                onClick={this.reset} />
        <button className={playPauseClassName}
                title={isInEditMode ? 'play simulation' : 'pause simulation'}
                onClick={this.togglePlayPause} />
        <button className="sim-controls__button sim-controls__step-button"
                title="run a single step of the simulation"
                disabled={!isInEditMode}
                onClick={this.step} />
        <div className="sim-controls__speed-control">
          <span className="sim-controls__speed-control-label">slow</span>
          <input type="range"
                 value={this.props.intervalDivisor}
                 min={1}
                 max={MAX_SIM_DIVISOR}
                 onChange={this.handleSpeedChange} />
          <span className="sim-controls__speed-control-label">fast</span>
        </div>
      </div>
    );
  }

  private reset = () => {
    if (this.props.isInEditMode) {
      return this.props.reset();
    } else {
      return this.props.resetRunning();
    }
  };

  private togglePlayPause = () => {
    if (this.props.isInEditMode) this.props.play();
    else this.props.pause();
  };

  private step = () => {
    this.props.step();
  };

  private handleSpeedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.props.setIntervalDivisor(Number(e.target.value));
  };
}

const mapStateToProps = (state: State) => ({
  isInEditMode: isInEditMode(state),
  intervalDivisor: simIntervalDivisor(state),
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  reset: () => dispatch(A.resetSim()),
  resetRunning: () => dispatch(A.resetRunningSim()),
  pause: () => dispatch(A.pauseSim()),
  step: () => dispatch(A.stepSim()),
  play: () => dispatch(A.playSim()),
  setIntervalDivisor: (divisor: number) => dispatch(A.setSimIntervalDivisor(divisor)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SimControls);
