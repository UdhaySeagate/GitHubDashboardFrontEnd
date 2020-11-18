/* eslint-disable no-nested-ternary */
import moment from 'moment';
/**
 * Description: Class used to handle the common function
 */
class CommonFunction {
  setDateRange = (dateRange, setData, allDateValOrg) => {
    let fromval = '';
    const filterData = setData;
    switch (dateRange) {
      case 'Day':
        filterData.from = this.changeTimeFormat().subtract(1, 'day').utc().format();
        filterData.upto = this.changeEndTimeFormat().subtract(1, 'day').utc().format();
        filterData.filtertype = dateRange;
        break;
      case 'Month':
        fromval = this.changeTimeFormat().subtract(1, 'day').utc().format();
        filterData.from = moment(fromval).subtract(1, 'months').utc().format();
        filterData.upto = this.changeEndTimeFormat().subtract(1, 'day').utc().format();
        if (this.getNoofDaysBetween(this.changeTimeFormat(allDateValOrg).utc().format(), filterData.from) < 0) {
          filterData.from = this.changeTimeFormat(allDateValOrg).utc().format();
        }
        filterData.filtertype = dateRange;
        break;
      case 'Year':
        fromval = this.changeTimeFormat().subtract(1, 'day').utc().format();
        filterData.from = moment(fromval).subtract(1, 'year').utc().format();
        filterData.upto = this.changeEndTimeFormat().subtract(1, 'day').utc().format();
        if (this.getNoofDaysBetween(this.changeTimeFormat(allDateValOrg).utc().format(), filterData.from) < 0) {
          filterData.from = this.changeTimeFormat(allDateValOrg).utc().format();
        }
        filterData.filtertype = dateRange;
        break;
      case 'Week':
        fromval = this.changeTimeFormat().subtract(1, 'day').utc().format();
        filterData.from = moment(fromval).subtract(1, 'week').utc().format();
        filterData.upto = this.changeEndTimeFormat().subtract(1, 'day').utc().format();
        if (this.getNoofDaysBetween(this.changeTimeFormat(allDateValOrg).utc().format(), filterData.from) < 0) {
          filterData.from = this.changeTimeFormat(allDateValOrg).utc().format();
        }
        filterData.filtertype = dateRange;
        break;
      default:
        filterData.from = this.changeTimeFormat(allDateValOrg).utc().format();
        filterData.upto = this.changeEndTimeFormat().subtract(1, 'day').utc().format();
        filterData.filtertype = 'All';
        break;
    }
    return filterData;
  };

  getNoofDaysBetween = (startDateVal, endDateVal) => {
    const todayDate = moment(moment(startDateVal).format('YYYY-MM-DD'), 'YYYY-MM-DD');
    const endDate = moment(moment(endDateVal).format('YYYY-MM-DD'), 'YYYY-MM-DD');
    return endDate.diff(todayDate, 'days');
  };

  compareDatesisSameorBefore = (firstDate, secondDate) => {
    const firstDateFor = moment(firstDate).format('YYYY-MM-DD');
    const secondDateFor = moment(secondDate).format('YYYY-MM-DD');
    return moment(firstDateFor).isSameOrBefore(secondDateFor); // true or false
  };

  /**
   * DEscription: function is used to set hours to 00:00:00
   */
  changeTimeFormat = (dateVal) => {
    const m = moment(dateVal);
    m.set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
    m.toISOString();
    return m;
  };

  /**
   * Description: function is used to set hours to 23:59:59
   */
  changeEndTimeFormat = (dateVal) => {
    const m = moment(dateVal);
    m.set({ hour: 23, minute: 59, second: 59, millisecond: 0 });
    m.toISOString();
    return m;
  };

  changeOrgDateFormat = (date) => {
    let localTime = moment.utc(date).toDate();
    localTime = moment(localTime).format('YYYY-MM-DD');
    return localTime;
  };

  /**
 * Description: function is used hanndle mnetric data in cards data
 */
  processMetricData = (processMetricData, headerName, selectedFilterData,csvHeader) => {
    const processMet = {
      apiCallStatus: false,
      showErrorMessage: '',
      count: 0,
      barChartValue: '',
      tableView: ''
    };
    if (processMetricData.status === 'success' && processMetricData.statusCode === '200') {
      processMet.apiCallStatus = true;
      switch (headerName) {
        case 'visits':
          processMet.count = processMetricData.data.visits;
          processMet.barChartValue = processMetricData.data.visitStatistic;
          processMet.tableView = this.processTableData(processMetricData.data.tableView, headerName, selectedFilterData,csvHeader);
          processMet.daysObject = this.dayToStringProcess(processMetricData.data.visits, selectedFilterData, processMetricData.data.createdAt);
          break;
        case 'visitors':
          processMet.count = processMetricData.data.visitors;
          processMet.barChartValue = processMetricData.data.visitorsStatistic;
          processMet.tableView = this.processTableData(processMetricData.data.tableView, headerName, selectedFilterData,csvHeader);
          processMet.daysObject = this.dayToStringProcess(processMetricData.data.visitors, selectedFilterData, processMetricData.data.createdAt);
          break;
        case 'controrgs':
          processMet.count = processMetricData.data.contributionOrg.count;
          processMet.barChartValue = processMetricData.data.contributionOrg.statistic;
          processMet.tableView = this.processTableData(processMetricData.data.contributionOrg.tableView, headerName, selectedFilterData,csvHeader);
          break;
        case 'contributors':
          processMet.count = processMetricData.data.contributors;
          processMet.barChartValue = '';
          processMet.tableView = this.processTableData(processMetricData.data.contributors.tableView, headerName, selectedFilterData,csvHeader);
          break;
        case 'totalCommits':
          processMet.count = processMetricData.data.commits.count;
          processMet.barChartValue = '';
          processMet.tableView = this.processTableData(processMetricData.data.commits.tableView, headerName, selectedFilterData,csvHeader);
          break;
        case 'pullrequest':
        case 'issues':
          processMet.count = processMetricData.data;
          processMet.barChartValue = '';
          processMet.tableView = this.processTableData(processMetricData.data.tableView, headerName, selectedFilterData,csvHeader);
          break;
        case 'totalClones':
          processMet.count = processMetricData.data.count;
          processMet.barChartValue = '';
          processMet.tableView = this.processTableData(processMetricData.data.tableView, headerName, selectedFilterData,csvHeader);
          processMet.daysObject = this.dayToStringProcess(processMetricData.data.count, selectedFilterData, processMetricData.data.createdAt);
          break;
        default:
          processMet.count = processMetricData.data.count;
          processMet.barChartValue = processMetricData.data.statistic;
          processMet.tableView = this.processTableData(processMetricData.data.tableView, headerName, selectedFilterData,csvHeader);
          break;
      }
    } else if (processMetricData.data){
      processMet.showErrorMessage = processMetricData.data;
    }
    return processMet;
  };

  /**
  * Description: function is used hanndle mnetric data in table
  */
  processTableData = (tableDataProcess, headerName, selectedFilterData,csvHeader) => {
    const columnName = [{ dataField: 'repoName', text: 'Repository', sort: true }];
    if (headerName === 'contributors') {
      columnName.push(
        { dataField: 'internal', text: 'Internal', sort: true },
        { dataField: 'external', text: 'External', sort: true },
        { dataField: 'count', text: 'Total', sort: true }
      );
    } else if (headerName === 'issues') {
      columnName.push(
        { dataField: 'open', text: 'Open', sort: true },
        { dataField: 'close', text: 'Close', sort: true },
        { dataField: 'count', text: 'Total', sort: true }
      );
    } else if (headerName === 'pullrequest') {
      columnName.push(
        { dataField: 'open', text: 'Open', sort: true },
        { dataField: 'close', text: 'Close', sort: true },
        { dataField: 'merge', text: 'Merged', sort: true },
        { dataField: 'count', text: 'Total', sort: true }
      );
    } else {
      columnName.push({ dataField: 'count', text: 'Count', sort: true, csvText: csvHeader});
    }
    const tableData = [];
    let totalCount = 0;
    tableDataProcess.forEach((element) => {
      const countVal = headerName === 'visitors' ? element.uniques : element.count;
      if (headerName === 'contributors') {
        tableData.push({
          repoName: element.repo,
          count: countVal,
          internal: element.internal,
          external: element.external
        });
      } else if (headerName === 'issues') {
        tableData.push({
          repoName: element.repo,
          count: countVal,
          open: element.open,
          close: element.close
        });
      } else if (headerName === 'pullrequest') {
        tableData.push({
          repoName: element.repo,
          count: countVal,
          open: element.open,
          close: element.close,
          merge: element.merge
        });
      } else {
        tableData.push({
          repoName: element.repo,
          count: countVal
        });
      }
      totalCount += countVal;
    });
    const dateFileName = `${moment(this.changeOrgDateFormat(selectedFilterData.from)).format('ll')} - ${moment(
      this.changeOrgDateFormat(selectedFilterData.upto)).format('ll')}`;
    return {
      showChart: true,
      showDateRange:true,
      tableData,
      totalCount,
      columnName,
      dateFileName,
      [headerName]:dateFileName,
      showErrorMessage:''
    };
  };

  /**
  * Description: function is used show date days in cards
  */
  dayToStringProcess = (count, selectedFilterData, createdAt) => {
    const daysObject = {
      days: '',
      dateString: ''
    };
    if (selectedFilterData.filterType !== 'Day' && selectedFilterData.filterType !== 'Week' && createdAt !== '' && count !== 0) {
      if (!this.compareDatesisSameorBefore(createdAt, this.changeOrgDateFormat(selectedFilterData.from))) {
        daysObject.days = this.getNoofDaysBetween(createdAt, this.changeOrgDateFormat(selectedFilterData.upto));
        if (daysObject.days >= 0) {
          daysObject.dateString =
            daysObject.days === 0
              ? moment(createdAt).format('ll')
              : `${moment(createdAt).format('ll')} - ${moment(this.changeOrgDateFormat(selectedFilterData.upto)).format('ll')}`;
          daysObject.days = daysObject.days === 0 ? daysObject.days : daysObject.days + 1;
        } else {
          daysObject.days = '';
        }
      }
    }
    return { ...daysObject };
  };

  /**
  * Description: function is used for issue by lable table
  */
  processIssueBylabel = (tableDataProcess, selectedFilterData) => {
    const returnData = { apiCallStatus: false, showErrorMessage: '', count: 0, tableView: '' };
    if (tableDataProcess.status === 'success' && tableDataProcess.statusCode === '200') {
      const innerTableColumn = [
        { text: '' },
        { dataField: 'label', text: 'Issue By Label', sort: true },
        { dataField: 'count', text: 'No of Issues', sort: true }
      ];
      const tableData = [];
      const columnName = [
        { dataField: 'repoName', text: 'Repository', sort: true, headerClasses: 'headerFormatClass' },
        { dataField: 'label', text: 'Issue By Label', sort: true },
        { dataField: 'count', text: 'No of Issues', sort: true }
      ];
      const nonExpandRow = [];
      tableDataProcess.data.tableView.forEach((element, key) => {
        const lableName = [];
        if (element.list.length > 0) {
          element.list.forEach((innerelement) => {
            lableName.push(innerelement.name);
          });
          tableData.push({ id: key, repoName: element.repo, label: lableName.toString(), count: element.count, listData: element.list });
          if (element.list.length === 1) {
            nonExpandRow.push(key);
          }
        } else {
          nonExpandRow.push(key);
          tableData.push({ id: key, repoName: element.repo, label: '-', count: element.count, listData: element.list });
        }
      });

      /** export data formation  */
      const exportTableData = [];
      tableData.forEach((element) => {
        const { repoName } = element;
        if (element.listData && element.listData.length > 0) {
          element.listData.forEach((elementInner) => {
            exportTableData.push({repoName,lable:elementInner.name,count:elementInner.count});
          });
        }else{
          exportTableData.push({ label: '-', repoName, count: element.count });
        }
      })
      const dateFileName = `${moment(this.changeOrgDateFormat(selectedFilterData.from)).format('ll')} - ${moment(
        this.changeOrgDateFormat(selectedFilterData.upto)).format('ll')}`;
      returnData.apiCallStatus = true;
      returnData.count = tableDataProcess.data.count;
      returnData.tableView = { columnName, tableData, nonExpandRow, innerTableColumn, dateFileName ,exportTableData};
    }
    return returnData;
  };

  /**
  * Description: function is used for issue by external contritbutor
  */
  processExtrernalContData = (tableDataProcess,selectedFilterData) => {
    const returnData = { apiCallStatus: false, showErrorMessage: '', count: 0, tableView: '' };
    if (tableDataProcess.status === 'success' && tableDataProcess.statusCode === '200') {
      const tableData = [];
      const nonExpandRow = [];
      const innerTableColumn = [{ text: '' }, { dataField: 'members', text: 'Members' }, { dataField: 'count', text: 'Count' }];
      const columnName = [
        { dataField: 'repoName', text: 'Repository', sort: true },
        { dataField: 'contributors', text: 'Contributors', sort: true },
        { dataField: 'count', text: 'Contributions', sort: true }
      ];
      let countVal = 0;
      let totalCount = 0;
      tableDataProcess.data.tableView.forEach((element, key) => {
        countVal = element.list.reduce((acc, curr) => {
          // eslint-disable-next-line no-param-reassign
          return (acc += curr.contributions);
        }, 0);
        totalCount += countVal;
        tableData.push({
          id: key,
          listData: element.list,
          repoName: element.repo,
          contributors: `Total Count : ${element.list.length}`,
          count: `Total Count : ${countVal}`,
          showExpand: true
        });
        if (element.list.length <= 1) {
          nonExpandRow.push(key);
        }
      });
       /** export data formation  */
       const exportTableData = [];
       tableData.forEach((element) => {
         const { repoName } = element;
         if (element.listData && element.listData.length > 0) {
          element.listData.forEach((elementInner) => {
            exportTableData.push({ contributors: elementInner.name, repoName, count: elementInner.contributions });
          });
         }else{
           exportTableData.push({ contributors: '-', repoName, count: 0 });
         }
       })
      const dateFileName = `${moment(this.changeOrgDateFormat(selectedFilterData.from)).format('ll')} - ${moment(
        this.changeOrgDateFormat(selectedFilterData.upto)).format('ll')}`;
      returnData.apiCallStatus = true;
      returnData.count = totalCount;
      returnData.tableView = { columnName, tableData, nonExpandRow, innerTableColumn, dateFileName,exportTableData };
    }
    return returnData;
  };

  /**
  * Description: function is used for issue by PR closed and issue
  */
  processPRandIssues = (dataProcsschart, viewType, chartType) => {
    const chartReturnData = { apiCallStatus: false, totalCount: 0, chartValues: '', responseFullData: '', showErrorMessage: '' };
    if (dataProcsschart.status === 'success' && dataProcsschart.statusCode === '200') {
      const dataProcss = dataProcsschart.data;
      let closedreponseData = {};
      if (chartType === 'PR') {
        closedreponseData =
          viewType === 'Month' ? dataProcss.bymonthView.closedPR : viewType === 'Week' ? dataProcss.byweekView.closedPR : dataProcss.bydayView.closedPR;
      } else {
        closedreponseData =
          viewType === 'Month' ? dataProcss.bymonthView.closedIssue : viewType === 'Week' ? dataProcss.byweekView.closedIssue : dataProcss.bydayView.closedIssue;
      }
      const datesclosed = [];
      let totalClose = 0;
      if (closedreponseData.length > 0) {
        // eslint-disable-next-line func-names
        closedreponseData.forEach((element, key) => {
          closedreponseData[key].defaultDate = element.closeddate;
          const date =
            viewType === 'Day'
              ? moment(this.changeOrgDateFormat(element.closeddate)).format('YYYY-MM-DD')
              : viewType === 'Month'
                ? moment(this.changeOrgDateFormat(element.startdate)).format('YYYY-MM-DD')
                : `${moment(this.changeOrgDateFormat(element.startdate)).format('DD MMM YY')} - ${moment(
                  this.changeOrgDateFormat(element.enddate)
                ).format('DD MMM YY')}`;
          closedreponseData[key].closeddate = date;
          if (!datesclosed.includes(date)) {
            datesclosed.push(date);
          }
          closedreponseData[key].divideCount = 1;
        });
      }

      if (viewType === 'Day') {
        datesclosed.sort((a, b) => Date.parse(a) / 1000 - Date.parse(b) / 1000);
      }
      const averageClosed = new Array(datesclosed.length).fill(0);
      const averageData = new Array(datesclosed.length).fill(0);
      const issueClosedCount = new Array(datesclosed.length).fill(0);
      const closeDivideCount = new Array(datesclosed.length).fill(0);
      const dateCheck = [...datesclosed];
      closedreponseData.forEach((element) => {
        const indexof = dateCheck.indexOf(element.closeddate);
        if (indexof >= 0) {
          closeDivideCount[indexof] += element.divideCount;
          averageClosed[indexof] += element.avgdays > 0 ? element.avgdays / 24 : 0;
          averageData[indexof] = element;
          issueClosedCount[indexof] += element.prcount;
          totalClose += element.prcount;
        }
      });
      chartReturnData.apiCallStatus = true;
      chartReturnData.totalCount = totalClose;
      chartReturnData.chartValues = { 'typeYear': viewType, issueClosedCount, averageClosed, averageData, 'dates': datesclosed };
      chartReturnData.responseFullData = dataProcsschart;
    } else {
      chartReturnData.showErrorMessage = dataProcsschart.data;
    }
    return chartReturnData;
  };

  /**
  * Description: function is used for issue by PR open and issue open
  */
  processOpenPRandIssue = (dataProcsschart, charttype, viewType) => {
    const bytxt = viewType === 'Month' ? 'byMonthView' : viewType === 'Week' ? 'byWeekView' : 'byDayView';
    const chartReturnData = { apiCallStatus: false, totalCount: 0, chartValues: '', responseFullData: '', showErrorMessage: '' };
    let rawData = [];
    const arr = [];
    const tickval = [];
    if (dataProcsschart.status === 'success' && dataProcsschart.statusCode === '200') {
      rawData = dataProcsschart.data[charttype][bytxt];
      rawData.forEach((element) => {
        arr.push(element.count);
        tickval.push(element.categorys);
      });
      chartReturnData.apiCallStatus = true;
      chartReturnData.totalCount = charttype === 'openPrsArr' ? dataProcsschart.data.prcount : dataProcsschart.data.issuecount
      const labelTxt = charttype === 'openPrsArr' ? 'Open PR' : 'Open Issues'
      chartReturnData.chartValues = { chartDataShow: [...arr], tickVal: tickval, labelTxt ,viewType};
      chartReturnData.responseFullData = dataProcsschart;
    }
    return chartReturnData;
  }

  /**
  * Description: function is used for response latency pr open and issue open
  */

  processResLatency = (dataProcsschart, viewType) => {
    const chartReturnData = { apiCallStatus: false, totalCount: 0, chartValues: '', responseFullData: '', showErrorMessage: '' };
    if (dataProcsschart.status === 'success' && dataProcsschart.statusCode === '200') {
      const dataProcss = dataProcsschart.data;
      const closedreponseData =
        viewType === 'Month'
          ? dataProcss.bymonthView.prResponseLatency
          : viewType === 'Week'
            ? dataProcss.byweekView.prResponseLatency
            : dataProcss.bydayView.prResponseLatency;
      const openresponseData =
        viewType === 'Month'
          ? dataProcss.bymonthView.issueResponseLatency
          : viewType === 'Week'
            ? dataProcss.byweekView.issueResponseLatency
            : dataProcss.bydayView.issueResponseLatency;
      const datesclosed = [];
      const datesopen = [];
      const dates = [];
      if (closedreponseData.length > 0) {
        // eslint-disable-next-line func-names
        closedreponseData.forEach((element, key) => {
          closedreponseData[key].defaultDate = element.createddate;
          const date =
            viewType === 'Day'
              ? moment(this.changeOrgDateFormat(element.createddate)).format('YYYY-MM-DD')
              : viewType === 'Month'
                ? moment(this.changeOrgDateFormat(element.startdate)).format('YYYY-MM-DD')
                : `${moment(this.changeOrgDateFormat(element.startdate)).format('DD MMM YY')} - ${moment(
                  this.changeOrgDateFormat(element.enddate)
                ).format('DD MMM YY')}`;
          closedreponseData[key].createddate = date;
          if (!datesclosed.includes(date)) {
            datesclosed.push(date);
          }
          closedreponseData[key].divideCount = 1;
        });
      }

      if (openresponseData.length > 0) {
        openresponseData.forEach((element, key) => {
          openresponseData[key].defaultDate = element.createddate;
          const date =
            viewType === 'Day'
              ? moment(this.changeOrgDateFormat(element.createddate)).format('YYYY-MM-DD')
              : viewType === 'Month'
                ? moment(this.changeOrgDateFormat(element.startdate)).format('YYYY-MM-DD')
                : `${moment(this.changeOrgDateFormat(element.startdate)).format('DD MMM YY')} - ${moment(
                  this.changeOrgDateFormat(element.enddate)
                ).format('DD MMM YY')}`;
          openresponseData[key].createddate = date;
          openresponseData[key].divideCount = 1;
          if (!datesopen.includes(date)) {
            datesopen.push(date);
          }
        });
      }
      const mergedDate = datesopen.concat(datesclosed);
      mergedDate.forEach((element) => {
        if (!dates.includes(element)) {
          dates.push(element);
        }
      });
      if (viewType === 'Day') {
        dates.sort((a, b) => Date.parse(a) / 1000 - Date.parse(b) / 1000);
      }
      const averageClosed = new Array(dates.length).fill(0);
      const averageData = new Array(dates.length).fill(0);
      const averageDataissue = new Array(dates.length).fill(0);
      const issueClosedCount = new Array(dates.length).fill(0);
      const issueOpenCount = new Array(dates.length).fill(0);
      const averageOpen = new Array(dates.length).fill(0);
      const openDivideCount = new Array(dates.length).fill(0);
      const closeDivideCount = new Array(dates.length).fill(0);
      const dateCheck = [...dates];
      closedreponseData.forEach((element) => {
        const indexof = dateCheck.indexOf(element.createddate);
        if (indexof >= 0) {
          closeDivideCount[indexof] += element.divideCount;
          averageData[indexof] = element;
          averageClosed[indexof] += element.avgdays > 0 ? element.avgdays / 24 : 0;
          issueClosedCount[indexof] += element.prcount;
        }
      });

      openresponseData.forEach((element) => {
        const indexof = dateCheck.indexOf(element.createddate);
        if (indexof >= 0) {
          openDivideCount[indexof] += element.divideCount;
          averageDataissue[indexof] = element;
          averageOpen[indexof] += element.avgdays > 0 ? element.avgdays / 24 : 0;
          issueOpenCount[indexof] += element.prcount;
        }
      });

      averageOpen.forEach((element, key) => {
        if (openDivideCount[key] > 1) {
          const divide = element / openDivideCount[key];
          averageOpen[key] = Math.round((divide + Number.EPSILON) * 100) / 100;
        }
      });
      averageClosed.forEach((element, key) => {
        if (closeDivideCount[key] > 1) {
          const divide = element / closeDivideCount[key];
          averageClosed[key] = Math.round((divide + Number.EPSILON) * 100) / 100;
        }
      });

      chartReturnData.apiCallStatus = true;
      chartReturnData.chartValues = {
        typeYear: viewType, issueClosedCount,
        issueOpenCount,
        averageClosed,
        averageOpen,
        averageData,
        averageDataissue,
        dates
      };
      chartReturnData.responseFullData = dataProcsschart;
    }
    return chartReturnData;
  };

}

export default CommonFunction;
