import React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import classNames from 'classnames';
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
