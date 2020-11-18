/* eslint-disable no-nested-ternary */
import React, { useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import { Tooltip } from 'reactstrap';
import TotalActionError from './TotalActionError';
import ActionLoader from './TotalActionLoadaer';
import './TotalActions.css';
import Download from '../../assets/Downloads.png';
import clones from '../../assets/Clones.png';
import Commits from '../../assets/Commits.png';
import Progress from '../../assets/progress.png';
import cardIcon from '../../assets/infoicon_container.png';

/**
 * Following method is used to handle clone,commits,comments,download 
 */

const TotalAction = ({ totalClones, issueComments, totalReleaseDownload, totalCommits, showModelProps }) => {
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const [tooltipOpeninfoAction, setTooltipInfo] = useState(false);

  /** Following method is used to handle tooltip selection for days */
  const toggleDays = () => {
    setTooltipOpen(!tooltipOpen);
  };

  /** Following method is used to handle tooltip selection for info message */
  const infotoggle = () => {
    setTooltipInfo(!tooltipOpeninfoAction);
  };

  /** Following method is used to handle model trigger */
  const showModel = (header) => {
    showModelProps(header);
  };

  return (
    <div className="mainDivaction">
      <div className="totalaction">
        <div>
          {!totalReleaseDownload.apiCallStatus ? (
            <ActionLoader headerName="relase" />
          ) : totalReleaseDownload.showErrorMessage === '' ? (
            <Row className="firstDiv pointershow" onClick={() => showModel('Downloads')}>
              <Col sm={10}>
                <span>Total Release Downloads</span>
                <span className="countValue">{totalReleaseDownload.count}</span>
              </Col>
              <Col sm={2} className="commonPadicon">
                <span className="imgactions relase">
                  <img src={Download} alt="Release Download" />
                </span>
              </Col>
            </Row>
          ) : (
            <TotalActionError errorMessage={totalReleaseDownload.showErrorMessage} />
              )}
        </div>
        <div>
          {!totalClones.apiCallStatus ? (
            <ActionLoader headerName="clones" />
          ) : totalClones.showErrorMessage === '' ? (
            <Row className="pointershow" onClick={() => showModel('Clones')}>
              <Col sm={10}>
                <span className="cloneinfocont">
                  <span>Total Clones</span>
                  {' '}
                  <img src={cardIcon} alt="Info" id="TooltipExampleinfoAction" width="16" height="17" />
                </span>
                <Tooltip placement="bottom" isOpen={tooltipOpeninfoAction} target="TooltipExampleinfoAction" toggle={infotoggle}>
                  <span className="dataShowtooltip">Data is shown from the Database</span>
                </Tooltip>
                <span className="countValue">{totalClones.count}</span>
              </Col>
              <Col sm={2} className="commonPadicon">
                <span className="imgactions clones">
                  <img src={clones} alt="Total Clones" />
                </span>
              </Col>
              {totalClones.daysObject.days !== '' ? (
                <Col className="lasDay">
                  {/* <span> */}
                  <span>
                    {totalClones.daysObject.days !== 0 ? (
                      <span id="TooltipExampleAction" className="daystotalaction pointershow">
                        Last
                        {' '}
                        {totalClones.daysObject.days}
                        {' '}
                        Days
                      </span>
                    ) : (
                      <span id="TooltipExampleAction" className="daystotalaction">One Day</span>
                      )}
                    <Tooltip placement="bottom" isOpen={tooltipOpen} target="TooltipExampleAction" toggle={toggleDays}>
                      {totalClones.daysObject.dateString}
                    </Tooltip>
                  </span>
                  {/* </span> */}
                </Col>
              )
              :
                <Col className="lasDay" />}
            </Row>
          ) : (
            <TotalActionError errorMessage={totalClones.showErrorMessage} />
              )}
        </div>
        <div>
          {!totalCommits.apiCallStatus ? (
            <ActionLoader headerName="commits" />
          ) : totalCommits.showErrorMessage === '' ? (
            <Row className="pointershow" onClick={() => showModel('Commits')}>
              <Col sm={10}>
                <span>
                  Total Commits
                  {' '}
                  <span className="branch branchColor">(Default Branch)</span>
                </span>
                <span className="countValue">{totalCommits.count}</span>
              </Col>
              <Col sm={2} className="commonPadicon">
                <span className="imgactions commits">
                  <img src={Commits} alt="Total Commits" />
                </span>
              </Col>
            </Row>
          ) : (
            <TotalActionError errorMessage={totalCommits.showErrorMessage} />
              )}
        </div>
      </div>
      <div className="commentsDiv totalaction">
        {!issueComments.apiCallStatus ? (
          <ActionLoader headerName="comments" />
        ) : issueComments.showErrorMessage === '' ? (
          <Row className="pointershow" onClick={() => showModel('Comments')}>
            <Col sm={10}>
              <span>Comments </span>
              <span className="countValue">{issueComments.count}</span>
            </Col>
            <Col sm={2} className="commonPadicon">
              <span className="commentsprogress">
                <img src={Progress} alt="Comments" />
              </span>
            </Col>
            <Col>
              <span className="branchColor awaiting">Awaiting Response</span>
            </Col>
          </Row>
        ) : (
          <TotalActionError errorMessage={issueComments.showErrorMessage} />
            )}
      </div>
    </div>
  );
};

export default TotalAction;
