/* eslint-disable no-nested-ternary */
import React from 'react';
import './TotalContributions.css';
import TotalContribution from './TotalContributionHtml';
import ContributionLoader from './TotalContributionLoader';
import ContributorError from './TotalContributorsError';

const TotalContributorsData = ({ contributors, pullrequest, issues, showModelProps }) => {
  const showModel = (header) => {
    showModelProps(header);
  };

  return (
    <div className="totalcontribution">
      <div className={!contributors.apiCallStatus || contributors.showErrorMessage !== '' ? 'section3 errorBorder' : 'section3 con'}>
        {!contributors.apiCallStatus ? (
          <ContributionLoader />
        ) : contributors.showErrorMessage === '' ? (
          <TotalContribution displayName="contributors" data={contributors.count} showModelProps={showModel} />
        ) : (
          <ContributorError errorMessage={contributors.showErrorMessage} />
        )}
      </div>
      <div className={!issues.apiCallStatus || issues.showErrorMessage !== '' ? 'section3 errorBorder' : 'section3 issu'}>
        {!issues.apiCallStatus ? (
          <ContributionLoader />
        ) : issues.showErrorMessage === '' ? (
          <TotalContribution displayName="issues" data={issues.count} showModelProps={showModel} />
        ) : (
          <ContributorError errorMessage={issues.showErrorMessage} />
        )}
      </div>
      <div className={!pullrequest.apiCallStatus || pullrequest.showErrorMessage !== '' ? 'section3 errorBorder' : 'section3 pull'}>
        {!pullrequest.apiCallStatus ? (
          <ContributionLoader />
        ) : pullrequest.showErrorMessage === '' ? (
          <TotalContribution displayName="pullrequest" data={pullrequest.count} showModelProps={showModel} />
        ) : (
          <ContributorError errorMessage={pullrequest.showErrorMessage} />
        )}
      </div>
    </div>
  );
};
export default TotalContributorsData;
