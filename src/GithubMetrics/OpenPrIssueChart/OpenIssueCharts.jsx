/* eslint-disable no-param-reassign */
/* eslint-disable react/no-did-update-set-state */
/* eslint-disable no-nested-ternary */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React, { useState, useEffect } from 'react';
import './OpenPrIssueChart.css';
import c3 from 'c3';
import { Row, Col, DropdownButton, Dropdown } from 'react-bootstrap';
import saveSvgAsPng from 'save-svg-as-png';
import donwload from '../../assets/download.png';
import CommonChartLoader from '../commonLoader/commonChartsLoader';
import CommonFunction from '../../serviceCall/commonFunction';
import CommonChartsNoData from '../commonLoader/commonChartsNoData';
import 'c3/c3.css';

/**
 * Following JSX to handle open issue chart
 */
const OpenIssueCharts = ({ chartData, typeView, charType,dateFileName }) => {
  const commonObj = new CommonFunction();

  /** Following array used for view as month/day/week  */
  const viewType = ['Month', 'Week', 'Day'];
  
  /** Following state variable is used to handle view type selection like month/day/week  */
  const [viewTypeSelected, setViewTypedata] = useState(typeView);

  /** Download chart as image */
  const download = () => {
    const nodeList = document.getElementById('barchart1').querySelector('svg').querySelectorAll('.c3-chart .c3-chart-line path');
    const nodeList2 = document.getElementById('barchart1').querySelector('svg').querySelectorAll('.c3-axis path');
    const nodeList3 = document.getElementById('barchart1').querySelector('svg').querySelectorAll('.c3 .tick line');
    const nodeList4 = document.getElementById('barchart1').querySelector('svg').querySelectorAll('.c3-legend-item text');
    const nodeList5 = document.getElementById('barchart1').querySelector('svg').querySelectorAll('.c3-texts > .c3-text');
    const nodeList6 = document.getElementById('barchart1').querySelector('svg').querySelectorAll('.c3-texts > .c3-text.remove');
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
    document.getElementById('barchart1').querySelector('svg').style.backgroundColor = '#fff';
    document.getElementById('barchart1').querySelector('svg').style.font = '10px sans-serif';
    if (document.getElementById('barchart1').querySelector('svg .c3-legend-item text')) {
      document.getElementById('barchart1').querySelector('svg .c3-legend-item text').style.font = '10px sans-serif';
      document.getElementById('barchart1').querySelector('svg .c3-axis-x .c3-axis-x-label').style.transform = 'translate(0px,22px)';
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
    const svg = document.getElementById('barchart1').getElementsByTagName('svg')[0];
    saveSvgAsPng.saveSvgAsPng(svg, `Issues Open(${dateFileName}).png`);
  };

  /** React life cycle method to re-render in case of value changes */
  useEffect(() => {
    if (chartData.chartValues.viewType) {
      setViewTypedata(chartData.chartValues.viewType);
    }
    let datas = {}
    if (chartData.apiCallStatus) {
      const datpu = [...chartData.chartValues.tickVal];
      const arrpu = [0];
      if (datpu.length > 24) {
        const len = Math.round(datpu.length / 14);
        let nm = 0;
        while(nm < datpu.length) {
          nm += len;
          arrpu.push(nm);
        }
      }
      datas = {
        x: 'x',
        columns: [
          ['x', ...chartData.chartValues.tickVal],
          [chartData.chartValues.labelTxt, ...chartData.chartValues.chartDataShow]
        ],
        type: 'bar'
      };
      c3.generate({
        bindto: '#barchart1',
        data: datas,
        padding: {
          right: 45,
          bottom: 40
        },
        axis: {
          y: {
            label: {
              text: 'Issues',
              position: 'outer-middle'
            },
            tick: {
              format(d) {
                // eslint-disable-next-line radix
                return (parseInt(d) === d) ? d : null;
              }
            },
            type: 'category'
          },
          x: {
            type: 'category',
            tick: {
              centered: true
            },
            label: {
              text: '',
              position: 'outer-center'
            }
          }
        },
        size: {
          width: 600,
          height: 340
        },
        onrendered() {
          const selectorValue = document.querySelectorAll(`.issuechartprocess svg .c3-axis.c3-axis-y > .tick text tspan`);
          const selectedVal = Array.from(selectorValue);
          selectedVal.forEach((element,index) => {
            if(element.innerHTML === ''){
              document.querySelector(`.issuechartprocess svg .c3-axis.c3-axis-y > .tick:nth-of-type(${index+1}) line`).classList.add('decimalValeHide');
            }
          });
        }
      });
      if (datpu.length > 24) {
        const datList = document.querySelectorAll('#barchart1 .c3-axis.c3-axis-x > .tick');
        datList.forEach((ele, inx) => {
          if (arrpu.indexOf(inx) < 0) {
            ele.style.display = 'none';
          }
        });
      }      
    }
  }, [chartData.apiCallStatus, chartData.chartValues.viewType]);

  /** Followin method is used to handle the view type selction id=== month/day/week */
  const setViewType = (id) => {
    setViewTypedata(id);
    const chartDatProcess = commonObj.processOpenPRandIssue(chartData.responseFullData, charType, id);
    if (chartDatProcess) {
      chartData.apiCallStatus = chartDatProcess.apiCallStatus;
      chartData.totalCount = chartDatProcess.totalCount;
      chartData.showErrorMessage = chartDatProcess.showErrorMessage;
      chartData.chartValues = chartDatProcess.chartValues;
    }
  }

  return (
    <div className="openprissschart issuechartprocess">
      <Row className="headerdiv">
        <Col sm={12} className="daterangepr">
          <div>
            {chartData.apiCallStatus ? (
              <div className="total-count">
                <span className="totalCountLable">Total Count: </span>
                <span className="commonBlueColortext">{chartData.totalCount}</span>
              </div>
            ) : (
              <div />
              )}
            <div className="averCountDiv viewData">
              <span className="totaHeade viewData">View as : </span>
            </div>
            {!chartData.apiCallStatus ? (
              <DropdownButton disabled id="dropdown-basic-button" title={viewTypeSelected} />
            ) : (
              <DropdownButton id="dropdown-basic-button" title={viewTypeSelected} onSelect={(evt) => setViewType(evt)}>
                {viewType.map((id) =>
                    viewTypeSelected === id ? (
                      <Dropdown.Item active eventKey={id} key={`res${id}`}>
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
      <Row className="chartdiv">
        <Col className="chartdata">
          {!chartData.apiCallStatus ? (
            <CommonChartLoader />
          ) : chartData.showErrorMessage === '' ? (
            <div>
              <div className="dnloadimg">
                <img className="pointershow" onClick={() => download()} src={donwload} alt="Paris" width="30" height="28" />
              </div>
              <div id="barchart1" />
            </div>
          ) : (
            <div className="">
              <CommonChartsNoData />
            </div>
              )}
        </Col>
      </Row>
    </div>
  );

}

export default OpenIssueCharts;