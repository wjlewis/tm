import React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import classNames from 'classnames';
import { State } from '../state-mgmt/state';
import * as A from '../state-mgmt/actions';
import { tapeEntries, CELL_WIDTH, VISIBLE_CELL_COUNT } from '../state-mgmt/Tape';
import { isInEditMode } from '../state-mgmt/Mode';
import './Tape.css';

export interface TapeProps {
  entries: string[];
  isEditable: boolean;
  changeCell: (pos: number, value: string) => void;
  updateScrollLeft: (scrollLeft: number) => void;
}

class Tape extends React.Component<TapeProps> {
  private tapeRef: React.RefObject<HTMLDivElement> = React.createRef();

  render() {
    const { isEditable } = this.props;

    const cellClassName = classNames('tape__cell', {
      'tape__cell--editable': isEditable,
    });

    const leftPaddingWidth = CELL_WIDTH * VISIBLE_CELL_COUNT / 2 + CELL_WIDTH / 2;

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
                     className={cellClassName}
                     value={l}
                     onChange={this.handleCellChange(i)}
                     style={{ width: `${CELL_WIDTH}px` }}
                     type="text"
                     maxLength={1} />
            ))}
            <div className="tape__padding-right" style={{ width: `${CELL_WIDTH / 2}px` }} />
          </div>
        </div>
        {this.renderFeeders()}
      </>
    );
  }

  componentDidMount() {
    if (this.tapeRef.current) {
      this.tapeRef.current.scrollTo(CELL_WIDTH / 2, 0);
    }
  }

  private handleCellChange(pos: number) {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      this.props.changeCell(pos, e.target.value);
    };
  }

  private handleScroll = (e: any) => {
    this.props.updateScrollLeft(e.target.scrollLeft);
  };

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
               left: `calc(50% + ${CELL_WIDTH * VISIBLE_CELL_COUNT / 2 - FEEDER_WIDTH / 2}px)`,
             }} />
      </>
    );
  }
}

const mapStateToProps = (state: State) => ({
  entries: tapeEntries(state),
  isEditable: isInEditMode(state),
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  changeCell: (pos: number, value: string) => dispatch(A.changeTapeCell(pos, value)),
  updateScrollLeft: (scrollLeft: number) => dispatch(A.updateScrollLeft(scrollLeft)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Tape);
