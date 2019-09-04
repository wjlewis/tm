import React from 'react';
import './HaltReport.css';

export interface HaltReportProps {
  accepted: boolean;
}

class HaltReport extends React.Component<HaltReportProps> {
  render() {
    const { accepted: wasSuccess } = this.props;
    return (
      <div className="halt-report">
        <div className="halt-report__title">
          The machine has&nbsp;
          <span className={`halt-report__result halt-report__result--${wasSuccess ? 'accepted' : 'rejected'}`}>
            {wasSuccess ? 'accepted' : 'rejected'}
          </span>
          &nbsp;the input string.
        </div>
      </div>
    );
  }
}

export default HaltReport;
