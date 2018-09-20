import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';

import './ContentHeader.css';

const ContentHeader = ({
  disableGetNext, onGetNext, title, showGetNext,
}) => (
  <header styleName="content-header">
    <h3 styleName="title">{title}</h3>
    <span styleName="spacer" />
    {
      showGetNext
        ? (
          <Button
            color="primary"
            disabled={disableGetNext}
            onClick={onGetNext}
            styleName="get-next"
            variant="contained"
          >
      Get Next
          </Button>
        ) : null
    }
  </header>
);

ContentHeader.defaultProps = {
  disableGetNext: false,
  onGetNext: () => {},
  title: 'FE Underwriter',
  showGetNext: true,
};

ContentHeader.propTypes = {
  disableGetNext: PropTypes.bool,
  onGetNext: PropTypes.func,
  showGetNext: PropTypes.bool,
  title: PropTypes.string,
};

export default ContentHeader;
