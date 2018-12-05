import React from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import { withStyles } from '@material-ui/core/styles';
import styles from './CustomSnackBar.css';

const styles1 = {
  root: {
    background: 'red',
  },
};

class MySnackbar extends Snackbar {
  getStyleName() {
    const { type } = this.props;
    return `${type}SnackTheme`;
  }

  render() {
    const {
      timeout, message,
      open, onClose,
    } = this.props;
    return (
      <Snackbar
        autoHideDuration={timeout}
        contentProps={{
          classes: {
            root: styles.errorSnackTheme,
          },
        }}
        message={message}
        onClose={() => onClose()}
        open={open}
      >
        {super.render()}
      </Snackbar>
    );
  }
}

export default withStyles(styles1)(MySnackbar);
