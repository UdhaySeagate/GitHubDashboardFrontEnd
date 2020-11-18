/* eslint-disable no-nested-ternary */
import React from 'react';
import { Row, Col } from 'react-bootstrap';
import InstantReportCards from '../InstantReportCards/InstantReportCards';
import CardLoader from '../InstantReportCards/InstantCardLoader';
import CardError from '../InstantReportCards/cardError';
import './Livestats.css';

/**
 * Following JSX to handle live stats(Starred,Forks,Contributing Organization) 
 */
const LiveStat = ({ peopleStarred, forks, controrgs, showModelProps }) => {
  const showModel = (header) => {
    showModelProps(header);
  };

  return (
    <Row className="livestatelay">
      <Col sm={12}>
        {!peopleStarred.apiCallStatus ? (
          <CardLoader />
        ) : peopleStarred.showErrorMessage === '' ? (
          <InstantReportCards
            percentage="+3.45 % less than month"
            header="Starred"
            count={peopleStarred.count}
            colorImage="card4"
            dataShow={peopleStarred.barChartValue}
            daysCount=""
            showModelProps={showModel}
            infomessage=""
          />
        ) : (
          <CardError errorMessage={peopleStarred.showErrorMessage} />
        )}
      </Col>
      <Col sm={12}>
        {!forks.apiCallStatus ? (
          <CardLoader />
        ) : forks.showErrorMessage === '' ? (
          <InstantReportCards
            percentage="+3.45 % less than month"
            header="Forks"
            count={forks.count}
            colorImage="card2"
            dataShow={forks.barChartValue}
            daysCount=""
            showModelProps={showModel}
            infomessage=""
          />
        ) : (
          <CardError errorMessage={forks.showErrorMessage} />
        )}
      </Col>
      <Col sm={12}>
        {!controrgs.apiCallStatus ? (
          <CardLoader />
        ) : controrgs.showErrorMessage === '' ? (
          <InstantReportCards
            percentage="+3.45 % less than month"
            header="Contributing Organization"
            count={controrgs.count}
            colorImage="card5"
            dataShow={controrgs.barChartValue}
            daysCount=""
            showModelProps={showModel}
            infomessage=""
          />
        ) : (
          <CardError errorMessage={controrgs.showErrorMessage} />
        )}
      </Col>
    </Row>
  );
};

export default LiveStat;
