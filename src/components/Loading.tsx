import * as React from 'react';
import { ScaleLoader } from 'react-spinners';

export default () => (
  <div id="loading-panel">
    <div id="loading-spinner">
      <ScaleLoader
        color={'#0090AD'} 
        loading
        height={50}
        width={4}
        margin="2px"
        radius={2}
      />
    </div>
  </div>
)