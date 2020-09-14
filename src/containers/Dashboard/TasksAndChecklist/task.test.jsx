/* eslint-disable no-undef */
import React from 'react';
import { shallow } from 'enzyme';
import ErrorIcon from '@material-ui/icons/Error';
import Checklist from 'components/Checklist';
import UserNotification from 'components/UserNotification/UserNotification';
import Loader from 'components/Loader/Loader';
import R from 'ramda';
import WidgetBuilder from 'components/Widgets/WidgetBuilder';
import CloseIcon from '@material-ui/icons/Close';
import CustomSnackBar from 'components/CustomSnackBar';
import { TestHooks } from './TasksAndChecklist';
import {
  checklistItems, selectedTaskId, rootTaskId, selectedTaskBlueprintCode, allRulesPassed,
  inProgress, instructions, isAssigned, message, location, bookingChecklistItems, allRulesFailed,
} from '../../../models/Testmock/taskAndChecklist';
import BookingHomePage from './BookingHomePage';
import DialogCard from './DialogCard';

describe('<TasksAndChecklist />', () => {
  const onWidgetClick = jest.fn();
  const onWidgetToggle = jest.fn();
  const onUnassignBookingLoan = jest.fn();
  const putComputeRulesPassed = jest.fn();
  const setHomepageVisible = jest.fn();
  const noTasksFoundMessage = 'No tasks assigned.Please contact your manager';
  const getNextErrorMessage = 'Get Next error';
  const taskFetchErrorMessage = 'Task Fetch Failed.Please try again Later';
  const props = {
    onUnassignBookingLoan,
    putComputeRulesPassed,
    location,
    selectedTaskId,
    rootTaskId,
    selectedTaskBlueprintCode,
    inProgress,
    instructions,
    isAssigned,
    message,
    groupName: 'DOCSIN',
    onWidgetClick,
    onWidgetToggle,
    setHomepageVisible,
    toggleWidget: false,
  };

  it('renderChecklist', () => {
    const wrapper = shallow(
      <TestHooks.TasksAndChecklist
        dataLoadStatus="loading"
        groupName="DOCSIN"
      />,
    );
    let userNotificationMessage = {
      type: 'do-not-display',
      msg: null,
    };
    wrapper.setProps({ dataLoadStatus: 'failed' });
    expect(wrapper.find(ErrorIcon)).toHaveLength(1);
    wrapper.setProps({ dataLoadStatus: 'completed', checklistItems: [] });
    expect(wrapper.find(Checklist)).toHaveLength(0);
    wrapper.setProps({ checklistItems, message: userNotificationMessage });
    expect(wrapper.find(UserNotification)).toHaveLength(0);
    userNotificationMessage = {
      type: 'Task Fetch Error',
      msg: 'Task Fetch Error',
    };
    wrapper.setProps({ checklistItems, message: userNotificationMessage });
    expect(wrapper.find(UserNotification)).toHaveLength(1);
    userNotificationMessage = {
      type: 'do-not-display',
      msg: null,
    };
    wrapper.setProps({ checklistItems, message: userNotificationMessage });
    expect(R.head(R.match(/checklist/g, wrapper.find(Checklist).prop('className')))).toBe('checklist');
    const headLens = R.lensPath([0, 'showPushData']);
    R.set(headLens, true, bookingChecklistItems);
    wrapper.setProps({
      checklistItems: R.set(headLens, true, bookingChecklistItems),
      message: userNotificationMessage,
      toggleWidget: true,
    });
    expect(R.head(R.match(/pushData/g, wrapper.find(Checklist).prop('className')))).toBe('pushData');
    wrapper.setProps({
      checklistItems: bookingChecklistItems,
      message: userNotificationMessage,
      groupName: 'BOOKING',
      toggleWidget: true,
    });
    expect(R.head(R.match(/sla-rules/g, wrapper.find(Checklist).prop('className')))).toBe('sla-rules');
    wrapper.setProps({ disposition: ['wait', 'hold'] });
    expect(wrapper.find(DialogCard).prop('message')).toBe('wait,hold');
    wrapper.setProps({ filter: true, passedRules: allRulesPassed, failedRules: allRulesFailed });
    expect(wrapper.find(Checklist).prop('checklistItems')).toBe(allRulesPassed);
    wrapper.setProps({ filter: false });
    expect(wrapper.find(Checklist).prop('checklistItems')).toBe(allRulesFailed);
    wrapper.setProps({ filter: null });
    expect(wrapper.find(Checklist).prop('checklistItems')).toBe(bookingChecklistItems);
  });

  it('Handler functions', () => {
    const userNotificationMessage = {
      type: 'do-not-display',
      msg: null,
    };
    const handleClearSubTask = jest.fn();
    const wrapper = shallow(
      <TestHooks.TasksAndChecklist
        checklistItems={checklistItems}
        groupName="DOCSIN"
        handleClearSubTask={handleClearSubTask}
        message={userNotificationMessage}
        onUnassignBookingLoan={onUnassignBookingLoan}
        onWidgetClick={onWidgetClick}
        onWidgetToggle={onWidgetToggle}
        toggleWidget
      />,
    );
    wrapper.find(Checklist).prop('handleClearSubTask')(false);
    expect(handleClearSubTask).not.toBeCalled();
    wrapper.find(Checklist).prop('handleClearSubTask')(true);
    expect(handleClearSubTask).toBeCalled();

    jest.clearAllMocks();
    wrapper.find(Checklist).prop('handleClearSubTask')(false);
    expect(handleClearSubTask).not.toBeCalled();

    wrapper.find(WidgetBuilder).prop('triggerHeader')(true, 'BookingAutomation');
    expect(onWidgetToggle).toBeCalledWith(false);
    expect(onUnassignBookingLoan).toBeCalled();
    expect(onWidgetClick).not.toBeCalled();

    jest.clearAllMocks();
    wrapper.setProps({ toggleWidget: false });
    wrapper.find(WidgetBuilder).prop('triggerHeader')(true, 'BookingAutomation');
    expect(onWidgetToggle).toBeCalledWith(true);
    expect(onUnassignBookingLoan).not.toBeCalled();
    expect(onWidgetClick).toBeCalled();

    jest.clearAllMocks();
    wrapper.setProps({ groupName: 'BOOKING' });
    wrapper.find(WidgetBuilder).prop('triggerHeader')(true, 'BookingAutomation');
    expect(onWidgetToggle).toHaveBeenLastCalledWith(true);
    expect(onUnassignBookingLoan).not.toBeCalled();
    expect(onWidgetClick).not.toBeCalled();

    jest.clearAllMocks();
    wrapper.find(WidgetBuilder).prop('triggerHeader')(true, 'Comments');
    expect(onWidgetToggle).not.toBeCalled();
    expect(onUnassignBookingLoan).not.toBeCalled();
    expect(onWidgetClick).not.toBeCalled();

    jest.clearAllMocks();
    wrapper.setProps({ toggleWidget: true });
    wrapper.find(Checklist).prop('onCompleteMyReviewClick')();
    expect(onWidgetToggle).toBeCalledWith(false);
    expect(onUnassignBookingLoan).toBeCalled();

    jest.clearAllMocks();
    wrapper.instance().componentDidMount();
    expect(onWidgetToggle).toBeCalledWith(true);

    jest.clearAllMocks();
    wrapper.setProps({ groupName: 'DOCSIN' });
    wrapper.find(CloseIcon).prop('onClick')();
    expect(onWidgetToggle).toBeCalledWith(false);
    expect(onUnassignBookingLoan).toBeCalled();


    jest.clearAllMocks();
    wrapper.instance().componentWillUnmount();
    expect(onWidgetToggle).toBeCalledWith(false);
    expect(onUnassignBookingLoan).toBeCalled();
  });

  it('getUserNotification', () => {
    let userNotificationMessage = {
      type: 'success',
      msg: 'Data load success',
    };
    expect(TestHooks.getUserNotification(userNotificationMessage))
      .toBe(userNotificationMessage);
    userNotificationMessage = {
      type: 'error',
      msg: 'Data load failure',
    };
    expect(TestHooks.getUserNotification(userNotificationMessage))
      .toStrictEqual(userNotificationMessage);
    userNotificationMessage = {
      type: 'Fail',
    };
    const doNotDisplay = { type: 'do-not-display' };
    expect(TestHooks.getUserNotification(userNotificationMessage))
      .toStrictEqual(doNotDisplay);
    userNotificationMessage = {
      type: 'error',
      data: {
        evalSubStatus: {
          expected: 'Missing Docs',
        },
        resolutionSubStatus: {
          expected: ['first', 'second'],
        },
        evalStatus: {
          expected: ['first'],
        },
      },
    };
    const error = {
      type: 'error',
      msg: [
        "'EvalSubStatus' should not be 'Missing Docs'",
        "'ResolutionSubStatus' should not be 'First' or 'Second'",
        "'EvalStatus' should not be 'First'",
      ],
    };
    expect(TestHooks.getUserNotification(userNotificationMessage)).toStrictEqual(error);
  });

  it('ChecklistErrorMessage', () => {
    let isGetNextError = false;
    let taskFetchError = false;
    let noTasksFound = false;
    const checklistError = 'checklist-fetch-failed';
    const noChecklistId = 'no-checklist-id-present';

    expect(TestHooks.getChecklistErrorMessage(null, taskFetchError, noTasksFound, isGetNextError)).toBe('');
    taskFetchError = true;
    expect(TestHooks.getChecklistErrorMessage(checklistError, taskFetchError,
      noTasksFound, isGetNextError)).toBe('Checklist fetch failed. Please try again later.');
    expect(TestHooks.getChecklistErrorMessage(noChecklistId, taskFetchError,
      noTasksFound, isGetNextError)).toBe('Checklist not found.');
    taskFetchError = true;
    expect(TestHooks.getChecklistErrorMessage('', taskFetchError,
      noTasksFound, isGetNextError)).toBe(taskFetchErrorMessage);
    taskFetchError = false;
    noTasksFound = true;
    expect(TestHooks.getChecklistErrorMessage('', taskFetchError,
      noTasksFound, isGetNextError)).toBe(noTasksFoundMessage);
    taskFetchError = false;
    noTasksFound = false;
    isGetNextError = true;
    expect(TestHooks.getChecklistErrorMessage('', taskFetchError,
      noTasksFound, isGetNextError, getNextErrorMessage)).toBe(getNextErrorMessage);
  });

  it('HotKeys', () => {
    const userNotificationMessage = {
      type: 'do-not-display',
      msg: null,
    };
    const onNext = jest.fn();
    const onPrev = jest.fn();
    const wrapper = shallow(
      <TestHooks.TasksAndChecklist
        checklistItems={checklistItems}
        disableNext
        disablePrev
        groupName="DOCSIN"
        message={userNotificationMessage}
        onNext={onNext}
        onPrev={onPrev}
        toggleWidget
      />,
    );
    document.dispatchEvent(new KeyboardEvent('keydown', { keyCode: 39 }));
    document.dispatchEvent(new KeyboardEvent('keyup', { keyCode: 39 }));
    expect(onNext).not.toBeCalled();
    wrapper.setProps({ disableNext: false, onNext });
    document.dispatchEvent(new KeyboardEvent('keydown', { keyCode: 39 }));
    document.dispatchEvent(new KeyboardEvent('keyup', { keyCode: 39 }));
    expect(onNext).toBeCalled();

    document.dispatchEvent(new KeyboardEvent('keydown', { keyCode: 37 }));
    document.dispatchEvent(new KeyboardEvent('keyup', { keyCode: 37 }));
    expect(onPrev).not.toBeCalled();
    wrapper.setProps({ disablePrev: false, onPrev });
    document.dispatchEvent(new KeyboardEvent('keydown', { keyCode: 37 }));
    document.dispatchEvent(new KeyboardEvent('keyup', { keyCode: 37 }));
    expect(onPrev).toBeCalled();
  });

  it('snackBar', () => {
    const snackBar = {
      message: 'Task fetch failed',
      open: true,
      type: 'error',
    };
    const wrapper = shallow(
      <TestHooks.TasksAndChecklist
        dataLoadStatus="loading"
        groupName="DOCSIN"
        snackBarData={snackBar}
      />,
    );
    expect(wrapper.find(CustomSnackBar).prop('message')).toBe('Task fetch failed');
  });

  it('show TasksAndChecklist', () => {
    const push = jest.fn();
    const historyMock = { push };
    const wrapper = shallow(
      <TestHooks.TasksAndChecklist
        checklistItems={checklistItems}
        {...props}
        groupName="BOOKING"
        history={historyMock}
        isAssigned
      />,
    );
    expect(wrapper.find(BookingHomePage).prop('message')).toBe('Booking Widget');
    wrapper.setProps({ isAssigned: false });
    expect(wrapper.find(BookingHomePage).prop('message')).toBe('Assign to me');
    wrapper.setProps({ isPostModEndShift: true });
    expect(push).toBeCalledWith('/stager');
    wrapper.setProps({ isPostModEndShift: false, completeReviewResponse: { message: 'success' } });
    expect(push).toBeCalledWith('/special-loan');
    wrapper.setProps({ completeReviewResponse: null, inProgress: true });
    expect(wrapper.find(Loader)).toHaveLength(1);
    wrapper.setProps({
      inProgress: false,
      noTasksFound: true,
      checklistErrorMessage: noTasksFoundMessage,
    });
    expect(wrapper.find(UserNotification)).toHaveLength(1);
    expect(wrapper.find(UserNotification).prop('message')).toBe(noTasksFoundMessage);
    wrapper.setProps({
      noTasksFound: false,
      taskFetchError: true,
      checklistErrorMessage: taskFetchErrorMessage,
    });
    expect(wrapper.find(UserNotification)).toHaveLength(1);
    expect(wrapper.find(UserNotification).prop('message')).toBe(taskFetchErrorMessage);

    wrapper.setProps({
      taskFetchError: false,
      isGetNextError: true,
      checklistErrorMessage: getNextErrorMessage,
    });
    expect(wrapper.find(UserNotification)).toHaveLength(1);
    expect(wrapper.find(UserNotification).prop('message')).toBe(getNextErrorMessage);
    wrapper.setProps({
      taskFetchError: false,
      isGetNextError: true,
      checklistErrorMessage: '',
    });
    expect(wrapper.find(UserNotification)).toHaveLength(0);
    // noTasksFound || taskFetchError || isGetNextError
  });
});
