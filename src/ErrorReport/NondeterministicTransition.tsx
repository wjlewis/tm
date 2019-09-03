import React from 'react';
import ErrorReport from './ErrorReport';

const problem = 'At the moment, you have 2 or more transitions from the same '
              + 'state with the same read symbol. Such nondeterministic behavior '
              + 'is not supported.';

const fix = 'Find all transitions whose read symbols are marked red, and modify '
          + 'or remove the associated transitions so that all transitions for each '
          + 'state have distinct read symbols';

export default (
  <ErrorReport whatsWrong={problem} howToFix={fix} />
);
