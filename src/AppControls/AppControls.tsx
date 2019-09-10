import React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import * as A from '../state-mgmt/actions';
import snapshots from './examples/snapshots';
import './AppControls.css';

export interface AppControlsProps {
  newMachine: () => void;
  download: () => void;
  upload: () => void;
  loadExample: (snapshot: any) => void;
}

class AppControls extends React.Component<AppControlsProps> {
  render() {
    return (
      <div className="app-controls">
        <div className="app-controls__buttons">
          <button className="app-controls__button app-controls__new-button"
                  title="new empty machine"
                  onClick={this.handleNewClick} />
          <button className="app-controls__button app-controls__download-button"
                  title="download machine (JSON)"
                  onClick={this.handleDownloadClick} />
          <button className="app-controls__button app-controls__upload-button"
                  title="upload machine (JSON)"
                  onClick={this.handleUploadClick} />
        </div>

        <select className="app-controls__selector"
                defaultValue="default"
                onChange={this.handleExampleSelection}>
          <option value="default" hidden key="default">Examples</option>
          {snapshots.map(s => (
            <option key={s.metaData.name} value={s.metaData.name}>{s.metaData.name}</option>
          ))}
        </select>

        <a className="app-controls__link"
           href={`${process.env.PUBLIC_URL}/tutorial.html`}
           target="_blank"
           rel="noopener noreferrer">
          Tutorial
        </a>
        <a className="app-controls__link"
           href={`${process.env.PUBLIC_URL}/guide.html`}
           target="_blank"
           rel="noopener noreferrer">
          Guide
        </a>
        <a className="app-controls__link"
           href={`${process.env.PUBLIC_URL}/about.html`}
           target="_blank"
           rel="noopener noreferrer">
          About
        </a>
      </div>
    );
  }

  private handleNewClick = () => {
    this.props.newMachine();
  };

  private handleDownloadClick = () => {
    this.props.download();
  };

  private handleUploadClick = () => {
    this.props.upload();
  };

  private handleExampleSelection = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const snapshotName = e.target.value;
    const snapshot = snapshots.find(s => s.metaData.name === snapshotName);
    if (snapshot) {
      this.props.loadExample(snapshot);
    }
  };
}

const mapDispatchToProps = (dispatch: Dispatch) => ({
  newMachine: () => dispatch(A.newMachine()),
  download: () => dispatch(A.downloadMachine()),
  upload: () => dispatch(A.uploadMachine()),
  loadExample: (snapshot: any) => dispatch(A.installSnapshot(snapshot, true)),
});

export default connect(
  null,
  mapDispatchToProps,
)(AppControls);
