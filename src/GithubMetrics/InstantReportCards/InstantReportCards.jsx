/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useState } from 'react';
import C3Chart from 'react-c3js';
import { Tooltip } from 'reactstrap';
import cardIcon from '../../assets/infoicon_cards.png';
import 'c3/c3.css';
/**
 * Following JSX method is used to handle card metric data
 */
const Cards = ({ header, count, colorImage, dataShow, daysCount, showModelProps, infomessage }) => {
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const [tooltipOpeninfo, setTooltipInfo] = useState(false);

  /** Tooltip to show info icon */
  const toggleDays = () => {
    setTooltipOpen(!tooltipOpen);
  };

  /** Tooltip toggle hide and show */
  const infotoggle = () => {
    setTooltipInfo(!tooltipOpeninfo);
  };

  let dataShowChanges = [];
  dataShowChanges = dataShow.reverse().slice(0, 15);
  const length = dataShowChanges.length < 10 ? 7 : 15;
  const data = {
    columns: [['data1', ...dataShowChanges]],
    type: 'bar',
    colors: {
      data1: 'white'
    }
  };
  const bar = {
    width: {
      ratio: dataShow.length < 7 ? 0.1 : 0.5 // this makes bar width 50% of length between ticks
    },
    space: 0
  };
  const legend = {
    show: false
  };
  const axis = {
    x: {
      show: false,
      max: length
    },
    y: {
      show: false
    }
  };
  const grid = {
    x: {
      show: false
    }
  };
  const tooltip = {
    show: false
  };
  const showModel = (headerPss) => {
    showModelProps(headerPss);
  };
  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events
    <div className={`pointershow cards-content ${colorImage}`} onClick={() => showModel(header)}>
      <div>
        <span className="infocont">
          <span>{header}</span>
          {'  '}
          {infomessage !== '' && (
            <span id="TooltipExampleinfo">
              <span>
                <img src={cardIcon} alt="Info" />

                <Tooltip placement="bottom" isOpen={tooltipOpeninfo} target="TooltipExampleinfo" toggle={infotoggle}>
                  <span className="dataShowtooltip">Data is shown from the Database</span>
                </Tooltip>
              </span>
            </span>
          )}
        </span>
        <span className="loaderchart">
          <C3Chart data={data} legend={legend} grid={grid} axis={axis} tooltip={tooltip} bar={bar} />
        </span>
      </div>
      <div className="middleValue">
        <span className="bold">{count}</span>
      </div>
      <div className="lastRow daysrow">
        {daysCount !== '' && daysCount.days !== '' && (
          <span id="TooltipExample">
            {daysCount.days !== 0 ? (
              <span className="days percentage">
                Last
                {' '}
                {daysCount.days}
                {' '}
                Days
              </span>
            ) : <span className="days percentage">One Day</span>}
            <Tooltip className="toolTipFont" placement="bottom" isOpen={tooltipOpen} target="TooltipExample" toggle={toggleDays}>
              {daysCount.dateString}
            </Tooltip>
          </span>
        )}
      </div>
    </div>
  );
};

export default Cards;
