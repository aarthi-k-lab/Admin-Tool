import React from 'react';
import { shallow } from 'enzyme';
import ErrorIcon from '@material-ui/icons/Error';
import Checklist from 'components/Checklist';
import UserNotification from 'components/UserNotification/UserNotification';
import Loader from 'components/Loader/Loader';
import R from 'ramda';
import CloseIcon from '@material-ui/icons/Close';
import CustomSnackBar from 'components/CustomSnackBar';
import { TestHooks } from './TasksAndChecklist';
import {
  checklistItems, selectedTaskId, rootTaskId, selectedTaskBlueprintCode, allRulesPassed,
  inProgress, instructions, isAssigned, message, location, bookingChecklistItems, allRulesFailed,
} from '../../../models/Testmock/taskAndChecklist';
import BookingHomePage from './BookingHomePage';
import DialogCard from './DialogCard';
import { BOOKING } from '../../../constants/widgets';


describe('<TasksAndChecklist />', () => {
  const openWidgetList = [BOOKING];
  const onWidgetClick = jest.fn();
  const onWidgetToggle = jest.fn();
  const putComputeRulesPassed = jest.fn();
  const setHomepageVisible = jest.fn();
  const onHistorySelect = jest.fn();
  const onNext = jest.fn();
  const noTasksFoundMessage = 'No tasks assigned.Please contact your manager';
  const getNextErrorMessage = 'Get Next error';
  const taskFetchErrorMessage = 'Task Fetch Failed.Please try again Later';
  const props = {
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
    onHistorySelect,
    onWidgetClick,
    onWidgetToggle,
    setHomepageVisible,
    onNext,
    toggleWidget: false,
  };

  it('renderChecklist', () => {
    const onPrev = jest.fn();
    const wrapper = shallow(
      <TestHooks.TasksAndChecklist
        dataLoadStatus="loading"
        groupName="DOCSIN"
        onNext={onNext}
        onPrev={onPrev}
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
      currentWidget: BOOKING,
      openWidgetList,
    });
    expect(R.head(R.match(/pushData/g, wrapper.find(Checklist).prop('className')))).toBe('pushData');
    wrapper.setProps({
      checklistItems: bookingChecklistItems,
      message: userNotificationMessage,
      groupName: 'BOOKING',
      openWidgetList,
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
    const onPrev = jest.fn();
    const wrapper = shallow(
      <TestHooks.TasksAndChecklist
        checklistItems={checklistItems}
        groupName="DOCSIN"
        handleClearSubTask={handleClearSubTask}
        message={userNotificationMessage}
        onHistorySelect={onHistorySelect}
        onNext={onNext}
        onPrev={onPrev}
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

    wrapper.setProps({ groupName: 'BOOKING' });
    jest.clearAllMocks();
    wrapper.instance().componentDidMount();
    expect(onWidgetToggle).toBeCalledWith({ currentWidget: BOOKING, openWidgetList: [BOOKING] });

    jest.clearAllMocks();
    wrapper.setProps({ groupName: 'DOCSIN' });
    wrapper.setProps({ openWidgetList: [BOOKING] });
    wrapper.find(Checklist).prop('onCompleteMyReviewClick')();
    expect(onWidgetToggle).toBeCalledWith({ currentWidget: '', openWidgetList: [] });

    jest.clearAllMocks();
    wrapper.setProps({ groupName: 'DOCSIN' });
    wrapper.find(CloseIcon).prop('onClick')();
    expect(onWidgetToggle).toBeCalledWith({ currentWidget: '', openWidgetList: [] });


    jest.clearAllMocks();
    wrapper.instance().componentWillUnmount();
    expect(onWidgetToggle).toBeCalledWith({ currentWidget: '', openWidgetList: [] });
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
        openWidgetList={[BOOKING]}
      />,
    );
    document.dispatchEvent(new KeyboardEvent('keydown', { keyCode: 39 }));
    document.dispatchEvent(new KeyboardEvent('keyup', { keyCode: 39 }));
    expect(onNext).not.toBeCalled();
    wrapper.setProps({ disableNext: false, onNext });
    document.dispatchEvent(new KeyboardEvent('keydown', { keyCode: 39 }));
    document.dispatchEvent(new KeyboardEvent('keyup', { keyCode: 39 }));

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
    const onPrev = jest.fn();
    const wrapper = shallow(
      <TestHooks.TasksAndChecklist
        dataLoadStatus="loading"
        groupName="DOCSIN"
        onNext={onNext}
        onPrev={onPrev}
        snackBarData={snackBar}
      />,
    );
    expect(wrapper.find(CustomSnackBar).prop('message')).toBe('Task fetch failed');
  });

  it('show TasksAndChecklist', () => {
    const push = jest.fn();
    const historyMock = { push };
    const onPrev = jest.fn();
    const wrapper = shallow(
      <TestHooks.TasksAndChecklist
        checklistItems={checklistItems}
        {...props}
        groupName="BOOKING"
        history={historyMock}
        isAssigned
        onNext={onNext}
        onPrev={onPrev}
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
