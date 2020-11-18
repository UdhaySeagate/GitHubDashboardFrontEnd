import React, { Component } from 'react';
import './Header.css';
import { Row, Col } from 'react-bootstrap';
import SeagateLogo from '../../assets/Segate_logowhite.png';
import githubLogo from '../../assets/Github_logo.png';

class Header extends Component {
  constructor() {
    super();
    this.state = {};
  }

  render() {
    return (
      <Row className="headerDiv">
        <Col>
          <span>
            <img src={SeagateLogo} width="154" height="51" alt="increment" />
          </span>
        </Col>
        <Col>
          <span className="alignright">
            <img src={githubLogo} alt="increment" />
          </span>
        </Col>
      </Row>
    );
  }
}

export default Header;
