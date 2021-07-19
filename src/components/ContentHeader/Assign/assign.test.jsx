import React from 'react';
import { shallow } from 'enzyme';
import { TestHooks } from './Assign';

const defaultProps = {
  assignResult: {
    taskStatus: '',
    taskData: {
      evalId: '',
      groupName: '',
      loanNumber: '',
      processStatus: '',
      taskCheckListId: '',
      taskCheckListTemplateName: '',
      wfProcessId: '',
      wfTaskId: '',
    },
    statusCode: '',
  },
  location: { pathname: '', search: '' },
  onAssignToMeClick: jest.fn(),
  onGetGroupName: jest.fn(),
  onAssignLoan: jest.fn(),
  onDialogClose: jest.fn(),
};
describe('< Assign>', () => {
  it('should render the assign component', () => {
    const wrapper = shallow(
      <TestHooks.Assign {...defaultProps} />,
    );
    expect(wrapper.find('Fragment')).toHaveLength(1);
  });
  it('should call the handleClick function', () => {
    const handleClick = jest.spyOn(TestHooks.Assign.prototype, 'handleClick');
    const wrapper = shallow(
      <TestHooks.Assign {...defaultProps} />,
    );
    wrapper.find('WithStyles(ForwardRef(Button))').at(0).simulate('click');
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
  it('should render sweet alert box', () => {
    const assignResult = {
      ...defaultProps.assignResult,
      status: 'mock',
    };
    const handleClose = jest.spyOn(TestHooks.Assign.prototype, 'handleClose');
    const wrapper = shallow(
      <TestHooks.Assign {...defaultProps} assignResult={assignResult} />,
    );
    expect(wrapper.find('SweetAlertBox')).toHaveLength(1);
    wrapper.find('SweetAlertBox').at(0).simulate('confirm');
    expect(handleClose).toHaveBeenCalledTimes(1);
  });
  it('should call onDialogClose function', () => {
    const assignResult = {
      ...defaultProps.assignResult,
      status: 'mock',
    };
    const handleClose = jest.spyOn(TestHooks.Assign.prototype, 'handleClose');
    const wrapper = shallow(
      <TestHooks.Assign {...defaultProps} assignResult={assignResult} />,
    );
    expect(wrapper.find('SweetAlertBox')).toHaveLength(1);
    wrapper.find('SweetAlertBox').at(0).simulate('confirm');
    expect(handleClose).toHaveBeenCalledTimes(2);
    expect(defaultProps.onDialogClose).toBeCalled();
  });
});
