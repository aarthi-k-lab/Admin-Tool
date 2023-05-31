import React from 'react';
import * as PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {
  Grid,
  Button,
  Typography,
  Toolbar,
  IconButton,
} from '@material-ui/core';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import DoneRoundedIcon from '@material-ui/icons/DoneRounded';
import { selectors as documentChecklistSelectors } from 'ducks/document-checklist';
import './DocNavHeader.css';

function DocNavHeader(props) {
  const { handleDone, checkedDocument, isLinkingSuccess } = props;
  return (
    <div>
      <Grid container>
        <Grid item xs={4}>
          <Typography
            styleName="header"
            variant="h6"
          >
            Documents
          </Typography>
        </Grid>
        <Grid item style={{ display: 'flex', justifyContent: 'end' }} xs={8}>
          {isLinkingSuccess && (
            <div styleName="link-status">
              <DoneRoundedIcon styleName="link-status-icon" />
              <Typography styleName="link-status-msg">
              Document(s) Linked
              </Typography>
            </div>

          )
          }
          {checkedDocument.length !== 0 && (
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
          )}
          {(checkedDocument.length === 0 && !isLinkingSuccess) && (
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
  isLinkingSuccess: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
  isLinkingSuccess: documentChecklistSelectors.getIsLinkingSuccess(state),
});

export default connect(mapStateToProps, null)(DocNavHeader);
