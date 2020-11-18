/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import './TableView.css';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import ToolkitProvider, { CSVExport } from 'react-bootstrap-table2-toolkit';
import expor from '../../assets/expor.png';

const TableViewNoExpand = ({ columns, tableData, tableName, formatName }) => {
  const { ExportCSVButton } = CSVExport;

  const customTotal = (from, to, size) => (
    <span className="react-bootstrap-table-pagination-total totalSpan">
      Showing 
      {' '}
      {from}
      {' '}
      to 
      {' '}
      {to}
      {' '}
      of 
      {' '}
      {size}
      {' '}
      Results
    </span>
  );

  const options = {
    hideSizePerPage: true, // Hide the sizePerPage dropdown always
    showTotal: false,
    paginationTotalRenderer: customTotal,
    sizePerPageList: [
      {
        text: '10',
        value: 10
      }
    ]
  };

  return (
    <div className="tableheight table-hover table-striped">
      <ToolkitProvider
        keyField="id"
        key='tabe'
        data={tableData}
        columns={columns}
        exportCSV={{
          fileName: `${tableName}(${formatName}).csv`
        }}
      >
        {(props) => (
          <div className="tableName">
            <ExportCSVButton {...props.csvProps}>
              {' '}
              <span id={tableName}>
                <img src={expor} alt="Info" />
              </span>
            </ExportCSVButton>
            <BootstrapTable {...props.baseProps} pagination={paginationFactory(options)} />
          </div>
        )}
      </ToolkitProvider>
    </div>
  );
};

export default TableViewNoExpand;
