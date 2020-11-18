/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-nested-ternary */
import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { Progress } from 'reactstrap';
import expand from '../../assets/expand.png';

const commonContributor = ({ displayName, data, showModelProps }) => {
  const showModel = (header) => {
    showModelProps(header);
  };

  return (
    <div
      className="data1 pointershow"
      onClick={() => (displayName === 'contributors' ? showModel('Contributors') : displayName === 'issues' ? showModel('Issues') : showModel('Pull Request'))}
    >
      <div className="mainHeaderCont">
        {displayName === 'contributors' && (
          <div>
            <span className="labelcaption underline">Total Contributors</span>
            <span className="countVal">{data.total}</span>
            <span className="epandImg">
              <img src={expand} alt="expand" />
            </span>
          </div>
        )}
        {displayName === 'issues' && (
          <div>
            <span className="labelcaption ">Total Issues</span>
            <span className="countVal">{data.total}</span>
            <span className="epandImg">
              <img src={expand} alt="expand" />
            </span>
          </div>
        )}
        {displayName === 'pullrequest' && (
          <div>
            <span className="labelcaption ">Total Pull Requests</span>
            <span className="countVal">
              {data.totalpr}
              <span className="pullInfo">(Open + Closed)</span>
            </span>
            <span className="epandImg">
              <img src={expand} alt="expand" />
            </span>
          </div>
        )}
      </div>
      <div className="contrsplit">
        <Row>
          {displayName === 'pullrequest' ? (
            <>
              <Col
                sm={4}
                className={
                  displayName === 'contributors' ? 'contributors first externalC' : displayName === 'issues' ? 'issues first openI' : 'pullrequest first openPR'
                }
              >
                {displayName === 'pullrequest' && (
                  <div>
                    <span className="splitLable">Open</span>
                    <span className="textValue">
                      {data.openpr}
                      {' '}
                    </span>
                  </div>
                )}
              </Col>
              <Col
                sm={4}
                className={displayName === 'contributors' ? 'contributors internalC' : displayName === 'issues' ? 'issues closedI' : 'pullrequest closedPR'}
              >
                {displayName === 'pullrequest' && (
                  <div>
                    <span className="splitLable closedPR">Closed</span>
                    <span className="textValue">{data.closepr}</span>
                  </div>
                )}
              </Col>
              <Col
                sm={4}
                className={displayName === 'contributors' ? 'contributors internalC' : displayName === 'issues' ? 'issues closedI' : 'pullrequest closedPR'}
              >
                {displayName === 'pullrequest' && (
                  <div>
                    <span className="splitLable closedPR">Merged</span>
                    <span className="textValue">{data.mergedpr}</span>
                  </div>
                )}
              </Col>
              <Col sm={4}>
                {displayName === 'pullrequest' && (
                  <Progress multi className="progreeData">
                    <Progress bar className="prbar" value={(data.openpr * 100) / data.totalpr} />
                  </Progress>
                )}
              </Col>
              <Col sm={4}>
                {displayName === 'pullrequest' && (
                  <Progress multi className="progreeData">
                    <Progress bar className="prbar" value={(data.closepr * 100) / data.totalpr} />
                  </Progress>
                )}
              </Col>
              <Col sm={4}>
                {displayName === 'pullrequest' && (
                  <Progress multi className="progreeData">
                    <Progress bar className="prbar" value={(data.mergedpr * 100) / data.totalpr} />
                  </Progress>
                )}
              </Col>
            </>
          ) : (
            <>
              <Col
                sm={6}
                className={
                  displayName === 'contributors' ? 'contributors first externalC' : displayName === 'issues' ? 'issues first openI' : 'pullrequest first openPR'
                }
              >
                {displayName === 'contributors' && (
                  <div>
                    <span className="splitLable ">External</span>
                    <span className="textValue">{data.external}</span>
                  </div>
                )}
                {displayName === 'issues' && (
                  <div>
                    <span className="splitLable openI">Open</span>
                    <span className="textValue">{data.open}</span>
                  </div>
                )}
              </Col>
              <Col
                sm={6}
                className={displayName === 'contributors' ? 'contributors internalC' : displayName === 'issues' ? 'issues closedI' : 'pullrequest closedPR'}
              >
                {displayName === 'contributors' && (
                  <div>
                    <span className="splitLable">Internal</span>
                    <span className="textValue">{data.internal}</span>
                  </div>
                )}
                {displayName === 'issues' && (
                  <div>
                    <span className="splitLable">Closed</span>
                    <span className="textValue">{data.close}</span>
                  </div>
                )}
              </Col>
              <Col sm={6}>
                {displayName === 'contributors' && (
                  <Progress multi className="progreeData">
                    <Progress bar className="contbar" value={(data.external * 100) / data.total} />
                  </Progress>
                )}
                {displayName === 'issues' && (
                  <Progress multi className="progreeData">
                    <Progress bar className="issuebar" value={(data.open * 100) / data.total} />
                  </Progress>
                )}
              </Col>
              <Col sm={6}>
                {displayName === 'contributors' && (
                  <Progress multi className="progreeData">
                    <Progress bar className="contbar" value={(data.internal * 100) / data.total} />
                  </Progress>
                )}
                {displayName === 'issues' && (
                  <Progress multi className="progreeData">
                    <Progress bar className="issuebar" value={(data.close * 100) / data.total} />
                  </Progress>
                )}
              </Col>
            </>
          )}
        </Row>
      </div>
    </div>
  );
};

export default commonContributor;
