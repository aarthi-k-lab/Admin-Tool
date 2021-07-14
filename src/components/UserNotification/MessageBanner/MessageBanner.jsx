import React from 'react';
import PropTypes from 'prop-types';
import { ERROR, SUCCESS } from 'constants/common';
import FormLabel from '@material-ui/core/FormLabel';
import Grid from '@material-ui/core/Grid';
import './MessageBanner.css';

function MessageBanner(props) {
  const getBoxStyle = (level) => {
    switch (level) {
      case ERROR:
        return 'banner-error';
      case SUCCESS:
        return 'banner-success';
      default:
        return 'banner';
    }
  };
  const {
    message, level, open, dismissUserNotification,
  } = props;
  return (
    open ? (
      <Grid container styleName={getBoxStyle(level)}>
        <Grid item styleName="message" xs={11}>{message}</Grid>
        <Grid item styleName="btnOk">
          <FormLabel
            className="filled"
            onClick={() => dismissUserNotification()}
            styleName="btnOKClr"
          >
            OK
          </FormLabel>
        </Grid>
      </Grid>
    ) : null
  );
}


MessageBanner.defaultProps = {
  open: false,
};

MessageBanner.propTypes = {
  dismissUserNotification: PropTypes.func.isRequired,
  level: PropTypes.oneOf([ERROR, SUCCESS]).isRequired,
  message: PropTypes.node.isRequired,
  open: PropTypes.bool,

};

export default MessageBanner;
