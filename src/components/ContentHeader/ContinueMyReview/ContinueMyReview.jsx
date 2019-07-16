import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import './ContinueMyReview.css';

const ContinueMyReview = ({ onClick }) => (
  <Button
    className="material-ui-button"
    color="primary"
    onClick={onClick}
    styleName="continue-my-review"
    variant="contained"
  >
    Continue My Review
  </Button>
);

ContinueMyReview.defaultProps = {
  onClick: () => {},
};

ContinueMyReview.propTypes = {
  onClick: PropTypes.func,
};

export default ContinueMyReview;
