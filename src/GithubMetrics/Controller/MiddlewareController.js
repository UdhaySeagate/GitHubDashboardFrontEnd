/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable react/no-did-update-set-state */
/* eslint-disable no-nested-ternary */
/* eslint-disable react/no-unused-state */
import React, { Component } from 'react';
import { Row, Col, Button } from 'react-bootstrap';
import moment from 'moment';
import ApiServiceCall from '../../serviceCall/apiServiceCall';
import InstantReport from '../InstantReportCards/InstantReportData';
import TotalContributorsData from '../TotalContribution/TotalContributorsData';
import TotalActions from '../TotalActions/TotalAction';
import Livestats from '../Livestats/Livestat';
import CommonFunction from '../../serviceCall/commonFunction';
import CommonTableView from '../TableView/CommonTableView';
import IssueLable from '../IssuesbyLable/IssuebyLables';
import OrganizationMember from '../OrganizationMember/ExternalContributor';
import Averagepr from '../AveragePRAge/Averageprchart';
import ResponseLatency from '../ResponseLatency/ResponseLatencyData';
import AverageIssueAge from '../AverageIssueAge/AverageIssueAgeChart';
import OpenPRChart from '../OpenPrIssueChart/OpenPRCharts';
import OpenIssueCharts from '../OpenPrIssueChart/OpenIssueCharts';

/**
 * Following class is used to handle both table view and dashboard view
 * API are triggered from here
 */
class MiddleViewController extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tableView: [
        { name: 'visits', apiCall: 'VISITS', hedaerName: 'Visits', colWidth: 4 },
        { name: 'visitors', apiCall: 'VISITS', hedaerName: 'Visitors', colWidth: 4 },
        { name: 'watchers', apiCall: 'WATCHES', hedaerName: 'Watchers', colWidth: 4 },
        { name: 'peopleStarred', apiCall: 'PEOPLE_STARRED', hedaerName: 'Starred', colWidth: 4 },
        { name: 'forks', apiCall: 'FORKS', hedaerName: 'Forks', colWidth: 4 },
        { name: 'totalClones', apiCall: 'TOTAL_CLONES', hedaerName: 'Clones', colWidth: 4 },
        { name: 'totalReleaseDownload', apiCall: 'TOTAL_RELEASE_DOWNLOAD', hedaerName: 'Downloads', colWidth: 6 },
        { name: 'totalCommits', apiCall: 'TOTAL_COMMITS', hedaerName: 'Commits', colWidth: 6 },
        { name: 'contributors', apiCall: 'TOTAL_COMMITS', hedaerName: 'Total Contributors', colWidth: 6 },
        { name: 'issues', apiCall: 'TOTAL_ISSUES', hedaerName: 'Total Issues', colWidth: 6 },
        { name: 'pullrequest', apiCall: 'TOTAL_PR_MERGED', hedaerName: 'Pull Request', colWidth: 6 },
        { name: 'controrgs', apiCall: 'TOTAL_COMMITS', hedaerName: 'Contributing Org', colWidth: 6 },
        { name: 'actionTaken', apiCall: 'ACTION_TAKEN', hedaerName: 'Action Taken', colWidth: 6 },
        { name: 'issueComments', apiCall: 'ISSUE_COMMENTS', hedaerName: 'Comments', colWidth: 6 }
      ],
      visits: { apiCallStatus: false, showErrorMessage: '', count: 0, barChartValue: '', tableView: '', daysObject: '' },
      visitors: { apiCallStatus: false, showErrorMessage: '', count: 0, barChartValue: '', tableView: '', daysObject: '' },
      watchers: { apiCallStatus: false, showErrorMessage: '', count: 0, barChartValue: '', tableView: '', daysObject: '' },
      actionTaken: { apiCallStatus: false, showErrorMessage: '', count: 0, barChartValue: '', tableView: '', daysObject: '' },
      peopleStarred: { apiCallStatus: false, showErrorMessage: '', count: 0, barChartValue: '', tableView: '', daysObject: '' },
      forks: { apiCallStatus: false, showErrorMessage: '', count: 0, barChartValue: '', tableView: '', daysObject: '' },
      controrgs: { apiCallStatus: false, showErrorMessage: '', count: 0, barChartValue: '', tableView: '', daysObject: '' },
      contributors: { apiCallStatus: false, showErrorMessage: '', count: 0, barChartValue: '', tableView: '', daysObject: '' },
      issues: { apiCallStatus: false, showErrorMessage: '', count: 0, barChartValue: '', tableView: '', daysObject: '' },
      pullrequest: { apiCallStatus: false, showErrorMessage: '', count: 0, barChartValue: '', tableView: '', daysObject: '' },
      totalClones: { apiCallStatus: false, showErrorMessage: '', count: 0, barChartValue: '', tableView: '', daysObject: '' },
      totalReleaseDownload: { apiCallStatus: false, showErrorMessage: '', count: 0, barChartValue: '', tableView: '', daysObject: '' },
      issueComments: { apiCallStatus: false, showErrorMessage: '', count: 0, barChartValue: '', tableView: '', daysObject: '' },
      totalCommits: { apiCallStatus: false, showErrorMessage: '', count: 0, barChartValue: '', tableView: '', daysObject: '' },
      issueByLabel: { apiCallStatus: false, showErrorMessage: '', count: 0, barChartValue: '', tableView: '', daysObject: '' },
      orgMembers: { apiCallStatus: false, showErrorMessage: '', count: 0, barChartValue: '', tableView: '', daysObject: '' },
      /** chart data assign */
      issueCommentsChartsPR: { apiCallStatus: false, totalCount: 0, chartValues: '', responseFullData: '', showErrorMessage: '' },
      issueCommentsChartsIssues: { apiCallStatus: false, totalCount: 0, chartValues: '', responseFullData: '', showErrorMessage: '' },
      issueRespLatency: { apiCallStatus: false, totalCount: 0, chartValues: '', responseFullData: '', showErrorMessage: '' },
      pullrequestChart: { apiCallStatus: false, totalCount: 0, chartValues: '', responseFullData: '', showErrorMessage: '' },
      issueschart: { apiCallStatus: false, totalCount: 0, chartValues: '', responseFullData: '', showErrorMessage: '' },
      cpyrawData: {}
    };
    /** Object is used to call third party releadted call */
    this.api = new ApiServiceCall();
    /** Object is used to call common function  */
    this.commonFunc = new CommonFunction();
  }

  /** Life Cycle of react  */
  componentDidMount() {
    const { selectedFilterItems } = this.props;
    const { cpyrawData } = this.state;
    if (JSON.stringify(selectedFilterItems) !== JSON.stringify(cpyrawData)) {
      this.triggerDashBoardAPICall(selectedFilterItems);
      this.setState({ cpyrawData: {...selectedFilterItems} });
    }
  }

  /** Life Cycle of react  */
  componentDidUpdate(prevProps) {
    const nextProps = this.props;
    if (prevProps !== this.props) {
      const { cpyrawData } = this.state;
      if (JSON.stringify(nextProps.selectedFilterItems) !== JSON.stringify(cpyrawData)) {
        this.setState({ cpyrawData: { ...nextProps.selectedFilterItems } });
        this.triggerDashBoardAPICall(nextProps.selectedFilterItems);
      }
    }
  }

  /** Method is used to handle open model props value */
  showExpandView = (clickHeader) => {
    this.props.callShowModel(clickHeader);
  };

  /**
   * Following method is used to trigger api call with recieved parmas
   * For issueComments,issueByLabel and issues params need to changed as per 
   * api request
   */
  triggerDashBoardAPICall = (params) => {
    // reqformat chanes
    const changedParam = {
      ...params,
      since: params.from,
      until: params.upto
    };
    delete changedParam.from;
    delete changedParam.upto;
    /** instant report */
    this.responseDataProcess('VISITS', params, 'visits');
    this.responseDataProcess('ACTION_TAKEN', params, 'actionTaken');
    this.responseDataProcess('WATCHES', params, 'watchers');
    /** live stats */
    this.responseDataProcess('PEOPLE_STARRED', params, 'peopleStarred');
    this.responseDataProcess('FORKS', params, 'forks');
    this.responseDataProcess('TOTAL_COMMITS', changedParam, 'controrgs');
    // // /** total contributors */
    this.responseDataProcess('TOTAL_ISSUES', changedParam, 'issues');
    this.responseDataProcess('TOTAL_PR_MERGED', params, 'pullrequest');
    // // /** total action */
    this.responseDataProcess('TOTAL_CLONES', params, 'totalClones');
    this.responseDataProcess('TOTAL_RELEASE_DOWNLOAD', params, 'totalReleaseDownload');
    this.responseDataProcess('ISSUE_COMMENTS', changedParam, 'issueComments');
    this.responseDataProcess('ISSUE_BY_LABEL', changedParam, 'issueByLabel');
    this.responseDataProcess('ORG_MEMBERS', params, 'orgMembers');
  };

  /**
   * Function is used to handle the api call and response conversion based on metric business logic
   */
  responseDataProcess = (url, params, stateName) => {
    const { selectedFilterItems } = this.props;
    const cardReassign = { apiCallStatus: false, showErrorMessage: '', count: 0, barChartValue: '', tableView: '', daysObject: '' };
    const chartData = { apiCallStatus: false, totalCount: 0, chartValues: '', responseFullData: '', showErrorMessage: '' };
    this.setState({
      visitors: cardReassign, [stateName]: cardReassign, issueCommentsChartsPR: chartData,
      contributors: cardReassign, totalCommits: cardReassign,
      issueCommentsChartsIssues: chartData, issueRespLatency: chartData, pullrequestChart: chartData, issueschart: chartData
    });
    /** following function is used to cancel the api in case of next api calls */
    this.api.axiosAPICancel(stateName);
    const responseProcess = this.api.callApiServiceMethod(url, params, stateName);
    responseProcess.then((data) => {
      if (stateName === 'visits') {
        const visits = this.commonFunc.processMetricData(data, stateName, selectedFilterItems,'Visits');
        const visitors = this.commonFunc.processMetricData(data, 'visitors', selectedFilterItems,'Visitors');
        this.setState({ visits, visitors });
      } else if (stateName === 'controrgs') {
        const contributors = this.commonFunc.processMetricData(data, 'contributors', selectedFilterItems,'Contributors');
        const controrgs = this.commonFunc.processMetricData(data, 'controrgs', selectedFilterItems,'Contributors Organization');
        const totalCommits = this.commonFunc.processMetricData(data, 'totalCommits', selectedFilterItems,'Commits');
        this.setState({ controrgs, contributors, totalCommits });
      } else if (stateName === 'issueByLabel') {
        const dataProcess = this.commonFunc.processIssueBylabel(data, selectedFilterItems);
        this.setState({ issueByLabel: dataProcess });
      } else if (stateName === 'orgMembers') {
        const dataProcess = this.commonFunc.processExtrernalContData(data, selectedFilterItems);
        this.setState({ orgMembers: dataProcess });
      } else if (stateName === 'issueComments') {
        const dataprcoessPR = this.commonFunc.processOpenPRandIssue(data, 'openPrsArr', 'Day');
        this.setState({ issueCommentsChartsPR: dataprcoessPR });
        const dataprcoessIssues = this.commonFunc.processOpenPRandIssue(data, 'openIssuesArr', 'Day');
        this.setState({ issueCommentsChartsIssues: dataprcoessIssues });
        const dataprcoess = this.commonFunc.processMetricData(data, stateName, selectedFilterItems,'Comments');
        this.setState({ [stateName]: dataprcoess });
        const respLatency = this.commonFunc.processResLatency(data, 'Month')
        this.setState({ issueRespLatency: respLatency });
      } else if (stateName === 'pullrequest') {
        const prChartprcoess = this.commonFunc.processPRandIssues(data, 'Month', 'PR');
        this.setState({ pullrequestChart: prChartprcoess });
        const dataprcoess = this.commonFunc.processMetricData(data, stateName, selectedFilterItems,'Pull Request');
        this.setState({ [stateName]: dataprcoess });
      } else if (stateName === 'issues') {
        const dataprcoess = this.commonFunc.processMetricData(data, stateName, selectedFilterItems,'Issues');
        this.setState({ [stateName]: dataprcoess });
        const issueChartprcoess = this.commonFunc.processPRandIssues(data, 'Month', 'Issue');
        this.setState({ issueschart: issueChartprcoess });
      } else {
        const csvColName = this.state.tableView.filter((ele) => ele.name === stateName)[0].hedaerName;
        const dataprcoess = this.commonFunc.processMetricData(data, stateName, selectedFilterItems,csvColName);
        this.setState({ [stateName]: dataprcoess });
      }
    });
  };

  /**
   * Function method is used to handle the table view api call
   */
  processTablecallApiTriggerFunction = (params, apiCall, stateName,csvHeaderName) => {
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
    this.processTable(apiCall, paramsPass, stateName,csvHeaderName);
  };

  /** Following method is used to handle the api reponse conversion  */
  processTable = (url, params, stateName,csvHeaderName) => {
    let dataprcoess  = '';
    const cardReassign = this.state[stateName];
    cardReassign.tableView = {
      showDateRange:true,
      showChart:false
    }
    this.setState({ [stateName]: cardReassign });
    const stateVal = { ...this.state };
    const responseProcess = this.api.callApiServiceMethod(url, params, stateName);
    const preData = {
      ...stateVal[stateName],
      apiCallStatus: false
    }
    this.setState({ [stateName]: preData });
    responseProcess.then((data) => {
      if (data.status === 'success' && data.statusCode === '200') {
        if(stateName === 'controrgs'){
          dataprcoess = this.commonFunc.processTableData(data.data.contributionOrg.tableView, stateName, params,csvHeaderName);
        }else if(stateName === 'contributors'){
          dataprcoess = this.commonFunc.processTableData(data.data.contributors.tableView, stateName, params,csvHeaderName);
        }
        else if(stateName ==='totalCommits'){
          dataprcoess = this.commonFunc.processTableData(data.data.commits.tableView, stateName, params,csvHeaderName);
        }
        else{
          dataprcoess = this.commonFunc.processTableData(data.data.tableView, stateName, params,csvHeaderName);
        }
        cardReassign.tableView = dataprcoess
        this.setState({ [stateName]: cardReassign });
      } else {
        cardReassign.tableView.showErrorMessage = data.data;
        this.setState({ [stateName]: cardReassign });
      }
    });
  }

  downloadAll = () => {
    const arr = ['Visits', 'Visitors', 'Watchers', 'Starred', 'Forks',
     'Clones', 'Downloads', 'Commits', 'Total Contributors', 'Total Issues', 'Pull Request',
      'Contributing Org', 'Action Taken', 'Comments'];
      arr.forEach(data => {
        if (document.getElementById(data)) {
          document.getElementById(data).click();
        }
      });  
  };

  render() {
    const stateVal = { ...this.state };
    const propData = { ...this.props };
    const dateFileName=`${moment(this.commonFunc.changeOrgDateFormat(propData.selectedFilterItems.from)).format('ll')} - ${moment(
      this.commonFunc.changeOrgDateFormat(propData.selectedFilterItems.upto)).format('ll')}`;
    return (
      <div>
        {propData.pageView === 'Dashboard' ? (
          <div className="dashboardView">
            <InstantReport
              visits={stateVal.visits}
              visitors={stateVal.visitors}
              watchers={stateVal.watchers}
              actionTaken={stateVal.actionTaken}
              showModelProps={this.showExpandView}
            />
            <Row className="section2">
              <Col sm={3}>
                <Livestats peopleStarred={stateVal.peopleStarred} forks={stateVal.forks} controrgs={stateVal.controrgs} showModelProps={this.showExpandView} />
              </Col>
              <Col sm={6}>
                <TotalContributorsData
                  contributors={stateVal.contributors}
                  pullrequest={stateVal.pullrequest}
                  issues={stateVal.issues}
                  showModelProps={this.showExpandView}
                />
              </Col>
              <Col sm={3}>
                <TotalActions
                  totalClones={stateVal.totalClones}
                  issueComments={stateVal.issueComments}
                  totalReleaseDownload={stateVal.totalReleaseDownload}
                  totalCommits={stateVal.totalCommits}
                  showModelProps={this.showExpandView}
                />
              </Col>
            </Row>
            <Row className="mainsection3">
              <Col sm={6}>
                <IssueLable issueLable={stateVal.issueByLabel} />
              </Col>
              <Col sm={6}>
                <OrganizationMember externalContributor={stateVal.orgMembers} />
              </Col>
            </Row>
            <Row className="mainsection4">
              <Col sm={6}>
                <Averagepr
                  chartData={stateVal.pullrequestChart}
                  typeView="Month"
                  dateFileName={dateFileName}
                />
              </Col>
              <Col sm={6}>
                <AverageIssueAge
                  chartData={stateVal.issueschart}
                  typeView="Month"
                  dateFileName={dateFileName}
                />
              </Col>
            </Row>
            <Row className="mainsection5">
              <Col sm={6}>
                <Row className="issprchart">
                  <Col sm={12} className="headerlable headerCharttop">
                    <div>PR Open</div>
                  </Col>
                </Row>
                <OpenPRChart
                  chartData={stateVal.issueCommentsChartsPR}
                  typeView="Day"
                  charType="openPrsArr"
                  dateFileName={dateFileName}
                />
              </Col>
              <Col sm={6}>
                <Row className="issprchart">
                  <Col sm={12} className="headerlable headerCharttop">
                    <div>Issues Open</div>
                  </Col>
                </Row>
                <OpenIssueCharts
                  chartData={stateVal.issueCommentsChartsIssues}
                  typeView="Day"
                  charType="openIssuesArr"
                  dateFileName={dateFileName}
                />
              </Col>
            </Row>
            <Row className="mainsection6">
              <Col sm={6}>
                <ResponseLatency
                  chartData={stateVal.issueRespLatency}
                  typeView="Month"
                  dateFileName={dateFileName}
                />
              </Col>
              <Col sm={6} />
            </Row>
          </div>
        ) : (
          <div className="tableviewcont">
            <Row>
              <Col className="dwnlodall">
                <Button onClick={() => this.downloadAll()}>
                  Download all Reports
                </Button>
              </Col>
            </Row>
            <Row className="tablerow">
              {stateVal.tableView.map((element) => (
                <Col key={element.name} className="tableCol" sm={element.colWidth}>
                  <CommonTableView
                    dataProcessName={element.name}
                    headerName={element.hedaerName}
                    apiCall={element.apiCall}
                    tableViewProces={stateVal[element.name].tableView}
                    selectedFilterData={propData.selectedFilterItems}
                    allRangeDateOrg={propData.allRangeDateOrg}
                    callApiTriggerFunction={this.processTablecallApiTriggerFunction}
                  />
                </Col>
                ))}
            </Row>
          </div>
          )}
      </div>
    );
  }
}

export default MiddleViewController;
