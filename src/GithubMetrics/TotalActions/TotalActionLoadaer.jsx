/* eslint-disable no-nested-ternary */
import React from 'react';
import ContentLoader from 'react-content-loader';
import { Row, Col } from 'react-bootstrap';

const ActionLoader = ({headerName}) => (
  <Row>
    <Col sm={9} className="actionLoaderTop">
      <ContentLoader height={headerName ==='clones' ? 79 : headerName ==='comments' ? 90 :65} width={180} speed={2} primaryColor="#d9d9d9" secondaryColor="#ecebeb">
        <rect x="5" y="50" rx="2" ry="2" width="440" height="10" />
        <rect x="5" y="30" rx="2" ry="2" width="380" height="10" />
      </ContentLoader>
    </Col>
    <Col sm={3} className="actionLoaderTop actionSecond">
      <ContentLoader height={68} width={80} speed={2} primaryColor="#d9d9d9" secondaryColor="#ecebeb">
        <rect x="3" y="20" rx="2" ry="2" width="0" height="10" />
        <rect x="3" y="30" rx="2" ry="2" width="0" height="10" />
        <circle cx="46" cy="42" r="26" />
      </ContentLoader>
    </Col>
  </Row>
);

export default ActionLoader;
