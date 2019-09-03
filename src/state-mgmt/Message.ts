import { State } from './state';
import { Action } from './actions';
import * as A from './actions';

export interface MessageState {
  show: boolean;
  title: null | string;
  content: null | string | JSX.Element;
}

export const initMessageState: MessageState = {
  show: false,
  title: null,
  content: null,
};

export const showMessage = (state: State): boolean => state.message.show;

export const messageTitle = (state: State): null | string => state.message.title;

export const messageContent = (state: State): null | string | JSX.Element => state.message.content;

export const messageReducer = (state: State, action: Action): MessageState => {
  switch (action.type) {
    case A.DISPLAY_MESSAGE:
      return displayMessage(state, action.payload.title, action.payload.content);
    case A.DISMISS_MESSAGE:
      return dismissMessage(state);
    default:
      return state.message;
  }
};

const displayMessage = (state: State, title: string, content?: string | JSX.Element): MessageState => ({
  ...state.message,
  show: true,
  title,
  content: content !== undefined ? content : null,
});

const dismissMessage = (state: State): MessageState => ({
  ...state.message,
  show: false,
  title: null,
  content: null,
});
