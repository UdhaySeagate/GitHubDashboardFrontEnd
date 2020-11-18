/* eslint-disable no-nested-ternary */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React, { Component } from 'react';
import { Modal, Row, Col, Container, Button, ButtonGroup, DropdownButton, Dropdown } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import DateRangePickerExpand from 'react-bootstrap-daterangepicker';
import { Picky } from 'react-picky';
import moment from 'moment';
import saveSvgAsPng from 'save-svg-as-png';
import donwload from '../../assets/download.png';
import ApiServiceCall from '../../serviceCall/apiServiceCall';
import './ExpandView.css';
import LineChart from './LineChart';
import BarChart from './BarChart';
import CommonChartLoader from '../commonLoader/commonChartsLoader';
import 'bootstrap-daterangepicker/daterangepicker.css';
import CommonFunction from '../../serviceCall/commonFunction';
import calender from '../../assets/calendar.png';

/**
 * Following class is used to control the expand view method
 */
class ExpandView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expandViewResponse: '',
      viewType: ['Month', 'Week', 'Day'],
      viewTypeSelected: 'Month',
      setModelShow: false,
      repoList: [],
      copyRepo: null,
      copyDateVal: null,
      selectedHeaderValue: 'Visitors',
      chartValues: {
        repoNameGroup: '',
        repoNameData: '',
        datePush: '',
        headerType: '',
        typeYear: '',
        colorsData: '',
        cumDateData: '',
        viewType: ''
      },
      chartType: 'Line Chart',
      chartTypeArray: ['Line Chart', 'Bar Chart'],
      selectedFilterItems: {
        repoName: '',
        from: '',
        upto: '',
        filtertype: 'Month'
      },
      dataFlowType: {
        Visitors: {
          dataShowType: ['Cumulative', 'Unique'],
          selectedValue: 'Cumulative'
        },
        Visits: {
          dataShowType: ['Cumulative', 'Absolute'],
          selectedValue: 'Cumulative'
        },
        'Actions Taken': {
          dataShowType: ['Cumulative', 'Absolute', 'Unique'],
          selectedValue: 'Cumulative'
        },
        Watchers: {
          dataShowType: ['Cumulative'],
          selectedValue: 'Cumulative'
        },
        Starred: {
          dataShowType: ['Cumulative', 'Absolute'],
          selectedValue: 'Cumulative'
        },
        Forks: {
          dataShowType: ['Cumulative', 'Absolute'],
          selectedValue: 'Cumulative'
        },
        'Contributing Organization': {
          dataShowType: ['Absolute', 'Unique'],
          selectedValue: 'Absolute'
        },
        Clones: {
          dataShowType: ['Cumulative', 'Absolute', 'Unique'],
          selectedValue: 'Cumulative'
        },
        Commits: {
          dataShowType: ['Cumulative', 'Absolute'],
          selectedValue: 'Cumulative'
        },
        Contributors: {
          dataShowType: ['Cumulative', 'Absolute', 'Unique'],
          selectedValue: 'Cumulative'
        },
        Issues: {
          dataShowType: ['Cumulative', 'Absolute'],
          selectedValue: 'Cumulative'
        },
        'Pull Request': {
          dataShowType: ['Cumulative', 'Absolute'],
          selectedValue: 'Cumulative'
        },
        Downloads: {
          dataShowType: ['Cumulative'],
          selectedValue: 'Cumulative'
        },
        Comments: {
          dataShowType: ['Cumulative', 'Absolute'],
          selectedValue: 'Cumulative'
        }
      },
      headerName: [
        'Visitors',
        'Visits',
        'Actions Taken',
        'Watchers',
        'Starred',
        'Forks',
        'Contributing Organization',
        'Clones',
        'Commits',
        'Contributors',
        'Issues',
        'Pull Request',
        'Downloads',
        'Comments'
      ],
      arrayValue: [],
      allRangeDateOrg: '',
      maxEndDate: moment().subtract(1, 'day').format('MM/DD/YYYY'),
      showButton: true,
      showChart: false,
    };
    this.api = new ApiServiceCall();
    this.commonFunc = new CommonFunction();
  }

  /** React life cycle method
   * On click on any of metric following component get triggered
   * api call will happen with selected repos and date range
   */
  componentDidMount() {
    const { props } = this;
    const {setModelShow} = this.state;
    let repoarrayData = [];
    repoarrayData = props.selectedRepoArray;
    this.setState({
      allRangeDateOrg: props.orgDate,
      setModelShow: !setModelShow,
      arrayValue: repoarrayData.length === 0 ? props.repoData[0] : [...repoarrayData],
      repoList: props.repoData
    });
    this.triggerDefaultCall(props.selectedData, repoarrayData, props.repoData);
  }

  /** Following mehtod is used to create apply button drop down react picky customization */
  componentDidUpdate() {
    const { arrayValue } = this.state;
    if (
      document.querySelector('.scrollDivset.expanDropDown .picky__dropdown') &&
      !document.querySelector('.scrollDivset.expanDropDown .picky__dropdown > .aplybtndivs')
    ) {
      const para = document.createElement('button');
      const textnode = document.createTextNode('Apply');
      para.appendChild(textnode);
      para.setAttribute('id', 'applyBtnnn');
      para.setAttribute('class', 'btn-primary btn');
      const paramain = document.createElement('div');
      paramain.appendChild(para);
      paramain.setAttribute('class', 'aplybtndivs');
      document
        .querySelector('.scrollDivset.expanDropDown .picky__dropdown')
        .insertBefore(paramain, document.querySelector('.scrollDivset.expanDropDown .picky__dropdown').firstChild);
      document.addEventListener('click', (e) => {
        if (e.target && e.target.id === 'applyBtnnn') {
          this.onSelectionApplied();
        }
      });
    }
    if (arrayValue && arrayValue.length === 0 && document.querySelector('.scrollDivset.expanDropDown .picky__dropdown #applyBtnnn')) {
      document.querySelector('.scrollDivset.expanDropDown .picky__dropdown #applyBtnnn').setAttribute('disabled', '');
    } else {
      document.querySelector('.scrollDivset.expanDropDown .picky__dropdown #applyBtnnn').removeAttribute('disabled');
    }
  }

  /** Following method is used to used to form api request data */
  triggerDefaultCall = (selectedProps, repoarrayData, repoList) => {
    const allRepoParam = [];
    repoarrayData.forEach((element) => {
      allRepoParam.push(element.name);
    });
    const selected = {
      ...selectedProps
    };
    selected.repoName = allRepoParam.toString() === '' ? repoList[0].name : allRepoParam.toString();
    const {chartType} = this.state;
    this.setState({
      selectedFilterItems: selected,
      copyDateVal: { ...selected },
      copyRepo: selected.repoName,
      selectedHeaderValue: this.props.clickHeader,
      chartType
    });
    if (selected.from !== '') {
      this.setState({
        intinalStartDate: moment(this.commonFunc.changeOrgDateFormat(selected.from)).format('MM/DD/YYYY'),
        intinalEndDate: moment(this.commonFunc.changeOrgDateFormat(selected.upto)).format('MM/DD/YYYY')
      });
    }
    this.callApiTriggerFunction(this.props.clickHeader, selected);
  };

  /** Following method is used to handle expand view  */
  setModelShow = () => {
    const {setModelShow} = this.state;
    this.setState({ setModelShow: !setModelShow });
    this.api.axiosAPICancel(this.state.selectedHeaderValue);
    this.props.oncloseFun();
  };

  /** Following method is used to handle repo selection  */
  onSelectionApplied = () => {
    this.setState({ showButton: true});
    const stateVal = this.state;
    if (stateVal.arrayValue.length > 0) {
      const filterRepo = stateVal.selectedFilterItems;
      const reponame = [];
      stateVal.arrayValue.forEach((element) => {
        reponame.push(element.name);
      });
      if (filterRepo.from === '') {
        filterRepo.from = this.commonFunc.changeTimeFormat().subtract(1, 'day').utc().format();
        filterRepo.upto = this.commonFunc.changeEndTimeFormat().subtract(1, 'day').utc().format();
      }
      filterRepo.repoName = reponame.toString();
      if (JSON.stringify(stateVal.copyRepo) !== JSON.stringify(filterRepo.repoName)) {
        this.setState({
          copyDateVal: { ...filterRepo },
          copyRepo: filterRepo.repoName,
          selectedFilterItems: filterRepo
        });
        this.callApiTriggerFunction(this.state.selectedHeaderValue, filterRepo);
      }
    }
    document.querySelector('.containerRepo .expandBtnClose').click();
  };

  /** Following method is used to handle custom date range  apply button */
  setDateRangeFilter = (event, picker) => {
    const filterData = this.state.selectedFilterItems;
    filterData.from = this.commonFunc.changeTimeFormat(picker.startDate.format('YYYY-MM-DD')).utc().format();
    filterData.upto = this.commonFunc.changeEndTimeFormat(picker.endDate.format('YYYY-MM-DD')).utc().format();
    filterData.filtertype = 'Custom';
    if (JSON.stringify(filterData) !== JSON.stringify(this.state.copyDateVal)) {
      this.setState({
        selectedFilterItems: filterData,
        copyDateVal: { ...filterData },
        intinalStartDate: picker.startDate,
        intinalEndDate: picker.endDate
      });
      this.api.axiosAPICancel(this.state.selectedHeaderValue);
      this.callApiTriggerFunction(this.state.selectedHeaderValue, filterData);
    }
  };

  /** Following method is used to url and params formation */
  callApiTriggerFunction = (urlType, param) => {
    const params = {
      ...param,
      filter: true
    };
    let totalcommits = {};
    let urlName = '';
    switch (urlType) {
      case 'Visitors':
        urlName = 'VISITS';
        break;
      case 'Visits':
        urlName = 'VISITS';
        break;
      case 'Actions Taken':
        urlName = 'ACTION_TAKEN';
        break;
      case 'Watchers':
        urlName = 'WATCHES';
        break;
      case 'Forks':
        urlName = 'FORKS';
        break;
      case 'Starred':
        urlName = 'PEOPLE_STARRED';
        break;
      case 'Contributing Organization':
      case 'Commits':
      case 'Contributors':
        totalcommits = {
          ...params,
          since: params.from,
          until: params.upto
        };
        urlName = 'TOTAL_COMMITS';
        break;
      case 'Issues':
        totalcommits = {
          ...params,
          since: params.from,
          until: params.upto
        };
        urlName = 'TOTAL_ISSUES';
        break;
      case 'Pull Request':
        urlName = 'TOTAL_PR_MERGED';
        break;
      case 'Clones':
        urlName = 'TOTAL_CLONES';
        break;
      case 'Comments':
        totalcommits = {
          ...params,
          since: params.from,
          until: params.upto
        };
        urlName = 'ISSUE_COMMENTS';
        break;
      case 'Downloads':
        urlName = 'TOTAL_RELEASE_DOWNLOAD';
        break;
      default:
        urlName = 'VISITS';
        break;
    }
    this.setState({ showChart: false });
    if (urlName === 'TOTAL_COMMITS' || urlName === 'TOTAL_ISSUES' || urlName === 'ISSUE_COMMENTS') {
      delete totalcommits.from;
      delete totalcommits.upto;
      this.responseDataProcess(urlName, totalcommits, urlType);
    } else {
      this.responseDataProcess(urlName, params, urlType);
    }
  };

  /** Following method is used to call api amd process response */
  responseDataProcess = (urlType, params, urlTypehead) => {
    const responseProcess = this.api.callApiServiceMethod(urlType, params,urlTypehead);
    responseProcess.then((data) => {
      if (data.status === 'success' && data.statusCode === '200') {
        let dataPass = '';
        if (urlTypehead === 'Contributing Organization') {
          dataPass = data.data.contributionOrg;
        } else if (urlTypehead === 'Commits') {
          dataPass = data.data.commits;
        } else if (urlTypehead === 'Contributors') {
          dataPass = data.data.contributors;
        } else {
          dataPass = data.data;
        }
        this.setState({ expandViewResponse: dataPass });
        this.processChartData(dataPass, urlTypehead, this.state.dataFlowType[urlTypehead].selectedValue, this.state.viewTypeSelected);
      } else if(data.data) {
        this.setState({ showChart: true });
      }
    });
  };

  /** Following method is used to set view type */
  setViewType = (id) => {
    this.setState({ viewTypeSelected: id });
    this.processChartData(
      this.state.expandViewResponse,
      this.state.selectedHeaderValue,
      this.state.dataFlowType[this.state.selectedHeaderValue].selectedValue,
      id
    );
  };

  /** Following method is used to handle process data */
  processChartData = (dataPass, headerType, processType, viewaxisType) => {
    const stateVal = this.state;
    // based on condition week , mont day setting data
    const datares = viewaxisType === 'Month' ? dataPass.monthView : viewaxisType === 'Day' ? dataPass.dayView : dataPass.weekView;
    const datePush = [];
    const repoNameData = [];
    const repoNameGroup = [];
    let totalCount = 0;
    let totalCountCumm = 0;
    const colorsData = {};
    const cumDateData = {};
    // remove empty list repo's
    const dataSort = [];
    if (datares.length > 0) {
      datares.forEach((element, key) => {
        if (element.list.length > 0) {
          element.list.forEach((elementlist, listkey) => {
            const date =
              viewaxisType === 'Day'
                ? moment(this.commonFunc.changeOrgDateFormat(elementlist.date)).format('YYYY-MM-DD')
                : viewaxisType === 'Month'
                ? moment(this.commonFunc.changeOrgDateFormat(elementlist.startDate)).format('YYYY-MM-DD')
                : `${moment(this.commonFunc.changeOrgDateFormat(elementlist.startDate)).format('DD MMM YY')} - ${moment(
                    this.commonFunc.changeOrgDateFormat(elementlist.endDate)
                  ).format('DD MMM YY')}`;
            datares[key].list[listkey].date = date;
            if (!datePush.includes(date)) {
              datePush.push(date);
            }
            let count = '';
            if (processType === 'Cumulative') {
              count = stateVal.selectedHeaderValue === 'Visitors' ? elementlist.cumulativeUnique : elementlist.cumulative;
            } else if (processType === 'Unique') {
              count = elementlist.uniques;
            } else {
              /** for absolute assign value */
              count = elementlist.count;
            }
            const setCountVal = count === 0 ? date : count;
            dataSort.push({ repo: element.repo, date, count: setCountVal });
            cumDateData[element.repo] = processType === 'Cumulative' ? moment(this.commonFunc.changeOrgDateFormat(element.date)).format('DD MMM YY') : '';
            totalCount += count;
          });
        } else {
          delete datares[key];
        }
      });
      if (viewaxisType === 'Day') {
        datePush.sort((a, b) => Date.parse(a) / 1000 - Date.parse(b) / 1000);
      }

      datares.forEach((element) => {
        repoNameData.push([element.repo, ...datePush]);
        repoNameGroup.push(element.repo);
      });

      dataSort.forEach((element) => {
        repoNameData.forEach((repoData, repoKey) => {
          if (repoData[0] === element.repo) {
            const index = repoData.indexOf(element.date);
            repoNameData[repoKey][index] = element.count;
          }
        });
      });
      repoNameData.forEach((element, mainkey) => {
        element.forEach((inner, key) => {
          if (key !== 0 && typeof inner === 'string') {
            if (processType === 'Cumulative') {
              repoNameData[mainkey][key] = typeof repoNameData[mainkey][key - 1] === 'string' ? 0 : repoNameData[mainkey][key - 1];
            } else {
              repoNameData[mainkey][key] = 0;
            }
          }
        });
      });
    }
    repoNameGroup.forEach((element) => {
      const color = `rgb(${Math.round(Math.random() * 255)},${Math.round(Math.random() * 255)},${Math.round(Math.random() * 255)})`;
      colorsData[element] = color;
    });
    if (processType === 'Cumulative') {
      repoNameData.forEach((element) => {
        totalCountCumm += element[element.length - 1];
      });
    }

    totalCount = processType !== 'Cumulative' ? totalCount : totalCountCumm;
    const chartValues = {
      typeYear: viewaxisType,
      repoNameGroup,
      repoNameData,
      datePush,
      headerType,
      colorsData,
      cumDateData,
      viewType: processType,
      totalCount
    };
    this.setState({ chartValues, showChart: true });
  };

  /** Following method is used to handle repo selection  */
  selectMultipleOptionExpand = (value) => {
    // const arrayValue = [];
    // arrayValue.push(value);
    this.setState({ arrayValue : value, showButton:false});
  };

  /** Following method is used to handle metric selction  */
  setHeaderValue = (id) => {
    this.api.axiosAPICancel(this.state.selectedHeaderValue);
    this.setState({ selectedHeaderValue: id });
    this.callApiTriggerFunction(id, this.state.selectedFilterItems);
  };

  /** Following method is used to handle view type month/week/Day  */
  setViewDataType = (id) => {
    const { dataFlowType } = this.state;
    dataFlowType[this.state.selectedHeaderValue].selectedValue = id;
    this.setState({ dataFlowType });
    this.processChartData(this.state.expandViewResponse, this.state.selectedHeaderValue, id, this.state.viewTypeSelected);
  };

  /** Chart type line/Bar chart */
  setChartType = (id) => {
    this.setState({ chartType: id });
  };

  /** Download chart as image */
  download = () => {
    const nodeList = document.getElementById('chartDiv').querySelector('svg').querySelectorAll('.c3-chart .c3-chart-line path');
    const nodeList2 = document.getElementById('chartDiv').querySelector('svg').querySelectorAll('.c3-axis path');
    const nodeList3 = document.getElementById('chartDiv').querySelector('svg').querySelectorAll('.c3 .tick line');
    const nodeList4 = document.getElementById('chartDiv').querySelector('svg').querySelectorAll('.c3-legend-item text');
    const nodeList5 = document.getElementById('chartDiv').querySelector('svg').querySelectorAll('.c3-texts > .c3-text');
    const nodeList6 = document.getElementById('chartDiv').querySelector('svg').querySelectorAll('.c3-texts > .c3-text.remove');
    const lineGraph = Array.from(nodeList);
    const legendfont = Array.from(nodeList4);
    const cmbine = Array.from(nodeList2).concat(Array.from(nodeList3));
    /* eslint-disable no-param-reassign */
    lineGraph.forEach((element) => {
      element.style.fill = 'none';
    });
    nodeList5.forEach((element) => {
      element.style.fill = '#fff';
      element.style.transform = 'translateY(15px)';
    });
    nodeList6.forEach((element) => {
      element.style.fillOpacity = '0';
    });
    /* eslint-disable no-param-reassign */
    document.getElementById('chartDiv').querySelector('svg').style.backgroundColor = '#fff';
    document.getElementById('chartDiv').querySelector('svg').style.font = '10px sans-serif';
    if (document.getElementById('chartDiv').querySelector('svg .c3-legend-item text')) {
      document.getElementById('chartDiv').querySelector('svg .c3-legend-item text').style.font = '10px sans-serif';
      document.getElementById('chartDiv').querySelector('svg .c3-axis-x .c3-axis-x-label').style.transform = 'translate(0px,22px)';
    }

    /* eslint-disable no-param-reassign */
    cmbine.forEach((element) => {
      element.style.fill = 'none';
      element.style.stroke = 'black';
    });
    legendfont.forEach((element) => {
      element.style.font = '12px sans-serif';
    });
    /* eslint-disable no-param-reassign */
    const svg = document.getElementById('chartDiv').getElementsByTagName('svg')[0];
    const dateFileName=`${moment(this.commonFunc.changeOrgDateFormat(this.state.selectedFilterItems.from)).format('ll')} - ${moment(
      this.commonFunc.changeOrgDateFormat(this.state.selectedFilterItems.upto)).format('ll')}`;
    saveSvgAsPng.saveSvgAsPng(svg, `${this.state.selectedHeaderValue}(${dateFileName}).png`);
  };

  render() {
    const stateVal = this.state;
    return (
      <>
        <Modal
          className="unique-class mainModelDiv"
          show={stateVal.setModelShow}
          onHide={() => this.setModelShow(false)}
          dialogClassName="modal-90w"
          aria-labelledby="example-custom-modal-styling-title"
        >
          <Modal.Header closeButton />
          <Modal.Body>
            <Container>
              <Row>
                <Col sm={12} className="headersection">
                  {!stateVal.showButton ? (
                    <ButtonGroup aria-label="Basic example" className="buttonFull expandButton">
                      {stateVal.headerName.map((id) => (
                        <Button disabled key={id} onClick={() => this.setHeaderValue(id)} variant={stateVal.selectedHeaderValue === id ? 'underlineBtn' : ''}>
                          {id === 'Contributing Organization' ? 'Contributing Org' : id}
                        </Button>
                      ))}
                    </ButtonGroup>
                  ) : (
                    <ButtonGroup aria-label="Basic example" className="buttonFull expandButton">
                      {stateVal.headerName.map((id) => (
                        <Button key={id} onClick={() => this.setHeaderValue(id)} variant={stateVal.selectedHeaderValue === id ? 'underlineBtn' : ''}>
                          {id === 'Contributing Organization' ? 'Contributing Org' : id}
                        </Button>
                      ))}
                    </ButtonGroup>
                  )}
                </Col>
              </Row>
              <Row className="containerRepo">
                <Col sm={3} className="scrollDivset expanDropDown">
                  <div>
                    <Picky
                      value={stateVal.arrayValue}
                      options={stateVal.repoList}
                      onChange={this.selectMultipleOptionExpand}
                      open={false}
                      valueKey="id"
                      labelKey="name"
                      multiple
                      includeSelectAll
                      includeFilter
                      placeholder="No Repo selected"
                      allSelectedPlaceholder="All Repo selected"
                      manySelectedPlaceholder="You have selected %s Repo"
                      dropdownHeight={300}
                      // clearFilterOnClose
                      filterPlaceholder="Search..."
                      buttonProps={{
                        className: !stateVal.showButton ? 'buttonbgcolor expandBtnClose' : 'buttonbgcolor expandBtnClose'
                      }}
                      render={({ isSelected, item, selectValue, labelKey, valueKey }) => {
                        return (
                          <>
                            <span className="customDiv" id={item[valueKey]}>
                              <li
                                className={isSelected ? 'selected' : ''} // required to indicate is selected
                                key={item[valueKey]} // required
                                onClick={() => selectValue(item)}
                              >
                                <input type="checkbox" checked={isSelected} readOnly />
                                <span className="dropdownwidth" style={{ fontSize: '14px' }}>
                                  {item[labelKey]}
                                </span>
                              </li>
                            </span>
                            <div className="applyButtonClass">
                              {stateVal.arrayValue.length !== 0 ? (
                                <Button onClick={() => this.onSelectionApplied()}>Apply</Button>
                              ) : (
                                <Button disabled onClick={() => this.onSelectionApplied()}>
                                  Apply
                                </Button>
                              )}
                            </div>
                          </>
                        );
                      }}
                    />
                  </div>
                </Col>
                <Col sm={2} />
                <Col sm={3} className="alignDiv daterangecalendar pointershow">
                  <div className="">
                    <DateRangePickerExpand
                      key="Custom"
                      initialSettings={{
                        minDate: moment(stateVal.allRangeDateOrg).format('MM/DD/YYYY'),
                        startDate: stateVal.intinalStartDate,
                        endDate: stateVal.intinalEndDate,
                        maxDate: stateVal.maxEndDate,
                        showDropdowns: true,
                        parentEl: '.unique-class',
                        opens: 'left'
                      }}
                      onApply={(event, picker) => this.setDateRangeFilter(event, picker)}
                    >
                      <span className={!stateVal.showButton ? 'dateClickView pointershow btndisable':'dateClickView pointershow'}>
                        <span className="commonBlueColortext dateFont">
                          {moment(stateVal.selectedFilterItems.from).format('ll')}
                          {' '}
                          -
                          {moment(stateVal.selectedFilterItems.upto).format('ll')}
                        </span>
                        <span className="calendarIcon">
                          <img src={calender} alt="Info" width="18" />
                        </span>
                      </span>
                    </DateRangePickerExpand>
                  </div>
                </Col>
                <Col sm={2} className="alignDiv viewas">
                  <div className="repoCount">
                    <span className="totaHeade">View as : </span>
                    {!stateVal.showChart ? (
                      <DropdownButton disabled id="dropdown-basic-button" title={stateVal.viewTypeSelected} />
                    ) : (
                      <DropdownButton id="dropdown-basic-button" title={stateVal.viewTypeSelected} onSelect={(evt) => this.setViewType(evt)}>
                        {stateVal.viewType.map((id) =>
                          stateVal.viewTypeSelected === id ? (
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
                <Col sm={2} className="alignDiv viewBy">
                  <div className="repoCount">
                    <span className="totaHeade">View By : </span>
                    {!stateVal.showChart ? (
                      <DropdownButton disabled id="dropdown-basic-button" title={stateVal.dataFlowType[stateVal.selectedHeaderValue].selectedValue} />
                    ) : (
                      <DropdownButton
                        id="dropdown-basic-button"
                        title={stateVal.dataFlowType[stateVal.selectedHeaderValue].selectedValue}
                        onSelect={(evt) => this.setViewDataType(evt)}
                      >
                        {stateVal.dataFlowType[stateVal.selectedHeaderValue].dataShowType.map((id) =>
                          stateVal.dataFlowType[stateVal.selectedHeaderValue].selectedValue === id ? (
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
              <Row className="chartContainer">
                <Col sm={4}>
                  {/* <div className="repoCount">
                    <span className="totaHeade">Total Counts : </span>
                    <span className="totaCount">
                      {'  '}
                      {stateVal.totalCount}
                    </span>
                    <span />
                  </div> */}
                </Col>
                <Col sm={4} />
                <Col sm={4} className="chartype">
                  <div className="repoCount">
                    <span className="totaHeade">Chart Type : </span>
                    {!stateVal.showChart ? (
                      <DropdownButton disabled id="dropdown-basic-button" title={stateVal.chartType} />
                    ) : (
                      <DropdownButton id="dropdown-basic-button" title={stateVal.chartType} onSelect={(evt) => this.setChartType(evt)}>
                        {stateVal.chartTypeArray.map((id) =>
                          stateVal.chartType === id ? (
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
                  <div className="downloadicon">
                    {!stateVal.showChart ? (
                      <img src={donwload} alt="Paris" width="30" height="28" />
                    ) : (
                      <img className="pointershow" onClick={() => this.download()} src={donwload} alt="Paris" width="30" height="28" />
                    )}
                  </div>
                </Col>
                <Col sm={12} className="chartDiv" id="chartDiv">
                  {!stateVal.showChart ? (
                    <CommonChartLoader />
                  ) : stateVal.chartType === 'Line Chart' ? (
                    <LineChart dataPass={stateVal.chartValues} />
                  ) : (
                    <BarChart dataPass={stateVal.chartValues} />
                  )}
                </Col>
              </Row>
            </Container>
          </Modal.Body>
        </Modal>
      </>
    );
  }
}

export default ExpandView;
