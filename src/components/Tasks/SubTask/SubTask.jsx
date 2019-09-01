import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import pathOr from 'ramda/src/pathOr';
import classNames from 'classnames';
import TaskStatusIcon from 'components/TaskStatusIcon';
import styles from './SubTask.css';

const R = {
  pathOr,
};

function SubTask({ data, onClick, selected }) {
  const boundClickHandler = () => onClick(data._id); // eslint-disable-line
  return (
    <Grid container item spacing={0}>
      <Grid item xs={2} />
      {/* <Grid item xs={2}> */}
      <Grid
        className={classNames({
          [styles['checklist-selected']]: selected,
          [styles.checklist]: true,
        })}
        container
        item
        justify="flex-start"
        onClick={boundClickHandler}
        xs={10}
      >
        <Grid alignItems="center" container item justify="center" xs={2}>
          <TaskStatusIcon isSelected={selected} isSubTask styleName="fill-width" task={data} />
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
  selected: false,
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
  selected: PropTypes.bool,
};

export default SubTask;
