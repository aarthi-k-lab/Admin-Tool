import React from 'react';
import { shallow } from 'enzyme';
import { TestExports } from './StagerDashboard';

const defaultProps = {
  selectedData: [],
  onClearDocGenAction: jest.fn(),
  onClearStagerTaskName: jest.fn(),
  getDashboardData: jest.fn(),
  onClearPostModEndShitf: jest.fn(),
  getStagerSearchResponse: {},
  user: {
    userDetails: {
      email: 'test@mrc.com',
    },
    skills: [],
  },
  group: '',
};
describe('<StagerDashboard />', () => {
  it('shows StagerPage', () => {
    const getDashboardCounts = jest.fn();
    const triggerStagerValue = jest.fn();
    const triggerStartEndDate = jest.fn();
    const onGetGroupName = jest.fn();
    const closeSnackBar = jest.fn();
    const onEndShift = jest.fn();
    const groups = ['feuw-mgr', 'beuw-mgr', 'stager', 'stager-mgr'];
    const props = {
      getDashboardCounts,
      triggerStagerValue,
      triggerStartEndDate,
      onGetGroupName,
      closeSnackBar,
      onEndShift,
      groups,
      snackBarData: {
        message: 'mock',
        open: true,
        type: 'mock',
      },
      onClearStagerResponse: jest.fn(),
      onClearSearchResponse: jest.fn(),
      onCheckBoxClick: jest.fn(),
      triggerOrderCall: jest.fn(),
    };
    const wrapper = shallow(
      <TestExports.StagerDashboard
        {...defaultProps}
        {...props}
      />,
    );
    expect(wrapper).toHaveLength(1);
  });
});

describe('<StagerDashboard /> simulate functionalities', () => {
  const getDashboardCounts = jest.fn();
  const triggerStagerValue = jest.fn();
  const triggerStartEndDate = jest.fn();
  const onGetGroupName = jest.fn();
  const closeSnackBar = jest.fn();
  const onEndShift = jest.fn();
  const groups = ['feuw-mgr', 'beuw-mgr', 'stager', 'stager-mgr'];
  const props = {
    getDashboardCounts,
    triggerStagerValue,
    triggerStartEndDate,
    onGetGroupName,
    closeSnackBar,
    onEndShift,
    groups,
    snackBarData: {
      message: 'mock',
      open: true,
      type: 'mock',
    },
    onClearStagerResponse: jest.fn(),
    onClearSearchResponse: jest.fn(),
    onCheckBoxClick: jest.fn(),
    triggerOrderCall: jest.fn(),
    onClearDocGenAction: jest.fn(),
    onClearStagerTaskName: jest.fn(),
    getDashboardData: jest.fn(),
    onClearPostModEndShitf: jest.fn(),
    selectedData: [],
  };
  const wrapper = shallow(
    <TestExports.StagerDashboard
      {...defaultProps}
      {...props}
    />,
  );
  it('should call closeSnackBar on CustomSnackbar close', () => {
    wrapper.find('CustomSnackbar').simulate('close');
    expect(props.closeSnackBar).toBeCalledTimes(1);
  });
  it('should call onClearStagerResponse on stagerChange', () => {
    wrapper.find('withRouter(Connect(StagerPage))').simulate('stagerChange');
    expect(props.onClearStagerResponse).toBeCalledTimes(1);
    expect(props.onClearSearchResponse).toBeCalledTimes(1);
    expect(props.onCheckBoxClick).toBeCalledTimes(1);
  });
  it('should call triggerOrderCall on StagerPage orderClick', () => {
    wrapper.find('withRouter(Connect(StagerPage))').simulate('orderClick', 'mock', 'mock');
    expect(props.triggerOrderCall).toBeCalledTimes(1);
  });
  it('should call refreshDashboard on StagerPage referesh', () => {
    wrapper.find('withRouter(Connect(StagerPage))').prop('refreshDashboard')();
    expect(props.onCheckBoxClick).toBeCalledTimes(2);
  });
  it('should call getDashboardCounts on StatusCardClick', () => {
    wrapper.find('withRouter(Connect(StagerPage))').simulate('statusCardClick', 'mock', 'mock');
    expect(props.getDashboardCounts).toBeCalledTimes(4);
  });
  it('should call onCheckBoxClick on checkBoxClick', () => {
    wrapper.find('withRouter(Connect(StagerPage))').simulate('checkBoxClick', 'mock', 'mock');
    expect(props.onCheckBoxClick).toBeCalledTimes(4);
  });
  it('should call onSelectAll on selectAll', () => {
    wrapper.find('withRouter(Connect(StagerPage))').simulate('selectAll', 'mock', 'mock');
    expect(props.onCheckBoxClick).toBeCalledTimes(5);
  });
});
