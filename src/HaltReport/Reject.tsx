import React from 'react';
import HaltReport from './HaltReport';

export default (initTapeEntries: string[], finalTapeEntries: string[]) => (
  <HaltReport accepted={false}
              initTapeEntries={initTapeEntries}
              finalTapeEntries={finalTapeEntries} />
);
