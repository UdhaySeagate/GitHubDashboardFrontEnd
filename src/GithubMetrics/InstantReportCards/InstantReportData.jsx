/* eslint-disable no-nested-ternary */
import React from 'react';
import { Row, Col } from 'react-bootstrap';
import './InstantReport.css';
import InstantReportCards from './InstantReportCards';
import CardLoader from './InstantCardLoader';
import CardError from './cardError';

const InstantReport = ({ visitors, visits, watchers, actionTaken, showModelProps }) => {
  const showModel = (header) => {
    showModelProps(header);
  };

  return (
    <Row className="instant">
      <Col sm={3}>
        {!visitors.apiCallStatus ? (
          <CardLoader />
        ) : visitors.showErrorMessage === '' ? (
          <InstantReportCards
            header="Visitors"
            count={visitors.count}
            colorImage="card1"
            dataShow={visitors.barChartValue}
            daysCount={visitors.daysObject}
            showModelProps={showModel}
            infomessage="Data is shown from the Database"
          />
        ) : (
          <CardError errorMessage={visits.showErrorMessage} />
        )}
      </Col>
      <Col sm={3}>
        {!visits.apiCallStatus ? (
          <CardLoader />
        ) : visits.showErrorMessage === '' ? (
          <InstantReportCards
            percentage="+3.45 % less than month"
            header="Visits"
            count={visits.count}
            colorImage="card6"
            dataShow={visits.barChartValue}
            daysCount={visits.daysObject}
            showModelProps={showModel}
            infomessage="Data is shown from the Database"
          />
        ) : (
          <CardError errorMessage={visits.showErrorMessage} />
        )}
      </Col>
      <Col sm={3}>
        {!watchers.apiCallStatus ? (
          <CardLoader />
        ) : watchers.showErrorMessage === '' ? (
          <InstantReportCards
            percentage="3.45 % less than month"
            header="Watchers"
            count={watchers.count}
            colorImage="card7"
            dataShow={watchers.barChartValue}
            daysCount=""
            onClick={() => showModel('Watchers')}
            showModelProps={showModel}
            infomessage="Data is shown from the Database"
          />
        ) : (
          <CardError errorMessage={watchers.showErrorMessage} />
        )}
      </Col>
      <Col sm={3}>
        {!actionTaken.apiCallStatus ? (
          <CardLoader />
        ) : actionTaken.showErrorMessage === '' ? (
          <InstantReportCards
            percentage="+3.45 % less than month"
            header="Actions Taken"
            count={actionTaken.count}
            colorImage="card3"
            dataShow={actionTaken.barChartValue}
            daysCount=""
            showModelProps={showModel}
            infomessage="Data is shown from the Database"
          />
        ) : (
          <CardError errorMessage={actionTaken.showErrorMessage} />
        )}
      </Col>
    </Row>
  );
};

export default InstantReport;
