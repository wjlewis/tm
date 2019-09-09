import React from 'react';
import ErrorReport from './ErrorReport';
import step0 from './fix-start-0.png';
import step1 from './fix-start-1.png';
import './ErrorReport.css';

const problem = 'In order for the machine to start, a state must be '
              + 'distinguished as the initial or start state. You have '
              + 'not yet identified any state as such.';

const fix = (
  <ol>
    <li>
      Select one of your machine states
    </li>
    <img src={step0} alt="a selected state" />
    <li>
      Click the indicated button to distinguish the selected state as the machine's start state
    </li>
    <img src={step1} alt="the button for distinguishing a state as the initial state" />
  </ol>
);

export default (
  <ErrorReport whatsWrong={problem} howToFix={fix} />
);
