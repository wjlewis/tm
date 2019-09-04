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
  isFocused: boolean;
  isEditable: boolean;
  isActive: boolean;
  onFocus?: () => void;
  onBlur?: () => void;
  onChange?: (value: TransitionDetailInfo) => void;
  onDelete?: () => void;
}

class TransitionDetail extends React.Component<TransitionDetailProps> {
  private readRef: React.RefObject<HTMLInputElement> = React.createRef();

  render() {
    const { read, write, move } = this.props.detail;

    const className = classNames('transition-detail', {
      'transition-detail--active': this.props.isActive,
    });

    const inputClassName = classNames('transition-detail__input', {
      'transition-detail__input--focus': this.props.isFocused,
      'transition-detail__input--editable': this.props.isEditable,
    });

    // We create a special className for the read input in order to distinguish
    // inputs in an "error" state.
    const readInputClassName = classNames(inputClassName, {
      'transition-detail__input--error': this.props.detail.isDuplicate,
    })

    const selectorClassName = classNames('transition-detail__selector', {
      'transition-detail__selector--focus': this.props.isFocused,
      'transition-detail__selector--editable': this.props.isEditable,
    });

    return (
      <div className={className}>
        <input className={readInputClassName}
               ref={this.readRef}
               disabled={!this.props.isEditable}
               value={read}
               onChange={this.handleInputChange('read')}
               onFocus={this.handleFocus}
               onBlur={this.handleBlur}
               type="text"
               maxLength={1} />
        <span className="transition-detail__separator">&#47;</span>
        <input className={inputClassName}
               disabled={!this.props.isEditable}
               value={write}
               onChange={this.handleInputChange('write')}
               onFocus={this.handleFocus}
               onBlur={this.handleBlur}
               type="text"
               maxLength={1} />
        <span className="transition-detail__separator">,</span>
        <select className={selectorClassName}
                disabled={!this.props.isEditable}
                value={move}
                onChange={this.handleSelectChange}>
          <option value="L">←</option>
          <option value="R">→</option>
        </select>
        {this.props.isEditable &&
          <button className="transition-detail__button"
                  onClick={this.handleDeleteClick}>
          </button>
        }
      </div>
    );
  }

  // In the meantime, whenever a transition detail is created, it is immediately
  // focused. This (slight) hack ensures that the browser focus remains
  // synchronized.
  componentDidMount() {
    if (this.props.isFocused) this.focus();
  }

  private focus() {
    if (this.readRef.current) this.readRef.current.focus();
  }

  private handleInputChange(property: 'read' | 'write') {
    return (evt: React.ChangeEvent<HTMLInputElement>) => {
      if (!this.props.onChange) return;
      this.props.onChange({
        ...this.props.detail,
        [property]: evt.target.value,
      });
    };
  }

  private handleSelectChange = (evt: React.ChangeEvent<HTMLSelectElement>) => {
    if (!this.props.onChange) return;
    this.props.onChange({
      ...this.props.detail,
      move: evt.target.value as 'L' | 'R',
    });
  };

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
