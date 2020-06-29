import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import { TestHooks } from './TasksAndChecklist';
import {
  checklistItems,
  selectedTaskId,
  rootTaskId,
  selectedTaskBlueprintCode,
  inProgress,
  instructions,
  isAssigned,
  message,
  location,
  bookingChecklistItems,
} from '../../../models/Testmock/taskAndChecklist';
import configureStore from '../../../state';

const store = configureStore({
  dashboard: {
    groupName: 'DOCSIN',
    toggleWidget: false,
  },
});

const bookingStore = configureStore({
  dashboard: {
    groupName: 'BOOKING',
    toggleWidget: false,
  },
});


describe('<TasksAndChecklist />', () => {
  const onWidgetClick = jest.fn();
  const onWidgetToggle = jest.fn();
  const onUnassignBookingLoan = jest.fn();
  const putComputeRulesPassed = jest.fn();
  const setHomepageVisible = jest.fn();
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
    onWidgetClick,
    onWidgetToggle,
    onUnassignBookingLoan,
    setHomepageVisible,
    toggleWidget: false,
  };
  it('show TasksAndChecklist', () => {
    const wrapper = mount(
      <Provider store={store}>
        <TestHooks.TasksAndChecklist
          checklistItems={checklistItems}
          {...props}
        />
      </Provider>,
    );
    wrapper.find('WidgetIcon').at(1).simulate('click');
    expect(onWidgetToggle).toBeCalled();
    expect(onWidgetClick).toBeCalled();
    wrapper.setProps({
      children: (
        <TestHooks.TasksAndChecklist
          checklistItems={bookingChecklistItems}
          {...props}
          toggleWidget
        />
      ),
    });
    wrapper.find('WidgetIcon').at(1).simulate('click');
    expect(onUnassignBookingLoan).toBeCalled();
    expect(wrapper.find('SlaRules')).toHaveLength(15);
    wrapper.find('WidgetIcon').at(0).simulate('click');
    expect(onWidgetToggle).toBeCalledTimes(2);
  });
  it('should show the BookingHomePage', () => {
    const wrapper = mount(
      <Provider store={bookingStore}>
        <TestHooks.TasksAndChecklist
          checklistItems={checklistItems}
          {...props}
          groupName="BOOKING"
          isAssigned="false"
        />
      </Provider>,
    );
    wrapper.find('WidgetIcon').at(1).simulate('click');
    wrapper.setProps({
      children: (
        <TestHooks.TasksAndChecklist
          checklistItems={bookingChecklistItems}
          {...props}
          groupName="BOOKING"
          toggleWidget={false}
        />
      ),
    });
    expect(wrapper.find('BookingHomePage')).toHaveLength(1);
  });
});
