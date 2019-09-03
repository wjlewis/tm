import { State } from './state';

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
