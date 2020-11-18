/* eslint-disable react/no-did-update-set-state */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable no-param-reassign */
/* eslint-disable no-nested-ternary */
import React, { useState, useEffect } from 'react';
import './AverageIssueAge.css';
import { Row, Col, DropdownButton, Dropdown } from 'react-bootstrap';
import CommonChartLoader from '../commonLoader/commonChartsLoader';
import CommonFunction from '../../serviceCall/commonFunction';
import AverageIssueAge from './AverageChartIssue';
import CommonChartsNoData from '../commonLoader/commonChartsNoData';

/**
 * Following jsx method is used to handle average issue chart
 *  chartData -- is the data to be viewed
 * typeview--- view by month/Day/Week
 */

const AverageIssueChart = ({ chartData, typeView ,dateFileName}) => {

  const commonObj = new CommonFunction();

  /** following variable is used for to set view type */
  const viewType = ['Month', 'Week', 'Day'];

  /** following state variable used for viewtype selected maintain */
  const [viewTypeSelected, setViewTypedata] = useState(typeView);

  /** React method */
  useEffect(() => {
    if (chartData.chartValues.typeYear) {
      setViewTypedata(chartData.chartValues.typeYear);
    }
  }, [chartData.chartValues.typeYear]);

  /** following method is used to handle view type selected
   * id - is the value selected 
   */
  const setViewType = (id) => {
    setViewTypedata(id);
    const chartDatProcess = commonObj.processPRandIssues(chartData.responseFullData, id);
    if (chartDatProcess) {
      chartData.apiCallStatus = chartDatProcess.apiCallStatus;
      chartData.totalCount = chartDatProcess.totalCount;
      chartData.showErrorMessage = chartDatProcess.showErrorMessage;
      chartData.chartValues = chartDatProcess.chartValues;
    }
  }

  return (
    <div className="averagepr-wrapper">
      <div>
        <Row className="headerdiv">
          <Col sm={4} className="headerlable headerCharttop">
            <div>Issue Closed (Average)</div>
          </Col>
          <Col sm={4}>
            <div className="averCountDiv daterangepr">
              <span className="totalCountLable">Total Counts : </span>
              <span className="commonBlueColortext">
                {'  '}
                {chartData.totalCount}
              </span>
              <span />
            </div>
          </Col>
          <Col sm={4} className="daterangepr">
            <div>
              <div className="averCountDiv viewData">
                <span className="totaHeade viewData">View as : </span>
              </div>
              {!chartData.apiCallStatus ? (
                <DropdownButton disabled id="dropdown-basic-button" title={viewTypeSelected} />
              ) : (
                <DropdownButton id="dropdown-basic-button" title={viewTypeSelected} onSelect={(evt) => setViewType(evt)}>
                  {viewType.map((id) =>
                      viewTypeSelected === id ? (
                        <Dropdown.Item active eventKey={id} key={id}>
                          {id}
                        </Dropdown.Item>
                      ) : (
                        <Dropdown.Item eventKey={id} key={id}>
                          {id}
                        </Dropdown.Item>
                        )
                    )}
                </DropdownButton>
                )}
            </div>
          </Col>
        </Row>
        <Row className="chartdiv">
          <Col className="chartdata">
            {!chartData.apiCallStatus ? (
              <CommonChartLoader />
            ) : chartData.showErrorMessage === '' ? (
              <AverageIssueAge dataPass={chartData.chartValues} dateFileName={dateFileName} />
            ) : (
              <div className="">
                <CommonChartsNoData />
              </div>
                )}
          </Col>
        </Row>
      </div>
    </div>
  );
}

export default AverageIssueChart;