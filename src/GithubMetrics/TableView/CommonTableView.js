/* eslint-disable react/no-unused-state */
/* eslint-disable func-names */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable no-param-reassign */
/* eslint-disable no-nested-ternary */
import React, { Component } from 'react';
import moment from 'moment';
import { Row, Col } from 'react-bootstrap';
import DateRangePicker from 'react-bootstrap-daterangepicker';
import { Tooltip } from 'reactstrap';
import CommonChartLoader from '../commonLoader/commonChartsLoader';
import cardIcon from '../../assets/infoicon_container.png';
import CommonFunction from '../../serviceCall/commonFunction';
import TableViewNoExpand from './TableViewNoExpand';
import CommonChartsNoData from '../commonLoader/commonChartsNoData';
import expor from '../../assets/expor.png';
import settings from '../../assets/settings.png';

/**
 * Following class is used to handle the table view
 */
class CommonTableView extends Component {
  constructor() {
    super();
    this.state = {
      tableViewProces:'',
      callFlag:false,
      maxEndDate: moment().format('MM/DD/YYYY'),
      tooltipOpeninfoTableView: false
    };
    this.commonFunc = new CommonFunction();
  }

  infotoggleTableView = () => {
    const { tooltipOpeninfoTableView } = this.state;
    this.setState({ tooltipOpeninfoTableView: !tooltipOpeninfoTableView });
  };

  /** Following method is used to handle date range selection individually */
  handleEvent = (event, picker) => {
    this.setState({ showChart: false });
    const selectedFilterData = { ...this.props.selectedFilterData };
    selectedFilterData.from = this.commonFunc.changeTimeFormat(picker.startDate.format('YYYY-MM-DD')).utc().format();
    selectedFilterData.upto = this.commonFunc.changeEndTimeFormat(picker.endDate.format('YYYY-MM-DD')).utc().format();
    this.props.callApiTriggerFunction(selectedFilterData,this.props.apiCall,this.props.dataProcessName,this.props.headerName);
  };

  /** Following method is used to handle the download as csv */
  triggerDownload = (clickHeader) => {
    document.getElementById(clickHeader).click();
  };

  /** Following method is get tool tip value for selected date range */
  getDataFileFormat = (processName) =>{
    return this.props.tableViewProces[processName];
  }

  render() {
    const stateVal = this.state;
    const propsData = this.props;
    const fromval = this.commonFunc.changeTimeFormat().subtract(1, 'day').utc().format();
    return (
      <div className="averagepr-wrapper boxshadowtable">
        <div>
          <Row className="headerdiv orgmember tableViewmargin">
            <Col sm={4} className="headerlable">
              <div>
                {propsData.headerName}
                {' '}
                <span id={propsData.dataProcessName} className="tableinfoicon">
                  {propsData.tableViewProces.showChart && (
                  <span>
                    <img src={cardIcon} alt="Info" />
                    <Tooltip placement="bottom" isOpen={stateVal.tooltipOpeninfoTableView} target={propsData.dataProcessName} toggle={this.infotoggleTableView}>
                      <span className="dataShowtooltip">{this.getDataFileFormat(propsData.dataProcessName)}</span>
                    </Tooltip>
                  </span>
                  )} 
                </span>
              </div>
            </Col>
            <Col sm={6} className="totalColDiv">
              <div>
                {propsData.tableViewProces.showChart && (
                <span>
                  <span className="totalCountLable">Total Count :</span>
                  <span className="commonBlueColortext tableFont">
                    {' '}
                    {propsData.tableViewProces.totalCount}
                  </span>
                </span>
              )}
              </div>
            </Col>
            
            <Col sm={1}>
              {propsData.tableViewProces.showDateRange && (
              <DateRangePicker
                initialSettings={{
                  minDate: moment(propsData.allRangeDateOrg).format('MM/DD/YYYY'),
                  startDate: moment(propsData.selectedFilterData.from).format('MM/DD/YYYY'),
                  endDate: moment(propsData.selectedFilterData.upto).format('MM/DD/YYYY'),
                  maxDate: stateVal.maxEndDate,
                  showDropdowns: true,
                  ranges: {
                    Day: [this.commonFunc.changeTimeFormat().subtract(1, 'day'), this.commonFunc.changeEndTimeFormat().subtract(1, 'day')],
                    Week: [moment(fromval).subtract(1, 'week'), this.commonFunc.changeEndTimeFormat().subtract(1, 'day')],
                    Month: [moment(fromval).subtract(1, 'months'), this.commonFunc.changeEndTimeFormat().subtract(1, 'day')],
                    Year: [moment(fromval).subtract(1, 'year'), this.commonFunc.changeEndTimeFormat().subtract(1, 'day')],
                    All: [this.commonFunc.changeTimeFormat(propsData.allRangeDateOrg), this.commonFunc.changeEndTimeFormat().subtract(1, 'day')]
                  }
                }}
                onApply={(event, picker) => this.handleEvent(event, picker)}
              >
                <span className="downloadIcon">
                  <img src={settings} alt="Setting" height="18" />
                </span>
              </DateRangePicker>
            )}
            </Col>
            <Col sm={1} className="exportImgCol">
              {propsData.tableViewProces.showChart ? (
                <span className="downloadIcon" onClick={() => this.triggerDownload(propsData.headerName)}>
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
              {!propsData.tableViewProces.showChart ? (
                <CommonChartLoader tablePadd="tableChartLoaderPad" />
              ) : propsData.tableViewProces.showErrorMessage === '' ? (
                <div>
                  <div className="">
                    <TableViewNoExpand
                      columns={propsData.tableViewProces.columnName}
                      tableData={propsData.tableViewProces.tableData}
                      tableName={propsData.headerName}
                      formatName={propsData.tableViewProces.dateFileName}
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
}

export default CommonTableView;
