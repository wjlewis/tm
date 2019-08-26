import React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { keyDown, keyUp } from '../state-mgmt/actions';
import Canvas from '../Canvas/Canvas';
import EditControls from '../EditControls/EditControls';
import Tape from '../Tape/Tape';
import './App.css';

// The entire app consists of only a few components: a "canvas" for displaying
// the machine state editing UI, the machine's tape, some buttons that perform
// various editing tasks, and some buttons for starting, pausing, stepping, and
// resetting the machine.

export interface AppProps {
  keyDown: (key: string) => void;
  keyUp: (key: string) => void;
}

class App extends React.Component<AppProps> {
  render() {
    return (
      <div className="app">
        <Canvas />
        <Tape />
        <EditControls />
      </div>
    );
  }

  // We add the keyboard listeners to the document so that the user does not
  // need to focus any element before keypresses can be recorded.
  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyDown as unknown as EventListener);
    document.addEventListener('keyup', this.handleKeyUp as unknown as EventListener);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown as unknown as EventListener);
    document.removeEventListener('keyup', this.handleKeyUp as unknown as EventListener);
  }

  private handleKeyDown = (e: React.KeyboardEvent) => {
    this.props.keyDown(e.key);
  };

  private handleKeyUp = (e: React.KeyboardEvent) => {
    this.props.keyUp(e.key);
  };
}

const mapDispatchToProps = (dispatch: Dispatch) => ({
  keyDown: (key: string) => dispatch(keyDown(key)),
  keyUp: (key: string) => dispatch(keyUp(key)),
});

export default connect(
  null,
  mapDispatchToProps,
)(App);
