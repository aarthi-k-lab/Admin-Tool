import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import pathOr from 'ramda/src/pathOr';
import TaskStatusIcon from 'components/TaskStatusIcon';
import './SubTask.css';

const R = {
  pathOr,
};

function SubTask({ data, onClick }) {
  const boundClickHandler = () => onClick(data._id); // eslint-disable-line
  return (
    <Grid container item spacing={12}>
      <Grid item xs={2} />
      {/* <Grid item xs={2}> */}
      <Grid container item justify="flex-start" onClick={boundClickHandler} styleName="checklist" xs={10}>
        <Grid alignItems="center" container item justify="center" xs={2}>
          <TaskStatusIcon isSubTask styleName="fill-width" task={data} />
        </Grid>
        <Grid alignItems="center" container item xs={10}>
          <span
            styleName={data.state === 'failed' ? 'failure-subtask-name' : 'subtask-name'}
          >
            { R.pathOr('', ['taskBlueprint', 'name'], data) }
          </span>
          {
            data.state === 'failed' && data.failureReason
              && (
                <>
                  <br />
                  <span styleName="error-text-subtask">{ data.failureReason }</span>
                </>
              )
          }
        </Grid>
      </Grid>
    </Grid>
  );
}

SubTask.defaultProps = {
  onClick: () => {},
};

SubTask.propTypes = {
  data: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    failureReason: PropTypes.string,
    state: PropTypes.string,
    taskBlueprint: PropTypes.shape({
      name: PropTypes.string,
    }),
  }).isRequired,
  onClick: PropTypes.func,
};

export default SubTask;
