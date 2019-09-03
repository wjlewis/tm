import React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import classNames from 'classnames';
import { State } from '../state-mgmt/state';
import * as A from '../state-mgmt/actions';
import { tapeEntries, tapeCenter } from '../state-mgmt/Tape';
import { isInEditMode } from '../state-mgmt/Mode';
import './Tape.css';

export interface TapeProps {
  entries: string[];
  center: number;
  isEditable: boolean;
  setCenter: (pos: number) => void;
  changeCell: (pos: number, value: string) => void;
}

export const CELL_WIDTH = 36;
export const CELL_COUNT = 16;

class Tape extends React.Component<TapeProps> {
  private tapeRef: React.RefObject<HTMLDivElement> = React.createRef();

  render() {
    const cellClassName = classNames('tape__cell', {
      'tape__cell--editable': this.props.isEditable,
    });

    return (
      <div className="tape"
           ref={this.tapeRef}
           style={{ width: `${CELL_WIDTH * CELL_COUNT}px` }}>
        <div className="tape__cells">
          <div className="tape__padding-left" style={{ width: `${CELL_WIDTH / 2}px` }} />
          {this.props.entries.map((l, i) => (
            <input key={i}
                   disabled={!this.props.isEditable}
                   className={cellClassName}
                   onFocus={this.handleCellFocus(i)}
                   value={l}
                   onChange={this.handleCellChange(i)}
                   style={{ width: `${CELL_WIDTH}px` }}
                   type="text"
                   maxLength={1} />
          ))}
          <div className="tape__padding-right" style={{ width: `${CELL_WIDTH / 2}px` }} />
        </div>
      </div>
    );
  }

  componentDidMount() {
    this.recenter(false);
  }

  componentDidUpdate(oldProps: TapeProps) {
    if (this.props.center !== oldProps.center) this.recenter();
  }

  private handleCellFocus(index: number) {
    return () => this.props.setCenter(index);
  }

  private handleCellChange(pos: number) {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      this.props.changeCell(pos, e.target.value);
    };
  }

  // Whenever the "center" of the tape changes, we scroll the (HTML) tape to
  // place the new center cell in the center of the (HTML) tape.
  private recenter(smooth: boolean=true) {
    const cellGap = CELL_WIDTH * (this.props.center + 1 - CELL_COUNT / 2);
    if (this.tapeRef.current) {
      this.tapeRef.current.scrollTo({
        left: cellGap,
        top: 0,
        behavior: smooth ? 'smooth' : undefined,
      });
    }
  }
}

const mapStateToProps = (state: State) => ({
  entries: tapeEntries(state),
  center: tapeCenter(state),
  isEditable: isInEditMode(state),
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  setCenter: (pos: number) => dispatch(A.setTapeCenter(pos)),
  changeCell: (pos: number, value: string) => dispatch(A.changeTapeCell(pos, value)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Tape);
