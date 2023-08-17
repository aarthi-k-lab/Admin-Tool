import React from 'react';
import PropTypes from 'prop-types';
import {
  Dialog, Grid, Typography, Button,
} from '@material-ui/core';
import './index.css';

const SuccessDialogBox = (props) => {
  const {
    isOpen, handleClose, btnPress = () => { }, modalContent,
  } = props;
  return (
    <>
      <Dialog
        fullWidth
        maxWidth="lg"
        onClose={handleClose}
        open={isOpen}
        styleName="successDialog"
      >
        <Grid alignItems="center" container direction="column" justifyContent="center">
          <Grid item lg={12} md={12} sm={12} xs={12}>
            <Typography styleName="content">{modalContent}</Typography>
          </Grid>

          <Grid item lg={12} md={12} sm={12} xs={12}>
            <Button
              color="primary"
              onClick={btnPress}
              styleName="okBtn"
              sx={{ width: '10px' }}
              variant="contained"
            >
              OK
            </Button>
          </Grid>
        </Grid>
      </Dialog>
    </>
  );
};

SuccessDialogBox.defaultProps = {
  handleClose: () => {},
  modalContent: 'Sent Successfully',
};

SuccessDialogBox.propTypes = {
  btnPress: PropTypes.func.isRequired,
  handleClose: PropTypes.func,
  isOpen: PropTypes.bool.isRequired,
  modalContent: PropTypes.string,
};

export default SuccessDialogBox;
