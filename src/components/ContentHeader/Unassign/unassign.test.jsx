import React from 'react';
import { shallow } from 'enzyme';
import { TestHooks } from './Unassign';

describe('<Unassign >', () => {
  const onUnassignLoan = jest.fn();
  const onUnassignSuccess = jest.fn();
  it('should render the dialog box', () => {
    const unassignResult = {
      cmodProcess: {
        taskStatus: 'Paused',
      },
    };
    const user = {
      skills: {},
    };
    const props = {
      onUnassignLoan,
      onUnassignSuccess,
      unassignResult,
      user,
    };
    const handleClick = jest.spyOn(TestHooks.Unassign.prototype, 'handleClick');
    const handleClose = jest.spyOn(TestHooks.Unassign.prototype, 'handleClose');
    const wrapper = shallow(
      <TestHooks.Unassign {...props} />,
    );
    wrapper.find('WithStyles(ForwardRef(Button))').simulate('click');
    expect(handleClick).toBeCalled();
    wrapper.find('DialogBox').simulate('close');
    expect(handleClose).toBeCalled();
  });
  it('should not render the dialog box', () => {
    const unassignResult = {
    };
    const user = {
      skills: {},
    };
    const props = {
      onUnassignLoan,
      onUnassignSuccess,
      unassignResult,
      user,
    };
    const wrapper = shallow(
      <TestHooks.Unassign {...props} />,
    );
    expect(wrapper.find('DialogBox')).toHaveLength(0);
  });
  it('should render the dialog box with appropriate message for Not Paused', () => {
    const unassignResult = {
      cmodProcess: {
        taskStatus: 'Not Paused',
      },
    };
    const user = {
      skills: {},
    };
    const props = {
      onUnassignLoan,
      onUnassignSuccess,
      unassignResult,
      user,
    };
    const handleClick = jest.spyOn(TestHooks.Unassign.prototype, 'handleClick');
    const handleClose = jest.spyOn(TestHooks.Unassign.prototype, 'handleClose');
    const wrapper = shallow(
      <TestHooks.Unassign {...props} />,
    );
    expect(wrapper.find('DialogBox')).toHaveLength(1);
    expect(wrapper.find('DialogBox').props().message).toBe('A user is currently working on this task and is unable to be unassigned.');
  });
  it('should render the dialog box with appropriate message for default case', () => {
    const unassignResult = {
      cmodProcess: {
        taskStatus: 'mock',
      },
    };
    const user = {
      skills: {},
    };
    const props = {
      onUnassignLoan,
      onUnassignSuccess,
      unassignResult,
      user,
    };
    const handleClick = jest.spyOn(TestHooks.Unassign.prototype, 'handleClick');
    const handleClose = jest.spyOn(TestHooks.Unassign.prototype, 'handleClose');
    const wrapper = shallow(
      <TestHooks.Unassign {...props} />,
    );
    expect(wrapper.find('DialogBox')).toHaveLength(1);
    expect(wrapper.find('DialogBox').props().message).toBe('Currently one of the services is down. Please try again. If you still facing this issue, please reach to IT team.');
  });
});
