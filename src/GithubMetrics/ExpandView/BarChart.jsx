/* eslint-disable no-nested-ternary */
import React from 'react';
import 'c3/c3.css';
import moment from 'moment';
import './BarChart.css';
import c3 from 'c3';

const BarChart = ({ dataPass }) => {
  React.useEffect(() => {
    const datpu = [...dataPass.datePush];
    const arrpu = [0];
    if (datpu.length > 35) {
      const len = Math.round(datpu.length / 35);
      let nm = 0;
      while(nm < datpu.length) {
        nm += len;
        arrpu.push(nm);
      }
    }
    c3.generate({
      bindto: '#barchartexpand',
      data: {
        x: 'x',
        columns: [['x', ...dataPass.datePush], ...dataPass.repoNameData],
        type: 'bar',
        order: false,
        colors: dataPass.colorsData,
        groups: [[...dataPass.repoNameGroup]],
        labels: {
          format(v) {
            let retn;
            if (v === 0) {
              retn = '';
            } else {
              retn = v;
            }
            return retn;
          }
        }
      },
      bar: {
        width: {
          ratio: dataPass.repoNameData.length < 5 ? 0.1 : 0.3 // this makes bar width 50% of length between ticks
        },
        space: 0
      },
      size: {
        height: 300,
        width:1100
      },
      axis: {
        y: {
          label: {
            text: dataPass.headerType,
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
          tick: {
            centered: true,
            format(e) {
              let txxt = '';
              if (datpu.length > 35) {                
                if (arrpu.indexOf(e) >= 0) {
                  txxt = dataPass.typeYear === 'Month'
                  ? moment(dataPass.datePush[e]).format('MMM YYYY')
                  : dataPass.typeYear === 'Week'
                  ? dataPass.datePush[e]
                  : moment(dataPass.datePush[e]).format('DD MMM YY');
                }                
              } else {
                txxt = dataPass.typeYear === 'Month'
                ? moment(dataPass.datePush[e]).format('MMM YYYY')
                : dataPass.typeYear === 'Week'
                ? dataPass.datePush[e]
                : moment(dataPass.datePush[e]).format('DD MMM YY');
              }
              return txxt;
            }
          },
          label: {
            text: 'Date Range',
            position: 'outer-center'
          },
          type: 'category'
        }
      },
      padding: {
        top: 20,
        right: 20,
        bottom: 20
      },
      tooltip: {
        contents(d, defaultTitleFormat, defaultValueFormat, color) {
          let tableHeader = '';
          let totalHeader = 0;
          tableHeader =
            dataPass.typeYear === 'Month'
              ? moment(dataPass.datePush[d[0].index]).format('MMM YYYY')
              : dataPass.typeYear === 'Week'
                ? dataPass.datePush[d[0].index]
                : moment(dataPass.datePush[d[0].index]).format('DD MMM YY');
          d.forEach((element) => {
            if (element.value !== 0 && element.value !== null) {
              totalHeader += element.value;
            }
          });
          let table = `<table><tr><th>${tableHeader}</th>`;
          if (dataPass.viewType === 'Cumulative') {
            table += '<th class="recordDate">Record Start Date</th>';
          }
          table += `<th>${totalHeader} (Total)</th></tr>`;
          d.forEach((element) => {
            if (element.value !== 0) {
              table += `<tr><td><span class="boxcolor" style="background-color:${color(element.id)}; color:${color(element.id)};">a</span>${element.name}</td>`;
              if (dataPass.cumDateData[element.name] !== '') {
                table += `<td>${dataPass.cumDateData[element.name]}</td>`;
              }
              table += `<td class="alignValuetooltip">${element.value}</td></tr>`;
            }
          });
          table += '</table></div>';
          return table;
        }
      },
      onrendered() {
        dataPass.repoNameData.forEach((element, key) => {
          const selectorValue = document.querySelectorAll(`.chartDiv svg  .c3-chart-bar.c3-target:nth-of-type(${key + 1}) >  .c3-shapes > path`);
          selectorValue.forEach((elementinner, innerkey) => {
            const ht1 = document.querySelector(`.chartDiv svg  .c3-chart-bar.c3-target:nth-of-type(${key + 1}) > .c3-shapes > .c3-bar-${innerkey}`).getBBox();
            if (ht1.height < 15) {
              document
                .querySelector(`.chartDiv svg .c3-chart-texts  .c3-chart-text.c3-target:nth-of-type(${key + 1}) > .c3-texts > .c3-text-${innerkey}`)
                .classList.add('remove');
            }
          });
        });
        /** process decimal value */
        const selectorValue = document.querySelectorAll(`.chartContainer svg .c3-axis.c3-axis-y > .tick text tspan`);
        const selectedVal = Array.from(selectorValue);
        selectedVal.forEach((element, index) => {
          if (element.innerHTML === '') {
            document.querySelector(`.chartContainer svg .c3-axis.c3-axis-y > .tick:nth-of-type(${index + 1}) line`).classList.add('decimalValeHide');
          }
        });
      }
    });
    if (datpu.length > 35) {
      const datList = document.querySelectorAll('#barchartexpand .c3-axis.c3-axis-x > .tick');
      datList.forEach((ele, inx) => {
        if (arrpu.indexOf(inx) < 0) {
          // eslint-disable-next-line no-param-reassign
          ele.style.display = 'none';
        }
      });
    } 
  }, [dataPass]);

  return (
    <div className="chartHeight">
      <div id="barchartexpand" />
    </div>
  );
};

export default BarChart;
