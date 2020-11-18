/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React from 'react';
import './TableView.css';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import ToolkitProvider  from 'react-bootstrap-table2-toolkit';

const TableViewWithExpand = ({ columns, tableData, nonExpandRow, innerTableColumn, tableName }) => {
  const customTotal = (from, to, size) => (
    <span className="react-bootstrap-table-pagination-total totalSpan">
      Showing 
      {' '}
      {size <= 10 ? '' : from} 
      {' '}
      {size <= 10 ? '' : 'to'} 
      {' '}
      {size <= 10 ? from : to}
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
    showTotal: true,
    paginationTotalRenderer: customTotal,
    sizePerPageList: [
      {
        text: '10',
        value: 10
      }
    ]
  };

  const expandRow = {
    onlyOneExpanding: true,
    renderer: (row) => {
      const innertableData = [];
      if (tableName === 'ORGMEM') {
        row.listData.forEach((element) => {
          innertableData.push({ members: element.name, count: element.contributions });
        });
      } else {
        row.listData.forEach((element) => {
          innertableData.push({ label: element.name, count: element.count });
        });
      }
      return (
        <div className="childTable">
          <BootstrapTable keyField="id" data={innertableData} columns={innerTableColumn} headerClasses="header-class" />
        </div>
      );
    },

    expandByColumnOnly: false,
    showExpandColumn: true,
    nonExpandable: nonExpandRow
  };

  const showExpandColum = nonExpandRow.length === tableData.length ? '' : 'mainTableDivIcon';


  return (
    <div className={`${showExpandColum} mainTableDiv tableheight table-striped`}>
      <ToolkitProvider
        keyField="id"
        data={tableData}
        columns={columns}
      >
        {(props) => (
          <div className="tableName">
            <BootstrapTable
              {...props.baseProps}
              pagination={paginationFactory(options)}
              expandRow={nonExpandRow.length === tableData.length ? false : expandRow}
            />
          </div>
        )}
      </ToolkitProvider>
    </div>
  );
};

export default TableViewWithExpand;
