import React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import classNames from 'classnames';
import { State } from '../state-mgmt/state';
import * as A from '../state-mgmt/actions';
import { tapeEntries, focusedTapeCell, CELL_WIDTH, VISIBLE_CELL_COUNT } from '../state-mgmt/Tape';
import { isInEditMode } from '../state-mgmt/Mode';
import { activeTapeCell, isTapeWriting, simInterval } from '../state-mgmt/Sim';
import './Tape.css';

export interface TapeProps {
  entries: string[];
  isEditable: boolean;
  focusedCell: null | number;
  activeCell: number;
  isWriting: boolean;
  simInterval: number;
  changeCell: (pos: number, value: string) => void;
  updateScrollLeft: (scrollLeft: number) => void;
  focusCell: (pos: number) => void;
  clear: () => void;
}

class Tape extends React.Component<TapeProps> {
  private tapeRef: React.RefObject<HTMLDivElement> = React.createRef();

  render() {
    const { isEditable } = this.props;

    const cellClassName = (index: number) => classNames('tape__cell', {
      'tape__cell--editable': isEditable,
      'tape__cell--active': !isEditable && index === this.props.activeCell,
    });

    const leftPaddingWidth = CELL_WIDTH * VISIBLE_CELL_COUNT / 2;

    return (
      <>
        {this.renderReadHead()}
        <div className="tape"
             ref={this.tapeRef}
             onScroll={this.handleScroll}
             style={{ width: `${CELL_WIDTH * VISIBLE_CELL_COUNT}px` }}>
          <div className="tape__cells">
            <div className="tape__padding-left" style={{ width: leftPaddingWidth }}>
            ⇐&ensp;this half intentionally left blank
            </div>
            {this.props.entries.map((l, i) => (
              <input key={i}
                     disabled={!this.props.isEditable}
                     className={cellClassName(i)}
                     value={l}
                     placeholder="∅"
                     onChange={this.handleCellChange(i)}
                     onFocus={this.handleCellFocus(i)}
                     style={{ width: `${CELL_WIDTH}px` }}
                     type="text"
                     maxLength={1} />
            ))}
            <div className="tape__padding-right" style={{ width: `${CELL_WIDTH / 2}px` }} />
          </div>
        </div>
        {this.renderFeeders()}
        {this.renderClearButton()}
        {this.renderReadWriteOverlay()}
      </>
    );
  }

  componentDidMount() {
    if (this.tapeRef.current) {
      this.tapeRef.current.scrollTo(CELL_WIDTH / 2, 0);
    }
  }

  componentDidUpdate(oldProps: TapeProps) {
    if (oldProps.focusedCell !== this.props.focusedCell && this.props.focusedCell !== null) {
      this.updateFocus();
    }
    if (oldProps.activeCell !== this.props.activeCell) {
      this.centerActive(true);
    }
    // If we've just switched into "sim" mode, we need to recenter the tape
    if (oldProps.isEditable !== this.props.isEditable && !this.props.isEditable) {
      this.centerActive(false);
    }
  }

  // After typing a character, we move the focus to the next available cell.
  // This allows a user to use the tape almost like a normal text input.
  private updateFocus() {
    if (this.tapeRef.current) {
      const cellContainer = this.tapeRef.current.childNodes[0];
      const cellToFocus = cellContainer.childNodes[this.props.focusedCell as number + 1];
      if (cellToFocus) (cellToFocus as HTMLInputElement).focus();
    }
  }

  private handleCellChange(pos: number) {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      // We don't allow the user to input spaces, since they appear identical to
      // the empty string and therefore create a lot of confusion.
      if (e.target.value === ' ') return;
      this.props.changeCell(pos, e.target.value);
    };
  }

  private handleCellFocus(pos: number) {
    return () => {
      this.props.focusCell(pos);
    };
  }

  private handleScroll = (e: any) => {
    this.props.updateScrollLeft(e.target.scrollLeft);
  };

  private handleClearButtonClick = () => {
    this.props.clear();
  };

  private centerActive(smooth: boolean) {
    if (this.tapeRef.current) {
      // To center the current read/write cell, we scroll to the left according
      // to the index of the active cell and add half a cell's width to that
      // (this accounts for the buffer on the lefthand side).
      const scrollLeft = this.props.activeCell * CELL_WIDTH + CELL_WIDTH / 2;
      this.tapeRef.current.scrollTo({
        left: scrollLeft,
        top: 0,
        behavior: smooth ? 'smooth' : 'auto',
      });
    }
  }

  // The read head and feeders exist entirely for aesthetic reasons; they are
  // also unfortunately complicated-looking, due to the fact that they must be
  // positioned outside of the tape itself. For these reasons, I've relegated
  // them to these separate definitions.
  private renderReadHead() {
    const className = classNames('tape-reader', {
      'tape-reader--active': !this.props.isEditable,
    });
    return (
      <div className={className}
           style={{
             position: 'absolute',
             left: `calc(50% - ${CELL_WIDTH / 2}px)`,
           }} />
    );
  }

  private renderReadWriteOverlay() {
    const className = classNames('tape-read-write-overlay', {
      'tape-read-write-overlay--writing': this.props.isWriting,
    });
    return (
      <div className={className}
           style={{
             position: 'absolute',
             left: `calc(50% - ${CELL_WIDTH / 2}px)`,
             animationDuration: `${this.props.simInterval / 2}ms`,
           }} />
    );
  }

  private renderClearButton() {
    return (
      <button className="tape__clear-button"
              title="clear tape contents"
              onClick={this.handleClearButtonClick}
              style={{
                position: 'absolute',
                right: `calc(50% - ${CELL_WIDTH * VISIBLE_CELL_COUNT / 2 + 70}px)`,
              }} />
    );
  }

  private renderFeeders() {
    const FEEDER_WIDTH = 12;
    return (
      <>
        <div className="tape-feed tape-feed__left"
             style={{
               position: 'absolute',
               left: `calc(50% - ${CELL_WIDTH * VISIBLE_CELL_COUNT / 2 + FEEDER_WIDTH / 2}px)`,
             }} />
        <div className="tape-feed tape-feed__right"
             style={{
               position: 'absolute',
               right: `calc(50% - ${CELL_WIDTH * VISIBLE_CELL_COUNT / 2 + FEEDER_WIDTH / 2}px)`,
             }} />
      </>
    );
  }
}

const mapStateToProps = (state: State) => ({
  entries: tapeEntries(state),
  isEditable: isInEditMode(state),
  focusedCell: focusedTapeCell(state),
  activeCell: activeTapeCell(state),
  isWriting: isTapeWriting(state),
  simInterval: simInterval(state),
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  changeCell: (pos: number, value: string) => dispatch(A.changeTapeCell(pos, value)),
  updateScrollLeft: (scrollLeft: number) => dispatch(A.updateScrollLeft(scrollLeft)),
  focusCell: (pos: number) => dispatch(A.focusTapeCell(pos)),
  clear: () => dispatch(A.clearTape()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Tape);
