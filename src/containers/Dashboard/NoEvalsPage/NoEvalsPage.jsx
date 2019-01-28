import React from 'react';
import PropTypes from 'prop-types';
import FullHeightColumn from 'components/FullHeightColumn';
import './NoEvalsPage.css';
import Button from '@material-ui/core/Button';

const NoEvalsPage = ({ loanNumber }) => (
  <FullHeightColumn styleName="noEval-page">
    <img alt="no eval page placeholder" src="/static/img/no-evals.png" />
    <h3>Awww...Looks like no eval created yet!</h3>
    <span>
      {`Loan Number "${loanNumber}" still exists`}
    </span>
    <Button color="secondary" disabled size="small" variant="contained">
        CREATE EVAL
    </Button>
  </FullHeightColumn>
);

NoEvalsPage.propTypes = {
  loanNumber: PropTypes.string.isRequired,
};

export default NoEvalsPage;
