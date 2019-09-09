import React from 'react';
import ErrorReport from './ErrorReport';
import nondet0 from './nondet-0.png';
import nondet1 from './nondet-1.png';
import './ErrorReport.css';

const problem = 'At the moment, you have 2 or more transitions from the same '
              + 'state with the same read symbol. Such nondeterministic behavior '
              + 'is not supported.';

const fix = (
  <div>
    <span>
      For each transition whose read symbol is marked red
    </span>
    <img src={nondet0} alt="a nondeterministic transition" />
    <span>
      Modify or remove the associated transitions so that all transitions for each
      state have distinct read symbols
    </span>
    <img src={nondet1} alt="the nondeterminism resolved" />
  </div>
);

export default (
  <ErrorReport whatsWrong={problem} howToFix={fix} />
);
