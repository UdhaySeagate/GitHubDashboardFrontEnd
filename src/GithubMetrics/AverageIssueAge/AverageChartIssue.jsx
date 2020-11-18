/* eslint-disable no-undef */
/* eslint-disable no-nested-ternary */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React from 'react';
import c3 from 'c3';
import 'c3/c3.css';
import moment from 'moment';
import saveSvgAsPng from 'save-svg-as-png';
import donwload from '../../assets/download.png';

const AverageChartIssue = ({ dataPass,dateFileName }) => {

  /**
   * Method is used to convert the hrs into days
   * there are 3 logic played over here to handle less than 24 ,1 or lesser
   */
  const convertToDays = (avgdays, avgmins) => {
    let hrs;
    let labelHrs;
    if (avgdays >= 24) {
      hrs = Math.round((avgdays / 24 + Number.EPSILON) * 100) / 100;
      labelHrs = 'Days';
    } else if (avgdays < 1) {
      hrs = Math.round((avgmins + Number.EPSILON) * 100) / 100;
      labelHrs = 'Min';
    } else {
      hrs = Math.round((avgdays + Number.EPSILON) * 100) / 100;
      labelHrs = 'Hrs';
    }
    const obj = {
      hrs,
      labelHrs
    };
    return obj;
  };

  /** Download chart as image */
  const download = () => {
    const nodeList = document.getElementById('averageIssueChart').querySelector('svg').querySelectorAll('.c3-chart .c3-chart-line path');
    const nodeList2 = document.getElementById('averageIssueChart').querySelector('svg').querySelectorAll('.c3-axis path');
    const nodeList3 = document.getElementById('averageIssueChart').querySelector('svg').querySelectorAll('.c3 .tick line');
    const nodeList4 = document.getElementById('averageIssueChart').querySelector('svg').querySelectorAll('.c3-legend-item text');
    const nodeList5 = document.getElementById('averageIssueChart').querySelector('svg').querySelectorAll('.c3-texts > .c3-text');
    const nodeList6 = document.getElementById('averageIssueChart').querySelector('svg').querySelectorAll('.c3-texts > .c3-text.remove');
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
    document.getElementById('averageIssueChart').querySelector('svg').style.backgroundColor = '#fff';
    document.getElementById('averageIssueChart').querySelector('svg').style.font = '10px sans-serif';
    if (document.getElementById('averageIssueChart').querySelector('svg .c3-legend-item text')) {
      document.getElementById('averageIssueChart').querySelector('svg .c3-legend-item text').style.font = '10px sans-serif';
      document.getElementById('averageIssueChart').querySelector('svg .c3-axis-x .c3-axis-x-label').style.transform = 'translate(0px,22px)';
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
    const svg = document.getElementById('averageIssueChart').getElementsByTagName('svg')[0];
    saveSvgAsPng.saveSvgAsPng(svg, `Issue Closed Average(${dateFileName}).png`);
  };

  /** React life cycle methid */
  React.useEffect(() => {
    const datpu = [...dataPass.dates];
    const arrpu = [0];
    if (datpu.length > 14) {
      const len = Math.round(datpu.length / 14);
      let nm = 0;
      while(nm < datpu.length) {
        nm += len;
        arrpu.push(nm);
      }
    }
    c3.generate({
      bindto: '#averageIssueChart',
      data: {
        x: 'x',
        columns: [
          ['x', ...dataPass.dates],
          ['Avg Issue Closed in days', ...dataPass.averageClosed]
        ],
        type: 'line',
        colors: { 'Avg Issue Closed in days': '#AE5AC3' }
      },
      size: {
        height: 340
      },
      padding: {
        right: 45,
        bottom: 60
      },
      axis: {
        y: {
          label: {
            text: 'Days',
            position: 'outer-middle'
          },
          tick: {
            format(d) {
              return Math.round((d + Number.EPSILON) * 100) / 100;
            }
          },
          type: 'category'
        },
        x: {
          type: 'category',
          tick: {
            centered: true,
            format(e) {
              let txxt = '';
              if (datpu.length > 35) {                
                if (arrpu.indexOf(e) >= 0) {
                  txxt = dataPass.typeYear === 'Month'
                  ? moment(dataPass.dates[e]).format('MMM YYYY')
                  : dataPass.typeYear === 'Week'
                    ? dataPass.dates[e]
                    : moment(dataPass.dates[e]).format('DD MMM YY');
                }                
              } else {
                txxt = dataPass.typeYear === 'Month'
                ? moment(dataPass.dates[e]).format('MMM YYYY')
                : dataPass.typeYear === 'Week'
                  ? dataPass.dates[e]
                  : moment(dataPass.dates[e]).format('DD MMM YY');
              }
              return txxt;
            }
          },
          label: {
            text: 'Date Range',
            position: 'outer-center'
          }
        }
      },
      tooltip: {
        contents(d) {
          let { date, hrs, count, lableText, labelHrs, hrslabel } = '';
          date = dataPass.typeYear === 'Month'
            ? moment(dataPass.dates[d[0].index]).format('MMM YYYY')
            : dataPass.typeYear === 'Week'
              ? dataPass.dates[d[0].index]
              : moment(dataPass.dates[d[0].index]).format('DD MMM YY');
          hrslabel =
            dataPass.averageData[d[0].index] !== 0 ? convertToDays(dataPass.averageData[d[0].index].avgdays, dataPass.averageData[d[0].index].avgmins) : 0;
          hrs = hrslabel.hrs ? hrslabel.hrs : 0;
          count = dataPass.issueClosedCount[d[0].index];
          lableText = 'Closed';
          labelHrs = hrslabel.hrs ? hrslabel.labelHrs : '';
          const cont = `<div class="toolTip"><span>Date: ${date} </span><span>Avg Issue ${lableText} : ${hrs} ${labelHrs} </span><span>Issue ${lableText} Count : ${count}</span></div>`;
          return cont;
        }
      }

    });
    if (datpu.length > 24) {
      const datList = document.querySelectorAll('#averageIssueChart .c3-axis.c3-axis-x > .tick');
      datList.forEach((el, inx) => {
        if (arrpu.indexOf(inx) < 0) {
          // eslint-disable-next-line no-param-reassign
          el.style.display = 'none';
        }
      });
    } 
  }, [dataPass]);

  return (
    <div className="">
      <div className="dnloadimg">
        <img className="pointershow" onClick={() => download()} src={donwload} alt="Paris" width="30" height="28" />
      </div>
      <div id="averageIssueChart" />
    </div>
  );
};

export default AverageChartIssue;
