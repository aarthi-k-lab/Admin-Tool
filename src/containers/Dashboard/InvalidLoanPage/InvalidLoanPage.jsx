import React from 'react';
import PropTypes from 'prop-types';
import FullHeightColumn from 'components/FullHeightColumn';
import './InvalidLoanPage.css';

const InvalidLoanPage = ({ loanNumber }) => (
  <FullHeightColumn styleName="inValidLoan-page">
    <img alt="no loan page placeholder" src="/static/img/invalid-loan.png" />
    <h3>Awww...Do not feel bad.</h3>
    <span>
      {`We did not find any matches for "${loanNumber}". Try searching with a valid loan number.`}
    </span>
  </FullHeightColumn>
);

InvalidLoanPage.propTypes = {
  loanNumber: PropTypes.string.isRequired,
};

export default InvalidLoanPage;