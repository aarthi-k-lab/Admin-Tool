import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';

import './ContentHeader.css';

const ContentHeader = ({ disableGetNext, onGetNext, title }) => (
  <header styleName="content-header">
    <h3 styleName="title">{title}</h3>
    <span styleName="spacer" />
    <Button
      color="primary"
      disabled={disableGetNext}
      onClick={onGetNext}
      styleName="get-next"
      variant="contained"
    >
      Get Next
    </Button>
  </header>
);

ContentHeader.defaultProps = {
  disableGetNext: false,
  onGetNext: () => {},
  title: 'FE Underwriter',
};

ContentHeader.propTypes = {
  disableGetNext: PropTypes.bool,
  onGetNext: PropTypes.func,
  title: PropTypes.string,
};

export default ContentHeader;
