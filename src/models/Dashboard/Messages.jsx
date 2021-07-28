import React from 'react';
import RouteAccess from 'lib/RouteAccess';
import { arrayToString } from 'lib/ArrayUtils';
import { ERROR, SUCCESS } from 'constants/common';
import UserNotification from 'components/UserNotification/UserNotification';
import * as R from 'ramda';

const LEVEL_FAILED = 'Failed';
const MSG_SENDTOCOVIUS_FAILED = 'Unable to send to Covius at this time. Please try again later.';
const MSG_SERVICE_DOWN = 'Currently one of the services is down. Please try again. If you still facing this issue, please reach out to IT team.';
const MSG_FILE_UPLOAD_FAILURE = 'Unable to convert the file to correct format. Please reupload and try again. If the issue continues, please reach out to the CMOD Support team';
const MSG_FILE_DOWNLOAD_FAILURE = 'The conversion to excel has failed. Please reach out to the CMOD Support team to troubleshoot.';
const MSG_TASK_FETCH_ERROR = 'Task Fetch Failed. Please try again Later';
const MSG_NO_TASKS_FOUND = 'Currently no tasks are available for your assigned skills. Please try again later.';
const MSG_CAN_UNASSIGN = 'Please click Unassign to unassign the task from the user.';
const MSG_CANNOT_UNASSIGN = 'Please note only Manager can unassign the task.';
const MSG_SHOULD_ASSIGN = 'WARNING – You are not assigned to this task. Please select “Assign to Me” to begin working.';
const MSG_DSPN_SUCCESS = 'The task has been dispositioned successfully with disposition';
const MSG_VALIDATION_SUCCESS = 'Validation successful!';
const MSG_UPDATED_REMEDY = 'Successfully Updated Remedy';
const SUCCESS_MESSAGES = [MSG_VALIDATION_SUCCESS, MSG_UPDATED_REMEDY];

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
  isGetNextError,
  getNextError,
) {
  let level = ERROR;
  let message = null;
  if (taskFetchError) {
    message = MSG_TASK_FETCH_ERROR;
  } else if (noTasksFound) {
    message = MSG_NO_TASKS_FOUND;
  } else if (isGetNextError) {
    message = getNextError;
  } else if (errorMessages
    && !R.is(Array, errorMessages) && SUCCESS_MESSAGES.includes(errorMessages)) {
    message = errorMessages;
    level = SUCCESS;
  } else if (errorMessages && errorMessages.length > 0) {
    message = R.is(Array, errorMessages)
      ? errorMessages.reduce(reduceMessageListToMessage, []) : errorMessages;
  } else if (enableGetNext) {
    const prettifiedDisposition = arrayToString([disposition]);
    message = `${MSG_DSPN_SUCCESS} ${prettifiedDisposition}`;
    level = SUCCESS;
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
  isGetNextError,
  getNextError,
) {
  const groups = user && user.groupList;
  const { level, message } = getMessage(
    taskFetchError, noTasksFound, errorMessages, groups,
    showAssign, isAssigned, enableGetNext, disposition, isGetNextError, getNextError,
  );
  if (!R.isNil(message)) {
    return (
      <UserNotification level={level} message={message} type="alert-box" />
    );
  }
  return null;
}

const Messages = {
  renderErrorNotification,
  reduceMessageListToMessage,
  MSG_VALIDATION_SUCCESS,
  MSG_UPDATED_REMEDY,
  MSG_SERVICE_DOWN,
  LEVEL_FAILED,
  MSG_FILE_UPLOAD_FAILURE,
  MSG_FILE_DOWNLOAD_FAILURE,
  MSG_SENDTOCOVIUS_FAILED,
};

export default Messages;
