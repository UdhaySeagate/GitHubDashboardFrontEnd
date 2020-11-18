/* eslint-disable react/no-unused-state */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable no-nested-ternary */
import React, { Component } from 'react';
import './Filter.css';
import { Row, Col, Container, ButtonGroup, Button } from 'react-bootstrap';
import Loader from 'react-loader-spinner';
import moment from 'moment';
import DateRangePicker from 'react-bootstrap-daterangepicker';
import { Picky } from 'react-picky';
import Header from '../Header/Header';
import ApiServiceCall from '../../serviceCall/apiServiceCall';
import ErrorData from '../commonLoader/ErrorData';
import 'react-picky/dist/picky.css'; // Include CSS
import ExpandView from '../ExpandView/ExpandView';
import CommonFunction from '../../serviceCall/commonFunction';
import calender from '../../assets/calendar.png';
import MiddleViewController from '../Controller/MiddlewareController';

class Filter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      repoList: [],
      copyRepo: null,
      copyDateVal: null,
      pageView: ['Dashboard', 'Grid View'],
      pageViewSelected: 'Dashboard',
      filterDropDown: ['Day', 'Week', 'Month', 'Year', 'All'],
      selectedFilterItems: {
        repoName: '',
        from: '',
        upto: '',
        filtertype: 'Month'
      },
      selectedDateRangeValue: 'Month',
      showCharts: false,
      showErrorMessage: '',
      showButton: true,
      allRangeDateOrg: '',
      intinalEndDate: moment().subtract(1, 'day').format('MM/DD/YYYY'),
      intinalStartDate: moment().subtract(1, 'day').format('MM/DD/YYYY'),
      maxEndDate: moment().subtract(1, 'day').format('MM/DD/YYYY'),
      arrayValue: [],
      showFilter: false,
      showModal: false,
      activeHeader: ''
    };
    /** Object is used to call third party releadted call */
    this.api = new ApiServiceCall();
    /** Object is used to call common function  */
    this.commonFunc = new CommonFunction();
  }

  /** Life Cycle of react  */
  componentDidMount() {
    this.getRepoList();
  }

  /** Life Cycle of react  */
  componentDidUpdate() {
    const { arrayValue } = this.state;
    if (document.querySelector('.filterDiv .picky__dropdown') && !document.querySelector('.filterDiv .picky__dropdown > .aplybtndiv')) {
      const para = document.createElement('button');
      const textnode = document.createTextNode('Apply');
      para.appendChild(textnode);
      para.setAttribute('id', 'applyBtnn');
      para.setAttribute('class', 'btn-primary btn');
      const paramain = document.createElement('div');
      paramain.appendChild(para);
      paramain.setAttribute('class', 'aplybtndiv');
      document.querySelector('.filterDiv .picky__dropdown').insertBefore(paramain, document.querySelector('.filterDiv .picky__dropdown').firstChild);
      document.addEventListener('click', (e) => {
        if (e.target && e.target.id === 'applyBtnn') {
          this.onSelectionApplied();
        }
      });
    }
    if (arrayValue && arrayValue.length === 0 && document.querySelector('.filterDiv .picky__dropdown #applyBtnn')) {
      document.querySelector('.filterDiv .picky__dropdown #applyBtnn').setAttribute('disabled', '');
    } else if (arrayValue.length > 0) {
      document.querySelector('.filterDiv .picky__dropdown #applyBtnn').removeAttribute('disabled');
    }
  }

  /** Function is used to sort the repo name alphabtes wise */
  compare = (a, b) => {
    // Use toUpperCase() to ignore character casing
    const nameA = a.name.toUpperCase();
    const nameB = b.name.toUpperCase();
    let comparison = 0;
    if (nameA > nameB) {
      comparison = 1;
    } else if (nameA < nameB) {
      comparison = -1;
    }
    return comparison;
  };

  /** Method is used to retrive the repo
   * Need to filter out the repo with starting with cortx need to select default on load
   */
  getRepoList = () => {
    const response = this.api.callApiServiceMethod('REPO_LIST');
    response.then((data) => {
      const repoData = [];
      if (data.status === 'success' && data.statusCode === '200') {
        if (data.data.length > 0) {
          data.data.forEach((element) => {
            repoData.push({ name: element.name, label: element.name, id: element.name, checked: true });
          });
          const responseorg = this.api.callApiServiceMethod('GET_ORG');
          responseorg.then((dataorg) => {
            if (dataorg.status === 'success' && dataorg.statusCode === '200') {
              const allRepoParam = [];
              const cortxRepo = [];
              const cortxNotRepo = [];
              const repoConfig = ['cortx'];
              repoData.forEach((element) => {
                /** Once response recieved processing to find out repo start with CORTX */
                if (repoConfig.includes(element.name)) {
                  allRepoParam.push(element.name);
                  cortxRepo.push(element);
                } else {
                  cortxNotRepo.push(element);
                }
              });
              const repoDataMerged = cortxRepo.concat(cortxNotRepo);
              repoDataMerged.sort(this.compare);
              const { selectedFilterItems } = this.state;
              selectedFilterItems.repoName = allRepoParam.length === 0 ? repoDataMerged[0].name.toString() : allRepoParam.toString();
              const fromval = this.commonFunc.changeTimeFormat().subtract(1, 'day').utc().format();
              selectedFilterItems.from = moment(fromval).subtract(1, 'months').utc().format();
              selectedFilterItems.upto = this.commonFunc.changeEndTimeFormat().subtract(1, 'day').utc().format();
              if (this.commonFunc.getNoofDaysBetween(this.commonFunc.changeTimeFormat(dataorg.data.created).utc().format(), selectedFilterItems.from) < 0) {
                selectedFilterItems.from = this.commonFunc.changeTimeFormat(dataorg.data.created).utc().format();
              }
              this.setState({
                arrayValue: cortxRepo.length === 0 ? repoDataMerged.slice(0, 1) : cortxRepo,
                allRangeDateOrg: this.commonFunc.changeOrgDateFormat(dataorg.data.created),
                repoList: repoDataMerged,
                showCharts: true,
                selectedFilterItems,
                copyRepo: selectedFilterItems.repoName,
                showFilter: true,
                copyDateVal: { ...selectedFilterItems }
              });
            } else {
              this.setState({ showErrorMessage: dataorg.data ? dataorg.data : 'Sorry, No org details to show all date range filter', showCharts: true });
            }
          });
        } else {
          this.setState({ showErrorMessage: 'Sorry, No Repo/Project under the organization', showCharts: true });
        }
      } else {
        this.setState({ showErrorMessage: data.data ? data.data : 'Sorry , we are unable to process your request,kindly contact admin', showCharts: true });
      }
    });
  };

  /** Method is used to handle in date range picker on click of apply */
  setDateRangeFilter = (event, picker) => {
    const filterData = this.state.selectedFilterItems;
    filterData.from = this.commonFunc.changeTimeFormat(picker.startDate.format('YYYY-MM-DD')).utc().format();
    filterData.upto = this.commonFunc.changeEndTimeFormat(picker.endDate.format('YYYY-MM-DD')).utc().format();
    filterData.filtertype='Custom';
    if (JSON.stringify(filterData) !== JSON.stringify(this.state.copyDateVal)) {
      this.setState({
        selectedFilterItems: filterData,
        copyDateVal: { ...filterData },
        selectedDateRangeValue:'Custom'
      });
    }
  };

  /** Method is used to handle range selection  */
  setDateRange = (dateRange) => {
    const filterData = { ...this.state.selectedFilterItems };
    const { allRangeDateOrg } = this.state;
    if (this.state.selectedDateRangeValue !== dateRange) {
      if (dateRange !== 'Custom') {
        this.setState({ selectedDateRangeValue: dateRange });
        const returnSetData = this.commonFunc.setDateRange(dateRange, filterData, allRangeDateOrg);
        this.setState({
          selectedFilterItems: returnSetData,
          copyDateVal: { ...returnSetData },
        });
      }
    }
  };

  /** Method is used to handle open model props value */
  showExpandView = (clickHeader) => {
    const { showModal } = this.state;
    this.setState({ showModal: !showModal, activeHeader: clickHeader });
  };

  /**
   * Function is used in custom date range on click apply it will get triggered
   */
  onSelectionApplied = () => {
    this.setState({ showFilter: true,showButton: true });
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
      }
    }
    document.querySelector('.repoDropDown .buttonbgcolor').click();
  };

  /** Method is used to handle close model props value */
  closeExpandView = () => {
    this.showExpandView();
  };

  /** Method is used to handle repo selection */
  selectMultipleOption = (value) => {
    // const arrayValue = [];
    // arrayValue.push(value);
    this.setState({ arrayValue : value, showButton: false });
  };

  /** Method is used to handle view selection either Dashboard view or grid view */
  setPageView = (id) => {
    this.setState({ pageViewSelected: id });
  };

  /** Following method  is used to handle api call and response process */
  responseDataProcess = (url, params, stateName) => {
    this.api.axiosAPICancel(stateName);
    const responseProcess = this.api.callApiServiceMethod(url, params, stateName);
    responseProcess.then((data) => {
      this.setState({ [stateName]: data });
    });
  };

  /** react method */
  render() {
    const stateVal = this.state;
    return (
      <Container fluid>
        {stateVal.showModal && (
          <ExpandView
            selectedRepoArray={stateVal.arrayValue}
            selectedData={stateVal.selectedFilterItems}
            clickHeader={stateVal.activeHeader}
            oncloseFun={this.closeExpandView}
            showModal={stateVal.showModal}
            repoData={stateVal.repoList}
            orgDate={stateVal.allRangeDateOrg}
          />
        )}
        <div>
          {!stateVal.showCharts ? (
            <div className="loaderDiv">
              <Loader type="ThreeDots" color="#00BFFF" height={60} width={50} />
              <div>Please wait ...</div>
            </div>
          ) : stateVal.showErrorMessage === '' ? (
            <div>
              <div className="fixedHeader">
                <Header />
                <Row className="filterDiv">
                  <Col sm={3} className="repoDropDown scrollDivset ">
                    <div>
                      <Picky
                        value={stateVal.arrayValue}
                        options={stateVal.repoList}
                        onChange={this.selectMultipleOption}
                        open={false}
                        valueKey="id"
                        labelKey="name"
                        multiple
                        includeSelectAll
                        includeFilter
                        placeholder="No Repo selected"
                        allSelectedPlaceholder="All Repo selected"
                        manySelectedPlaceholder="You have selected %s Repo"
                        dropdownHeight={400}
                      // clearFilterOnClose
                        filterPlaceholder="Search..."
                        buttonProps={{
                        className: 'buttonbgcolor'
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
                                <span style={{ fontSize: '14px' }}>{item[labelKey]}</span>
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
                  <Col sm={9} className="dateRangeMain">
                    <div className="ranges daterange">
                      <DateRangePicker
                        key="Custom"
                        initialSettings={{
                        minDate: moment(stateVal.allRangeDateOrg).format('MM/DD/YYYY'),
                        startDate: moment(stateVal.selectedFilterItems.from).format('MM/DD/YYYY'),
                        endDate: moment(stateVal.selectedFilterItems.upto).format('MM/DD/YYYY'),
                        maxDate: stateVal.maxEndDate,
                        showDropdowns: true,
                        autoUpdateInput: true
                      }}
                        onApply={(event, picker) => this.setDateRangeFilter(event, picker)}
                      >
                        <span className={!stateVal.showButton ? 'dateClickView pointershow btndisable':'dateClickView pointershow'}>
                          <span className="commonBlueColortext dateFont">
                            {moment(stateVal.selectedFilterItems.from).format('ll')}
                            {' '}
                            -
                            {' '}
                            {moment(stateVal.selectedFilterItems.upto).format('ll')}
                          </span>
                          <span className="calendarIcon">
                            <img src={calender} onClick={() => this.setDateRange('Custom')} alt="Info" width="18" />
                          </span>
                        </span>
                      </DateRangePicker>
                      <ButtonGroup aria-label="Basic example" className="buttonFull">
                        {stateVal.filterDropDown.map((id) =>
                        !stateVal.showButton ? (
                          <Button
                            key={id}
                            disabled
                            className="buttonbackground"
                            onClick={() => this.setDateRange(id)}
                            variant={stateVal.selectedDateRangeValue === id ? 'primary' : 'light'}
                          >
                            {id}
                          </Button>
                        ) : (
                          <Button
                            key={id}
                            className="buttonbackground"
                            onClick={() => this.setDateRange(id)}
                            variant={stateVal.selectedDateRangeValue === id ? 'primary' : 'light'}
                          >
                            {id}
                          </Button>
                        )
                      )}
                      </ButtonGroup>
                    </div>
                    <div className="ranges viewRanges">
                      <ButtonGroup aria-label="Basic example" className="buttonFull">
                        {stateVal.pageView.map((id) => (
                        !stateVal.showButton ? (
                          <Button
                            key={id}
                            disabled
                            className="buttonbackground"
                            onClick={() => this.setPageView(id)}
                            variant={stateVal.pageViewSelected === id ? 'primary' : 'light'}
                          >
                            {id}
                          </Button>
                      )
                        : (
                          <Button
                            key={id}
                            className="buttonbackground"
                            onClick={() => this.setPageView(id)}
                            variant={stateVal.pageViewSelected === id ? 'primary' : 'light'}
                          >
                            {id}
                          </Button>
                      )
                      ))}
                      </ButtonGroup>
                    </div>
                  </Col>
                </Row>
              </div>
              <div className="topfix">
                <MiddleViewController
                  reponseChartData={stateVal}
                  orgDate={stateVal.allRangeDateOrg}
                  selectedDateRangeValue={stateVal.selectedDateRangeValue}
                  selectedFilterItems={stateVal.selectedFilterItems}
                  allRangeDateOrg={stateVal.allRangeDateOrg}
                  pageView={stateVal.pageViewSelected}
                  callShowModel={this.showExpandView}
                />
              </div>
            </div>
          ) : (
            <ErrorData errorMessage={stateVal.showErrorMessage} />
          )}
        </div>
      </Container>
    );
  }
}
export default Filter;
