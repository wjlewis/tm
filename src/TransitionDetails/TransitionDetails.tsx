import React from 'react';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import * as A from '../state-mgmt/actions';
import { State } from '../state-mgmt/state';
import { TransitionDetail as TransitionDetailInfo, focusedDetail } from '../state-mgmt/TransitionDetail';
import { arrowById } from '../state-mgmt/Arrow';
import { nodeById } from '../state-mgmt/Node';
import { controlPointForArrow } from '../state-mgmt/ControlPoint';
import Vector from '../tools/Vector';
import TransitionDetail from '../TransitionDetail/TransitionDetail';
import './TransitionDetails.css';

// A single arrow between nodes can represent any number of transitions. In
// order to display transitions in a compact manner, we group all transition
// details for a certain arrow together in a "Transition Details" component. The
// details (read/write/move) for each transition are rendered one on top of the
// other, along with a button for adding new transitions. The main difficulty
// here is in displaying the details in an aesthetically pleasing way: we want
// them not to overlap with their associated arrow. To accomplish this, we
// compute a "stance" for the details based on the orientation and curve of
// their associated arrow -- either top-left, top-right, bottom-left, or
// bottom-right. We then transform the details via CSS accordingly.

export interface TransitionDetailsProps {
  arrowId: string;
  details: TransitionDetailInfo[];
  start: Vector;
  end: Vector;
  control: Vector;
  isSelfLoop: boolean;
  focusedDetail: null | string;
  changeDetail: (detail: TransitionDetailInfo) => void;
  deleteDetail: (id: string, arrow: string) => void;
  addDetail: (arrow: string) => void;
  focusDetail: (id: string) => void;
  blurDetail: (id: string) => void;
}

class TransitionDetails extends React.Component<TransitionDetailsProps> {
  render() {
    const { details, control } = this.props;
    const stance = this.computeStance();
    const className = classNames(
      'transition-details',
      `transition-details--${stance}`,
    );

    return (
      <div className={className}
           style={{
             // We initially anchor the component at its arrow's control point,
             // and then use CSS transforms to move it according to its computed
             // stance.
             position: 'absolute',
             left: control.x,
             top: control.y,
           }}>
        {!this.isTopStance(stance) && this.renderAddDetailButton()}
        {details.map(detail => (
          <TransitionDetail key={detail.id}
                            detail={detail}
                            isFocused={this.props.focusedDetail === detail.id}
                            onChange={this.handleDetailChange}
                            onDelete={this.handleDetailDelete(detail.id, detail.arrow)}
                            onFocus={this.handleDetailFocus(detail.id)}
                            onBlur={this.handleDetailBlur(detail.id)} />
        ))}
        {this.isTopStance(stance) && this.renderAddDetailButton()}
      </div>
    );
  }

  private handleDetailChange = (detail: TransitionDetailInfo) => {
    this.props.changeDetail(detail);
  };

  private handleDetailDelete(id: string, arrow: string) {
    return () => this.props.deleteDetail(id, arrow);
  }

  private handleDetailFocus(id: string) {
    return () => this.props.focusDetail(id);
  }

  private handleDetailBlur(id: string) {
    return () => this.props.blurDetail(id);
  }

  private handleAddDetailButton(arrow: string) {
    return () => this.props.addDetail(arrow);
  };

  // As is often the case here, there are two possibilities to consider: (1) the
  // details are associated with a self-loop, or (2) with a standard arrow.
  private computeStance() {
    if (this.props.isSelfLoop) {
      return this.computeSelfLoopStance();
    } else {
      return this.computeStandardStance();
    }
  }

  // In the self-loop case, we simply use the angle between the associated node
  // and the control point.
  private computeSelfLoopStance() {
    const { start, control } = this.props;
    const theta = control.minus(start).angle();
    return this.computeClassNameFromAngle(theta);
  }

  // In the case of the standard stance, we use the angle of the line segment
  // that passes through the control point perpendicular to the line joining the
  // two nodes associated with the arrow in question. This seems to work quite
  // well in keeping the details away from their associated arrow.
  private computeStandardStance() {
    const { start, end, control } = this.props;
    const v1 = control.minus(start);
    const v2 = v1.project(end.minus(start));
    const angle = v1.minus(v2).angle();
    return this.computeClassNameFromAngle(angle);
  }

  // Here we compute a stance from a given angle. The only tricky thing here is
  // that the Y-axis is flipped (as is customary). Thus, any intuition about
  // where the top of the box should go needs to be applied to the bottom, and
  // vice-versa.
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

  // In order to keep the details as close to their associated control point as
  // possible, we render the "add new" button away from the control point: if
  // the computed stance puts the details on top of the control point, we place
  // the button on top of the details, and vice versa (see the "render" method).
  private isTopStance(anchor: string) {
    return /^top/.test(anchor);
  }

  private renderAddDetailButton() {
    return (
      <button className="transition-details__add-button"
              onClick={this.handleAddDetailButton(this.props.arrowId)}>
        add new
      </button>
    );
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
    focusedDetail: focusedDetail(state),
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
  changeDetail: (detail: TransitionDetailInfo) => dispatch(A.changeTransitionDetail(detail)),
  deleteDetail: (id: string, arrow: string) => dispatch(A.deleteTransitionDetail(id, arrow)),
  addDetail: (arrow: string) => dispatch(A.addTransitionDetail(arrow)),
  focusDetail: (id: string) => dispatch(A.focusTransitionDetail(id)),
  blurDetail: (id: string) => dispatch(A.blurTransitionDetail(id)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TransitionDetails);
