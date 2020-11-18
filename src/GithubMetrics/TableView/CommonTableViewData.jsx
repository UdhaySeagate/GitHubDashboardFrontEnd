/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable no-param-reassign */
/* eslint-disable no-nested-ternary */
import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { Row, Col } from 'react-bootstrap';
import DateRangePicker from 'react-bootstrap-daterangepicker';
import { Tooltip } from 'reactstrap';
import CommonChartLoader from '../commonLoader/commonChartsLoader';
import ApiServiceCall from '../../serviceCall/apiServiceCall';
import CommonFunction from '../../serviceCall/commonFunction';
import TableViewNoExpand from './TableViewNoExpand';
import CommonChartsNoData from '../commonLoader/commonChartsNoData';
import expor from '../../assets/expor.png';
import settings from '../../assets/settings.png';
import cardIcon from '../../assets/infoicon_cards.png';

/**
 * Following JSX is used to handle in table view process file is included in midleware controller
 */
const CommonTableViewData = ({ dataProcessName,headerName, tableViewProces, selectedFilterData, allRangeDateOrg, apiCall }) => {

  const commonFun = new CommonFunction();

  /** State variable is used to set data */
  const [tableView, SetListData] = useState(tableViewProces);

  /** method is used to reassign data in case of changes */
  useEffect(() => {
    SetListData(tableViewProces);
  }, [tableViewProces]);

  /** Following state variable is used for tooltip */
  const [tooltipOpeninfoTableView, setTooltipInfoTable] = useState(false);

  /** Following state variable is used to handle the tooltip show and hide */
  const infotoggleTableView = () => {
    setTooltipInfoTable(!tooltipOpeninfoTableView);
  };

  const apiServiceCall = new ApiServiceCall();

  const maxEndDate = moment().format('MM/DD/YYYY');

  const fromval = commonFun.changeTimeFormat().subtract(1, 'day').utc().format();

  /** Following method is used to handle the csv download */
  const triggerDownload = (clickHeader) => {
    document.getElementById(clickHeader).click();
  };

  /** Following method is used to handle individual date range changes */
  const handleEvent = (event, picker) => {
    const cpyselectedFilterData = {...selectedFilterData};
    cpyselectedFilterData.from = commonFun.changeTimeFormat(picker.startDate.format('YYYY-MM-DD')).utc().format();
    cpyselectedFilterData.upto = commonFun.changeEndTimeFormat(picker.endDate.format('YYYY-MM-DD')).utc().format();
    callApiTriggerFun(cpyselectedFilterData);
  };

  const callApiTriggerFun = (params) => {
    const reassign =  { showChart: false,tableData:'',totalCount:0,columnName:[],dateFileName:'',showErrorMessage:''};
    SetListData(reassign);
    let paramsPass = '';
    if (apiCall === 'TOTAL_COMMITS' || apiCall === 'TOTAL_ISSUES' || apiCall === 'ISSUE_COMMENTS') {
      paramsPass = {
        ...params,
        since: params.from,
        until: params.upto
      };
      delete paramsPass.from;
      delete paramsPass.upto;
    } else {
      paramsPass = {
        ...params
      };
    }
    responseDataProcess(apiCall, paramsPass);
  };

  const responseDataProcess = (url, params) => {
    const responseProcess = apiServiceCall.callApiServiceMethod(url, params);
    responseProcess.then((data) => {
      if (data.status === 'success' && data.statusCode === '200') {
        let dataPass = '';
        if (url === 'TOTAL_COMMITS' && headerName === 'Commits') {
          dataPass = data.data.commits.tableView;
        } else if (url === 'TOTAL_COMMITS' && headerName === 'Contributing Org') {
          dataPass = data.data.contributionOrg.tableView;
        } else if (url === 'TOTAL_COMMITS' && headerName === 'Total Contributors') {
          dataPass = data.data.contributors.tableView;
        } else {
          dataPass = data.data.tableView;
        }
        const resData = commonFun.processTableData(dataPass, dataProcessName, params);
        SetListData(resData);
      } else {
        const errorDataAssign =  { showChart: true,tableData:'',totalCount:0,columnName:[],dateFileName:'',showErrorMessage:data.data};
        SetListData(errorDataAssign);
      }
    });
  };


  return (
    <div className="averagepr-wrapper boxshadowtable">
      <div>
        <Row className="headerdiv orgmember tableViewmargin">
          <Col sm={4} className="headerlable">
            <div>
              {headerName}
              {'  '}
              {tableView.showChart && (
              <span id="TooltipExampleinfo">
                <span>
                  <img src={cardIcon} alt="Info" />
                  <Tooltip placement="bottom" isOpen={tooltipOpeninfoTableView} target="TooltipExampleinfo" toggle={infotoggleTableView}>
                    <span className="dataShowtooltip">{tableView.dateFileName}</span>
                  </Tooltip>
                </span>
              </span>
              )}
            </div>
          </Col>
          <Col sm={6} className="totalColDiv">
            <div>
              {tableView.showChart && (
                <span>
                  <span className="totalCountLable">Total Count :</span>
                  <span className="commonBlueColortext tableFont">
                    {' '}
                    {tableView.totalCount}
                  </span>
                </span>
              )}
            </div>
          </Col>
          <Col sm={1}>
            {!tableView.showChart ? (
              <span id="">
                <img src={settings} alt="Setting" height="18" />
              </span>
            )
              : (
                <DateRangePicker
                  initialSettings={{
                    minDate: moment(allRangeDateOrg).format('MM/DD/YYYY'),
                    startDate: moment(selectedFilterData.from).format('MM/DD/YYYY'),
                    endDate: moment(selectedFilterData.upto).format('MM/DD/YYYY'),
                    maxDate: maxEndDate,
                    showDropdowns: true,
                    ranges: {
                      Day: [commonFun.changeTimeFormat().subtract(1, 'day'), commonFun.changeEndTimeFormat().subtract(1, 'day')],
                      Week: [moment(fromval).subtract(1, 'week'), commonFun.changeEndTimeFormat().subtract(1, 'day')],
                      Month: [moment(fromval).subtract(1, 'months'), commonFun.changeEndTimeFormat().subtract(1, 'day')]
                    }
                  }}
                  onApply={(event, picker) => handleEvent(event, picker)}
                >
                  <span id="TooltipTableView" className="downloadIcon">
                    <img src={settings} alt="Setting" height="18" />
                  </span>
                </DateRangePicker>
              )}
          </Col>
          <Col sm={1} className="exportImgCol">
            {tableView.showChart ? (
              <span className="downloadIcon" onClick={() => triggerDownload(headerName)}>
                <img src={expor} alt="Export" height="18" />
              </span>
            ) : (
              <span>
                <img src={expor} alt="Exports" height="18" />
              </span>
              )}
          </Col>
        </Row>
        <Row>
          <Col>
            {!tableView.showChart ? (
              <CommonChartLoader tablePadd="tableChartLoaderPad" />
            ) : tableView.showErrorMessage === '' ? (
              <div>
                <div className="">
                  <TableViewNoExpand
                    columns={tableView.columnName}
                    tableData={tableView.tableData}
                    tableName={headerName}
                    formatName={tableView.dateFileName}
                  />
                </div>
              </div>
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

export default CommonTableViewData;