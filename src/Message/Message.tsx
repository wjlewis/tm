import React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { State } from '../state-mgmt/state';
import * as A from '../state-mgmt/actions';
import { showMessage, messageTitle, messageContent } from '../state-mgmt/Message';
import './Message.css';

export interface MessageProps {
  show: boolean;
  title: null | string;
  content: null | string | JSX.Element;
  dismiss: () => void;
}

class Message extends React.Component<MessageProps> {
  render() {
    return this.props.show && (
      <div className="message__container" onClick={this.dismiss}>
        <div className="message" onClick={this.handleMessageClick}>
          <h1 className="message__title">{this.props.title}</h1>
          <div className="message__content">{this.props.content}</div>
          <button className="message__dismiss-button"
                  onClick={this.dismiss}>
            Dismiss
          </button>
        </div>
      </div>
    );
  }

  private handleMessageClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  private dismiss = () => {
    this.props.dismiss();
  };
}

const mapStateToProps = (state: State) => ({
  show: showMessage(state),
  title: messageTitle(state),
  content: messageContent(state),
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  dismiss: () => dispatch(A.dismissMessage()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Message);
