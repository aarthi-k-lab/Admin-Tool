import React from 'react';
import { shallow } from 'enzyme';
import { TestHooks } from './Assign';

describe('< Assign>', () => {
  const onAssignLoan = jest.fn();
  const onDialogClose = jest.fn();
  const onGetGroupName = jest.fn();
  const onAssignToMeClick = jest.fn();

  it('should render the assign component', () => {
    const props = {
      onAssignLoan,
      onDialogClose,
      onGetGroupName,
      onAssignToMeClick,
    };
    const wrapper = shallow(
      <TestHooks.Assign {...props} />,
    );
    expect(wrapper.find('Fragment')).toHaveLength(1);
  });
  it('should call the handleClick function', () => {
    const location = { pathname: '' };
    const props = {
      onAssignLoan,
      onDialogClose,
      onGetGroupName,
      onAssignToMeClick,
      location,
    };
    const handleClick = jest.spyOn(TestHooks.Assign.prototype, 'handleClick');
    const wrapper = shallow(
      <TestHooks.Assign {...props} />,
    );
    wrapper.find('WithStyles(ForwardRef(Button))').at(0).simulate('click');
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
  it('should render sweet alert box', () => {
    const location = { pathname: '' };
    const assignResult = {
      status: 'mock',
    };
    const props = {
      onAssignLoan,
      onDialogClose,
      onGetGroupName,
      onAssignToMeClick,
      location,
      assignResult,
    };
    const handleClose = jest.spyOn(TestHooks.Assign.prototype, 'handleClose');
    const wrapper = shallow(
      <TestHooks.Assign {...props} />,
    );
    expect(wrapper.find('SweetAlertBox')).toHaveLength(1);
    wrapper.find('SweetAlertBox').at(0).simulate('confirm');
    expect(handleClose).toHaveBeenCalledTimes(1);
  });
  it('should call onDialogClose function', () => {
    const location = { pathname: '' };
    const assignResult = {
      status: 'mock',
      taskData: {},
    };
    const props = {
      onAssignLoan,
      onDialogClose,
      onGetGroupName,
      onAssignToMeClick,
      location,
      assignResult,
    };
    const handleClose = jest.spyOn(TestHooks.Assign.prototype, 'handleClose');
    const wrapper = shallow(
      <TestHooks.Assign {...props} />,
    );
    expect(wrapper.find('SweetAlertBox')).toHaveLength(1);
    wrapper.find('SweetAlertBox').at(0).simulate('confirm');
    expect(handleClose).toHaveBeenCalledTimes(2);
    expect(onDialogClose).toBeCalled();
  });
});
