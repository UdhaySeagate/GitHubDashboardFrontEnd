/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable no-nested-ternary */
import React from 'react';
import './OrganizationMembers.css';
import { Row, Col } from 'react-bootstrap';
import { CSVLink } from "react-csv";
import CommonChartLoader from '../commonLoader/commonChartsLoader';
import CommonChartsNoData from '../commonLoader/commonChartsNoData';
import TableData from '../TableView/TableViewWithExpand';
import expor from '../../assets/expor.png';

/**
 * Following JSX method is used to handle external contriubtor table
 */
const ExternalContributor = ({ externalContributor }) => {

  /** varaible contain export csv header value */
  const headerscsv = [
    { label: "Repository", key: "repoName" },
    { label: "Contributors", key: "contributors" },
    { label: "Contributions", key: "count" }
  ];

  return (
    <div className="averagepr-wrapper">
      <div>
        <Row className="headerdiv orgmember tableViewmargin">
          <Col className="headerlable">
            <div>External Contributors</div>
          </Col>
          <Col className="totalColDiv">
            <div>
              <span className="totalCountLable">Total Count :</span>
              <span className="commonBlueColortext"> 
                {' '}
                {externalContributor.count}
              </span>
            </div>
          </Col>
          <Col sm={1}>
            {externalContributor.apiCallStatus ? (
              // eslint-disable-next-line jsx-a11y/click-events-have-key-events
              <CSVLink data={externalContributor.tableView.exportTableData} headers={headerscsv} filename={`External Contributors(${externalContributor.tableView.dateFileName}).csv`}>
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
            {!externalContributor.apiCallStatus ? (
              <CommonChartLoader tablePadd="tableChartLoaderPad" />
            ) : externalContributor.showErrorMessage === '' ? (
              <div>
                <div className="">
                  <TableData
                    innerTableColumn={externalContributor.tableView.innerTableColumn}
                    tableName="ORGMEM"
                    columns={externalContributor.tableView.columnName}
                    tableData={externalContributor.tableView.tableData}
                    nonExpandRow={externalContributor.tableView.nonExpandRow}
                    formatName={externalContributor.tableView.dateFileName}
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
export default ExternalContributor;
