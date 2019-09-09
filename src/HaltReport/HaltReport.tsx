import React from 'react';
import _ from 'lodash';
import './HaltReport.css';

export interface HaltReportProps {
  accepted: boolean;
  initTapeEntries: string[];
  finalTapeEntries: string[];
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
          &nbsp;the input string
          <span className="halt-report__tape-contents">
            {this.formatTapeEntries(this.props.initTapeEntries)}
          </span>
          It left the string
          <span className="halt-report__tape-contents">
            {this.formatTapeEntries(this.props.finalTapeEntries)}
          </span>
          on the tape.
        </div>
      </div>
    );
  }

  private formatTapeEntries(entries: string[]): string {
    const reversed = _.reverse(_.clone(entries));
    const trimmed = _.reverse(_.dropWhile(reversed, x => x.length === 0));
    const withExplicitNulls = trimmed.map(x => x.length === 0 ? '∅' : x);
    return [...withExplicitNulls, '∅', '∅', '∅'].join('');
  }
}

export default HaltReport;
