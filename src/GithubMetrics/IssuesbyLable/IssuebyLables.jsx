/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable no-nested-ternary */
import React from 'react';
import { Row, Col } from 'react-bootstrap';
import './IssuebyLable.css';
import { CSVLink } from "react-csv";
import CommonChartLoader from '../commonLoader/commonChartsLoader';
import CommonChartsNoData from '../commonLoader/commonChartsNoData';
import TableData from '../TableView/TableViewWithExpand';
import expor from '../../assets/expor.png';

/**
 * Following JSX to handle issue by lable metric data 
 */
const IssueLables = ({ issueLable }) => {

  /** Header for export option  */
  const headerscsv = [
    { label: "Repository", key: "repoName" },
    { label: "Label", key: "lable" },
    { label: "Count", key: "count" }
  ];

  return (
    <div className="averagepr-wrapper">
      <div>
        <Row className="headerdiv orgmember tableViewmargin">
          <Col className="headerlable">
            <div>Issue By Label</div>
          </Col>
          <Col className="totalColDiv">
            <div>
              <span className="totalCountLable">Total Count :</span>
              <span className="commonBlueColortext"> 
                {' '}
                {issueLable.count}
              </span>
            </div>
          </Col>
          <Col sm={1}>
            {issueLable.apiCallStatus ? (
              // eslint-disable-next-line jsx-a11y/click-events-have-key-events
              <CSVLink data={issueLable.tableView.exportTableData} headers={headerscsv} filename={`Issue By Label(${issueLable.tableView.dateFileName}).csv`}>
                <span className="downloadIcon">
                  <img src={expor} alt="Info" />
                </span>
              </CSVLink>
            ) : (
              <span>
                <img src={expor} alt="Info" />
              </span>
            )}
          </Col>
        </Row>
        <Row>
          <Col>
            {!issueLable.apiCallStatus ? (
              <CommonChartLoader tablePadd="tableChartLoaderPad" />
            ) : issueLable.showErrorMessage === '' ? (
              <div>
                <div className="">
                  <TableData
                    nonExpandRow={issueLable.tableView.nonExpandRow}
                    columns={issueLable.tableView.columnName}
                    tableData={issueLable.tableView.tableData}
                    innerTableColumn={issueLable.tableView.innerTableColumn}
                    tableName="ISSUEBYLABLE"
                    formatName={issueLable.tableView.dateFileName}
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
};
export default IssueLables;
