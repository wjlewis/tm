import React from 'react';
import './ErrorReport.css';

export interface ErrorReportProps {
  whatsWrong: string;
  howToFix: string | JSX.Element;
}

class ErrorReport extends React.Component<ErrorReportProps> {
  render() {
    return (
      <div className="error-report">
        <div className="error-report__section">
          <span className="error-report__title">What's wrong:&ensp;</span>
          <span className="error-report__content">{this.props.whatsWrong}</span>
        </div>
        <div className="error-report__section">
          <span className="error-report__title">How to fix it:&ensp;</span>
          <span className="error-report__content">{this.props.howToFix}</span>
        </div>
      </div>
    );
  }
}

export default ErrorReport;
