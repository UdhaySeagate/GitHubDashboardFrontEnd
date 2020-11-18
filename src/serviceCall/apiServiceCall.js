import axios from 'axios';
import * as URL from './configURL';
/**
 * Description: Class used to handle the service call to third party api
 * Date: 15-06-2020
 */
const { CancelToken } = axios;
const cancel = [];

class ApiServiceCall {
  /**
   * Method: Following Method is used to handle the cancel api call
   * */
  axiosAPICancel = (stateName) => {
    if (cancel !== undefined) {
      const result = cancel.filter((ele) => ele.stateName === stateName);
      result.forEach((elementData) => {
        elementData.funCallset();
      });
    }
  };

  /**
   * Method: Following Method is used to handle the service based on url
   * */
  callApiServiceMethod = (urlParam, paramData, stateName) => {
    const dataPass = stateName !== '' ? stateName : 'nas';
    const paramCopy = { ...paramData };
    delete paramCopy.filtertype;
    // Make a request for a user with a given ID
    const url = URL[urlParam];
    return (
      axios({
        method: 'get',
        url,
        params: paramCopy,
        // eslint-disable-next-line func-names
        cancelToken: new CancelToken(function executor(c) {
          // An executor function receives a cancel function as a parameter
          cancel.push({ stateName: dataPass, funCallset: c });
        })
      })
        /* eslint func-names: ["error", "never"] */
        .then(function (response) {
          return response.data;
        })
        .catch(function (error) {
          // handle error
          return error;
        })
        .finally(function () {
          // always executed
        })
    );
  };
}
export default ApiServiceCall;
