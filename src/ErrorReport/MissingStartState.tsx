import React from 'react';
import ErrorReport from './ErrorReport';

const problem = 'In order for the machine to start, a state must be '
              + 'distinguished as the initial or start state. You have '
              + 'not yet identified any state as such.';

const fix = 'Select one of your machine states and click the "Make Start State" ' +
            'button to distinguish it as the initial state.';

export default (
  <ErrorReport whatsWrong={problem} howToFix={fix} />
);
