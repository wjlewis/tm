import _ from 'lodash';
import { Middleware } from 'redux';
import * as A from '../actions';
import { transitionDetailsForArrow } from '../TransitionDetail';
import { controlPointForArrow } from '../ControlPoint';
import { selectedNodes } from '../Node';
import { arrowsForNode } from '../Arrow';

// When we delete a node, we need to remove anything that was "attached" to it:
// any arrows, and control points and transition details associated with them.
export const deleteNode: Middleware = api => next => action => {
  if (action.type !== A.DELETE_SELECTED_NODES) return next(action);

  const state = api.getState();
  const nodeIds = selectedNodes(state);
  const arrows = _.flatten(nodeIds.map(id => arrowsForNode(state, id)));
  const arrowIds = _.uniq(_.flatten(arrows.map(({ id }) => id)));
  const controlPointIds = arrowIds.map(id => controlPointForArrow(state, id)).map(({ id }) => id);
  const transitionDetails = _.flatten(arrowIds.map(id => transitionDetailsForArrow(state, id)));
  const transitionDetailIds = transitionDetails.map(({ id }) => id);

  return next(A.deleteEntities(nodeIds, arrowIds, controlPointIds, transitionDetailIds));
};
