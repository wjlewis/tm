import React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import *  as A from '../state-mgmt/actions';
import Canvas from '../Canvas/Canvas';
import Tape from '../Tape/Tape';
import EditControls from '../EditControls/EditControls';
import './App.css';

export interface AppProps {
  keyDown: (key: string) => void;
  keyUp: (key: string) => void;
}

class App extends React.Component<AppProps, any> {
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
  keyDown: (key: string) => dispatch(A.keyDown(key)),
  keyUp: (key: string) => dispatch(A.keyUp(key)),
});

export default connect(
  null,
  mapDispatchToProps,
)(App);
