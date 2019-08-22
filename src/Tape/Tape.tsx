import React from 'react';
import './Tape.css';

export interface TapeProps {}

export const CELL_WIDTH = 36;

class Tape extends React.Component<TapeProps> {
  render() {
    const content = [
      '0', '1', '0', ' ', ' ', '1', '0', '1', ' ', 'a', 'B', '#', ' ', ' ', ' ',
      'A', '.', '-', ' ', ' ', ' ', '*', '*', '#',
    ];
    return (
      <div className="tape" style={{ width: `${CELL_WIDTH * 12}px` }}>
        <div className="tape__cells">
          <div className="tape__padding-left" style={{ width: `${CELL_WIDTH / 2}px` }} />
          {content.map((l, i) => (
            <input key={i}
                   className="tape__cell"
                   style={{ width: `${CELL_WIDTH}px` }}
                   type="text"
                   value={l}
                   maxLength={1} />
          ))}
          <div className="tape__padding-right" style={{ width: `${CELL_WIDTH / 2}px` }} />
        </div>
      </div>
    );
  }
}

export default Tape;
