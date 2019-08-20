import React from 'react';
import EditControls from '../EditControls/EditControls';
import Canvas from '../Canvas/Canvas';

export interface AppProps {}

class App extends React.Component {
  render() {
    return (
      <>
        <EditControls />
        <Canvas />
      </>
    );
  }
}

export default App;
