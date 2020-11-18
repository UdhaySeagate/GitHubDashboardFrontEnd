import React from 'react';
// import { Line } from 'rc-progress';
import Loader from 'react-loader-spinner';
import chartloader from '../../assets/Chart-Loading.png';

const CommonChartLoader = ({ tablePadd }) => {
  return (
    <div className={`chartLoder ${tablePadd}`}>
      <div>
        <img src={chartloader} alt="Loading Please wait" width="300" height="195" />
      </div>

      <div className="progressBar">
        {/* <Line percent="70" strokeWidth="2" strokeColor="#2F80ED" /> */}
        <Loader type="ThreeDots" color="#00BFFF" height={23} width={50} />
        <span className="plstext">Please Wait ...</span>
        <br />
      </div>
    </div>
  );
};
export default CommonChartLoader;
