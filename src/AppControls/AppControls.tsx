import React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import * as A from '../state-mgmt/actions';
import './AppControls.css';

export interface AppControlsProps {
  download: () => void;
  upload: () => void;
}

class AppControls extends React.Component<AppControlsProps> {
  render() {
    return (
      <div className="app-controls">
        <div className="app-controls__buttons">
          <button className="app-controls__button app-controls__download-button"
                  title="download machine (JSON)"
                  onClick={this.handleDownloadClick}>
          </button>
          <button className="app-controls__button app-controls__upload-button"
                  title="upload machine (JSON)"
                  onClick={this.handleUploadClick}>
          </button>
        </div>

        <a className="app-controls__link" href="#examples">Examples</a>
        <a className="app-controls__link" href="#tutorial">Tutorial</a>
        <a className="app-controls__link" href="#guide">Guide</a>
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

  private handleDownloadClick = () => {
    this.props.download();
  };

  private handleUploadClick = () => {
    this.props.upload();
  };
}

const mapDispatchToProps = (dispatch: Dispatch) => ({
  download: () => dispatch(A.downloadMachine()),
  upload: () => dispatch(A.uploadMachine()),
});

export default connect(
  null,
  mapDispatchToProps,
)(AppControls);