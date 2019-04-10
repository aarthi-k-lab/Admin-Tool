import React from 'react';
import RouteAccess from 'lib/RouteAccess';
import { arrayToString } from 'lib/ArrayUtils';
import UserNotification from 'components/UserNotification/UserNotification';
import * as R from 'ramda';

const LEVEL_ERROR = 'error';
const LEVEL_SUCCESS = 'success';

const MSG_TASK_FETCH_ERROR = 'Task Fetch Failed. Please try again Later';
const MSG_NO_TASKS_FOUND = 'No tasks assigned. Please contact your manager';
const MSG_CAN_UNASSIGN = 'Please click Unassign to unassign the task from the user.';
const MSG_CANNOT_UNASSIGN = 'Please note only Manager can unassign the task.';
const MSG_SHOULD_ASSIGN = 'WARNING – You are not assigned to this task. Please select “Assign to Me” to begin working.';
const MSG_DSPN_SUCCESS = 'The task has been dispositioned successfully with disposition';

function reduceMessageListToMessage(acc, msg) {
  acc.push(msg);
  acc.push(<br key={msg} />);
  return acc;
}

function getMessage(
  taskFetchError,
  noTasksFound,
  errorMessages,
  groups,
  showAssign,
  isAssigned,
  enableGetNext,
  disposition,
) {
  let level = LEVEL_ERROR;
  let message = null;
  if (taskFetchError) {
    message = MSG_TASK_FETCH_ERROR;
  } else if (noTasksFound) {
    message = MSG_NO_TASKS_FOUND;
  } else if (enableGetNext) {
    const prettifiedDisposition = arrayToString([disposition]);
    message = `${MSG_DSPN_SUCCESS} ${prettifiedDisposition}`;
    level = LEVEL_SUCCESS;
  } else if (errorMessages.length > 0) {
    message = R.is(Array, errorMessages)
      ? errorMessages.reduce(reduceMessageListToMessage, []) : errorMessages;
  } else if (RouteAccess.hasManagerDashboardAccess(groups) && showAssign) {
    message = MSG_CAN_UNASSIGN;
  } else if (showAssign) {
    message = MSG_CANNOT_UNASSIGN;
  } else if (!isAssigned) {
    message = MSG_SHOULD_ASSIGN;
  }
  return {
    level,
    message,
  };
}

function renderErrorNotification(
  disposition,
  enableGetNext, isAssigned, noTasksFound, taskFetchError,
  errorMessages,
  user,
  showAssign,
) {
  const groups = user && user.groupList;
  const { level, message } = getMessage(
    taskFetchError, noTasksFound, errorMessages, groups,
    showAssign, isAssigned, enableGetNext, disposition,
  );
  if (!R.isNil(message)) {
    return (
      <UserNotification level={level} message={message} type="alert-box" />
    );
  }
  return null;
}

const DashboardErrors = {
  renderErrorNotification,
};

export default DashboardErrors;
