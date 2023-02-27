import React from 'react';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import { utils } from 'ducks/tasks-and-checklist';
import './ChecklistHeader.css';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

const ChecklistHeader = ({ checklistType }) => {
  const { getChecklistGridName, getCSTDateTime } = utils;
  const historyItem = useSelector(state => state['income-calculator'].historyItem);

  const { calcDateTime, calcByUserName, lockId } = historyItem;
  return (
    <>
      <Grid item xs={getChecklistGridName('lockedDate', checklistType)}>
        <Typography styleName="asset">{getCSTDateTime(calcDateTime)}</Typography>
      </Grid>
      <Grid item xs={getChecklistGridName('lockId', checklistType)}>
        <Typography styleName="asset">
          { ` Asset ID: ${lockId}` }
        </Typography>
      </Grid>
      <Grid item xs={getChecklistGridName('lockedBy', checklistType)}>
        <Typography styleName="asset">
          { ` Done By: ${calcByUserName.replace('.', ' ').replace('@mrcooper.com', '')}` }
        </Typography>
      </Grid>
    </>
  );
};

ChecklistHeader.defaultProps = {
  checklistType: '',
};

ChecklistHeader.propTypes = {
  checklistType: PropTypes.string,
};

export default ChecklistHeader;
