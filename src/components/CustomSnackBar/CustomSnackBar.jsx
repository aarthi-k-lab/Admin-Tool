import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import styles from './CustomSnackBar.css';

class CustomSnackbar extends Component {
  constructor(props) {
    super(props);
    this.state = { };
  }

  render() {
    const {
      message, onClose,
      open, timeout, type,
    } = this.props;
    return (
      <div>
        <Snackbar
          autoHideDuration={timeout}
          onClose={() => onClose()}
          open={open}
        >
          <div>
            <SnackbarContent
              classes={{
                root: styles[`${type}SnackTheme`],
              }}
              message={message}
            />
          </div>
        </Snackbar>
      </div>
    );
  }
}

CustomSnackbar.defaultProps = {
  open: false,
  timeout: 4000,
  type: 'message',
};

CustomSnackbar.propTypes = {
  message: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool,
  timeout: PropTypes.number,
  type: PropTypes.string,
};

export default CustomSnackbar;
