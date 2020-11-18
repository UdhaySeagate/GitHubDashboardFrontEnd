import React from 'react';
import chartloader from '../../assets/no-data-found-icon.png';

const commonChartsNoData = ({ tablePadd }) => {
  return (
    <div className={`chartLoder ${tablePadd}`}>
      <div>
        <img src={chartloader} alt="No Data" width="300" height="302" />
      </div>
    </div>
  );
};
export default commonChartsNoData;
