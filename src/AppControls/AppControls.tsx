import React from 'react';
import './AppControls.css';

export interface AppControlsProps {}

class AppControls extends React.Component<AppControlsProps> {
  render() {
    return (
      <div className="app-controls">
        <button className="app-controls__button app-controls__download-button">
        </button>
        <button className="app-controls__button app-controls__upload-button">
        </button>

        <a className="app-controls__link" href="#tutorial">Tutorial</a>
        <a className="app-controls__link" href="#about">About</a>
        <a className="app-controls__link app-controls__source-link"
           href="https://github.com/wjlewis/tm"
           target="_blank"
           rel="noopener noreferrer">
          &lt;Source&#47;&gt;
        </a>
      </div>
    );
  }
}

export default AppControls;
