import React from 'react';
import classNames from 'classnames';
import { TransitionDetail as TransitionDetailInfo } from '../state-mgmt/TransitionDetail';
import './TransitionDetail.css';

// Each transition consists of a pair of (not necessarily distinct) states, and
// 3 pieces of information detailing (1) what tape symbol must be read in order
// to take the transition, (2) what tape symbol will be written if the
// transition is taken, and (3) in which direction the tape head should move. A
// transition detail represents these three pieces of information; together with
// an arrow it represents a full transition.

export interface TransitionDetailProps {
  detail: TransitionDetailInfo;
  onFocus?: () => void;
  onBlur?: () => void;
  onChange?: (value: TransitionDetailInfo) => void;
  onDelete?: () => void;
}

class TransitionDetail extends React.Component<TransitionDetailProps> {
  render() {
    const { read, write, move, isFocused } = this.props.detail;

    const inputClassName = classNames('transition-detail__input', {
      'transition-detail__input--focus': isFocused,
    });

    return (
      <div className="transition-detail">
        <input className={inputClassName}
               value={read}
               onChange={this.handleChange('read')}
               onFocus={this.handleFocus}
               onBlur={this.handleBlur}
               type="text"
               maxLength={1} />
        <span className="transition-detail__separator">&#47;</span>
        <input className={inputClassName}
               value={write}
               onChange={this.handleChange('write')}
               onFocus={this.handleFocus}
               onBlur={this.handleBlur}
               type="text"
               maxLength={1} />
        <span className="transition-detail__separator">,</span>
        <input className={inputClassName}
               value={move}
               onChange={this.handleChange('move')}
               onFocus={this.handleFocus}
               onBlur={this.handleBlur}
               type="text"
               maxLength={1} />
        <button className="transition-detail__button"
                onClick={this.handleDeleteClick}>
        </button>
      </div>
    );
  }

  private handleChange(property: 'read' | 'write' | 'move') {
    return (evt: React.ChangeEvent<HTMLInputElement>) => {
      if (!this.props.onChange) return;
      this.props.onChange({
        ...this.props.detail,
        [property]: evt.target.value,
      });
    };
  }

  private handleFocus = () => {
    if (this.props.onFocus) this.props.onFocus();
  };

  private handleBlur = () => {
    if (this.props.onBlur) this.props.onBlur();
  };

  private handleDeleteClick = () => {
    if (this.props.onDelete) this.props.onDelete();
  };
}

export default TransitionDetail;
