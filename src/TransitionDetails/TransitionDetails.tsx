import React from 'react';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import * as A from '../state-mgmt/actions';
import { State } from '../state-mgmt/state';
import { TransitionDetail as TransitionDetailInfo } from '../state-mgmt/TransitionDetail';
import { arrowById } from '../state-mgmt/Arrow';
import { nodeById } from '../state-mgmt/Node';
import { controlPointForArrow } from '../state-mgmt/ControlPoint';
import Vector from '../tools/Vector';
import TransitionDetail from '../TransitionDetail/TransitionDetail';
import './TransitionDetails.css';

export interface TransitionDetailsProps {
  arrowId: string;
  details: TransitionDetailInfo[];
  start: Vector;
  end: Vector;
  control: Vector;
  isSelfLoop: boolean;
  changeDetail: (detail: TransitionDetailInfo) => void;
  deleteDetail: (id: string, arrow: string) => void;
}

class TransitionDetails extends React.Component<TransitionDetailsProps> {
  render() {
    const { details, control } = this.props;
    const className = classNames(
      'transition-details',
      `transition-details--${this.computeAnchorClassName()}`,
    );

    return (
      <div className={className}
           style={{
             position: 'absolute',
             left: control.x,
             top: control.y,
           }}>
        {details.map(detail => (
          <TransitionDetail key={detail.id}
                            value={detail}
                            onChange={this.handleDetailChange}
                            onDelete={this.handleDetailDelete(detail.id, detail.arrow)} />
        ))}
      </div>
    );
  }

  private handleDetailChange = (detail: TransitionDetailInfo) => {
    this.props.changeDetail(detail);
  };

  private handleDetailDelete(id: string, arrow: string) {
    return () => this.props.deleteDetail(id, arrow);
  }

  // We anchor the TransitionDetails depending on how their associated
  // ControlPoint is situated with respect to the transition's Nodes. This is to
  // keep the details from overlapping with their own associated Arrow.
  private computeAnchorClassName() {
    if (this.props.isSelfLoop) {
      return this.computeSelfLoopAnchor();
    } else {
      return this.computeStandardAnchor();
    }
  }

  private computeSelfLoopAnchor() {
    const { start, control } = this.props;
    const theta = control.minus(start).angle();
    return this.computeClassNameFromAngle(theta);
  }

  private computeStandardAnchor() {
    const { start, end, control } = this.props;
    const v1 = control.minus(start);
    const v2 = v1.project(end.minus(start));
    const angle = v1.minus(v2).angle();
    return this.computeClassNameFromAngle(angle);
  }

  // The only tricky thing here is that the Y-axis is flipped (as is customary).
  // Thus, any intuition about where the top of the box should go needs to be
  // applied to the bottom, and vice-versa.
  private computeClassNameFromAngle(angle: number) {
    // 1st quadrant
    if (0 < angle && angle <= Math.PI / 2) return 'top-left';
    // 2nd quadrant
    else if (Math.PI / 2 < angle && angle <= Math.PI) return 'top-right';
    // 3rd quadrant
    else if (-Math.PI / 2 > angle && angle >= -Math.PI) return 'bottom-right';
    // 4th quadrant
    else return 'bottom-left';
  }
}

const mapStateToProps = (state: State, ownProps: any) => {
  const arrow = arrowById(state, ownProps.arrowId);
  const start = nodeById(state, arrow.start);
  const end = nodeById(state, arrow.end);
  const control = controlPointForArrow(state, arrow.id);
  return {
    start: start.pos,
    end: end.pos,
    control: control.pos,
    isSelfLoop: start.id === end.id,
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
  changeDetail: (detail: TransitionDetailInfo) => dispatch(A.changeTransitionDetail(detail)),
  deleteDetail: (id: string, arrow: string) => dispatch(A.deleteTransitionDetail(id, arrow)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TransitionDetails);
