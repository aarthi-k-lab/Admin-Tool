import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import StopIcon from '@material-ui/icons/Stop';
import ZoomOut from '@material-ui/icons/ZoomOutMap';

import './ContentHeader.css';
import { IconButton } from '@material-ui/core';

const ContentHeader = ({
  disableGetNext,
  onEndShift,
  onExpand,
  onGetNext,
  showEndShift,
  showGetNext,
  title,
}) => {
  const getNextButton = (
    <Button
      className="material-ui-button"
      color="primary"
      disabled={disableGetNext}
      onClick={onGetNext}
      styleName="get-next"
      variant="contained"
    >
      Get Next
    </Button>
  );
  const endShift = (
    <Button
      color="primary"
      onClick={onEndShift}
      styleName="end-shift"
      variant="outlined"
    >
      <StopIcon />
      End Shift
    </Button>
  );

  return (
    <header styleName="content-header">
      <h3 styleName="title">{title}</h3>
      <span styleName="spacer" />
      {showEndShift ? endShift : null}
      {showGetNext ? getNextButton : null}
      <IconButton onClick={onExpand}>
        <ZoomOut />
      </IconButton>
    </header>
  );
};

ContentHeader.defaultProps = {
  disableGetNext: false,
  onEndShift: () => {},
  onExpand: () => {},
  onGetNext: () => {},
  title: 'FE Underwriter',
  showEndShift: false,
  showGetNext: false,
};

ContentHeader.propTypes = {
  disableGetNext: PropTypes.bool,
  onEndShift: PropTypes.func,
  onExpand: PropTypes.func,
  onGetNext: PropTypes.func,
  showEndShift: PropTypes.bool,
  showGetNext: PropTypes.bool,
  title: PropTypes.string,
};

export default ContentHeader;
