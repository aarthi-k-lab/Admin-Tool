import React, { useState } from 'react';
import {
  Grid, Typography, Popover, Divider, IconButton,
} from '@material-ui/core/index';
import HistoryIcon from '@material-ui/icons/History';
import PropTypes from 'prop-types';
import './ReasonableEffortHistory.css';
import { connect } from 'react-redux';
import { operations as tombstoneOperations } from 'ducks/tombstone';

function ReasonableEffortHistory(props) {
  const {
    historyData, fetchHistory, fetchReasonableEffortById, setReasonableEffortId,
  } = props;

  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    fetchHistory();
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const onClickView = (reasonableEffortId) => {
    fetchReasonableEffortById(reasonableEffortId);
    setReasonableEffortId(reasonableEffortId);
    setAnchorEl(null);
  };

  return (
    <div>
      <HistoryIcon onClick={handleClick} />
      <Popover
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        onClose={handleClose}
        open={Boolean(anchorEl)}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <Grid container direction="column" styleName="reasonable-effort-history-container">
          {
            historyData.length === 0 && (
              <>
                <Typography styleName="no-history-name">No History Found</Typography>
              </>
            )
          }
          {
            historyData && historyData.map(value => (
              <>
                <Grid item styleName="reasonable-effort-history-item">
                  <Grid container spacing={1}>
                    <Grid item>
                      <Typography styleName="reasonable-effort-typo-id">{value}</Typography>
                    </Grid>
                    <Grid item>
                      <IconButton onClick={() => onClickView(value)} styleName="reasonable-effort-view-button">
                        <img alt="home page placeholder" src="/static/img/viewIconReasonableEffort.png" styleName="view-icon-img" />
                      </IconButton>
                    </Grid>
                  </Grid>
                </Grid>
                <Divider />
              </>
            ))
          }
        </Grid>
      </Popover>
    </div>
  );
}


ReasonableEffortHistory.propTypes = {
  fetchHistory: PropTypes.func.isRequired,
  fetchReasonableEffortById: PropTypes.func.isRequired,
  historyData: PropTypes.shape().isRequired,
  setReasonableEffortId: PropTypes.func.isRequired,
};


const mapDispatchToProps = dispatch => ({
  fetchHistory: tombstoneOperations.getReasonableEffortHistoryDataOperation(dispatch),
  fetchReasonableEffortById: tombstoneOperations.getReasonableEffortByIdOperation(dispatch),
});

export default connect(null, mapDispatchToProps)(ReasonableEffortHistory);
