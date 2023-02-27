import React from 'react';
import * as PropTypes from 'prop-types';

import {
  Popover,
  Button,
  Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import './ConfirmationPopover.css';

const useStyles = makeStyles(() => ({
  ul: {
    '& .Mui-selected': { color: '#FFFFFF', backgroundColor: '#596FEB' },
    '& .MuiPaginationItem-root': { fontSize: '12px' },
  },
  paper: { border: '1px solid #4E586E', borderRadius: '5px' },
}));

const ConfirmationPopover = (props) => {
  const classes = useStyles();
  const {
    anchorEl,
    popoverId,
    handlePopoverClose,
    isPopoverOpen,
    handleDeleteDocument,
  } = props;
  return (
    <div>
      <Popover
        anchorEl={anchorEl || null}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        classes={classes}
        id={popoverId}
        onClose={handlePopoverClose}
        open={isPopoverOpen}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
      >
        <div styleName="messageContainer">
          <div style={{
            display: 'flex',
            alignItems: 'center',
          }}
          >
            <Typography
              display="block"
              styleName="messageText"
              variant="body"
            >
              <b>Please click &apos;confirm&apos; to delete</b>
            </Typography>
          </div>
          <div>
            <Button
              onClick={handleDeleteDocument}
              size="small"
              styleName="confirmBtn"
              variant="contained"
            >
              CONFIRM
            </Button>
            <Button
              onClick={handlePopoverClose}
              size="small"
              styleName="cancelBtn"
              variant="contained"
            >
              CANCEL
            </Button>
          </div>
        </div>
      </Popover>
    </div>
  );
};

ConfirmationPopover.propTypes = {
  anchorEl: PropTypes.string.isRequired,
  handleDeleteDocument: PropTypes.func.isRequired,
  handlePopoverClose: PropTypes.func.isRequired,
  isPopoverOpen: PropTypes.bool.isRequired,
  popoverId: PropTypes.string.isRequired,
};

export default ConfirmationPopover;
