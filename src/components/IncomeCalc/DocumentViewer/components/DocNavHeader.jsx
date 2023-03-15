import React from 'react';
import * as PropTypes from 'prop-types';

import {
  Grid,
  Button,
  Typography,
  Toolbar,
  IconButton,
} from '@material-ui/core';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import './DocNavHeader.css';

export default function DocNavHeader(props) {
  const { handleDone, checkedDocument } = props;
  return (
    <div>
      <Grid container>
        <Grid item xs={10}>
          <Typography
            styleName="header"
            variant="h6"
          >
            Documents
          </Typography>
        </Grid>
        <Grid item style={{ display: 'flex', justifyContent: 'end' }} xs={2}>
          {checkedDocument.length !== 0
            ? (
              <Toolbar style={{ padding: '0px', minHeight: '20px' }} variant="dense">
                <Button
                  onClick={() => handleDone(false)}
                  styleName="cancelBtn"
                  variant="contained"
                >
                  Cancel

                </Button>
                <Button
                  onClick={() => handleDone(true)}
                  styleName="doneBtn"
                  variant="contained"
                >
                  LINK

                </Button>
              </Toolbar>
            )
            : (
              <IconButton style={{
                width: '10px', height: '10px',
              }}
              >
                <InfoOutlinedIcon />
              </IconButton>
            )
          }
        </Grid>
      </Grid>
    </div>
  );
}

DocNavHeader.propTypes = {
  checkedDocument: PropTypes.arrayOf(PropTypes.number).isRequired,
  handleDone: PropTypes.func.isRequired,
};
