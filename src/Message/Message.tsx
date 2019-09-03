import React from 'react';
import { connect } from 'react-redux';
import { State } from '../state-mgmt/state';
import { showMessage, messageTitle, messageContent } from '../state-mgmt/Message';
import './Message.css';

export interface MessageProps {
  show: boolean;
  title: null | string;
  content: null | string | JSX.Element;
}

class Message extends React.Component<MessageProps> {
  render() {
    return this.props.show && (
      <div className="message__container">
        <div className="message">
          <h1 className="message__title">{this.props.title}</h1>
          <div className="message__content">{this.props.content}</div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: State) => ({
  show: showMessage(state),
  title: messageTitle(state),
  content: messageContent(state),
});

export default connect(
  mapStateToProps,
)(Message);
