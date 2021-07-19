import React from 'react';
import { shallow } from 'enzyme';
import { TestHooks } from './SlaHeader';

describe('renders <SlaHeader />', () => {
  const props = {
    passedRules: [],
    failedRules: [],
    resolutionData: [{ resolutionId: '' }],
    allRules: [],
    clearRuleResponse: jest.fn(),
    closeSweetAlert: jest.fn(),
    disabled: true,
    disablePushData: true,
    enablePushDataButton: true,
    filter: true,
    handleValueChange: jest.fn(),
    isAllRulesPassed: true,
    isAssigned: true,
    resolutionId: '123',
    resolutionText: 'mock',
    resultData: {
      clearData: 'mock',
      isOpen: true,
      level: 'mock',
      showConfirmButton: true,
      status: 'mock',
      title: 'mock',
    },
    showContinueMyReview: false,
    slaRulesProcessed: false,
    showPushDataButton: false,
    ruleResponse: {},
    triggerPushData: jest.fn(),
    triggerSetSLAvalues: jest.fn(),
    triggerResolutionIdStats: jest.fn(),
    triggerFilterRules: jest.fn(),
    title: 'mock',
    taskCode: '',
    text: '',
  };
  const wrapper = shallow(
    <TestHooks.LabelWithIcon {...props} />,
  );
  it('render SlaHeader', () => {
    expect(wrapper.find('Fragment')).toHaveLength(1);
  });
  it('should call triggerSetSLAvalues on push data click', () => {
    wrapper.find('WithStyles(ForwardRef(Button))').at(0).simulate('click');
    expect(props.triggerSetSLAvalues).toBeCalledTimes(1);
  });
  it('should call triggerResolutionIdStats on push data click', () => {
    wrapper.setState({ resolutionText: 'mock' });
    wrapper.find('WithStyles(ForwardRef(Button))').at(0).simulate('click');
    expect(props.triggerSetSLAvalues).toBeCalledTimes(2);
    expect(props.triggerResolutionIdStats).toBeCalledTimes(1);
  });
  it('should call triggerFilterRules on Passed click', () => {
    wrapper.find('WithStyles(ForwardRef(Button))').at(1).simulate('click');
    expect(props.triggerFilterRules).toBeCalledTimes(1);
  });
  it('should call triggerFilterRules on Failed click', () => {
    wrapper.find('WithStyles(ForwardRef(Button))').at(2).simulate('click');
    expect(props.triggerFilterRules).toBeCalledTimes(2);
  });
  it('should call triggerSetSLAvalues on value change', () => {
    wrapper.find('WithStyles(ForwardRef(Select))').at(0).simulate('change', { target: { value: 'mock' } });
    expect(props.triggerSetSLAvalues).toBeCalledTimes(3);
  });
  it('should call closeSweetAlert  on sweetalert confirm', () => {
    wrapper.find('SweetAlertBox').at(0).simulate('confirm');
    expect(props.closeSweetAlert).toBeCalledTimes(1);
  });
});

describe('renders <SlaHeader /> sweetalert functionalites and push data', () => {
  const props = {
    passedRules: [],
    failedRules: [],
    resolutionData: [{ resolutionId: '' }],
    allRules: [],
    clearRuleResponse: jest.fn(),
    closeSweetAlert: jest.fn(),
    disabled: true,
    disablePushData: true,
    enablePushDataButton: true,
    filter: true,
    handleValueChange: jest.fn(),
    isAllRulesPassed: true,
    isAssigned: true,
    resolutionId: '123',
    resolutionText: 'mock',
    resultData: {
    },
    ruleResponse: {},
    showPushDataButton: true,
    triggerPushData: jest.fn(),
    triggerSetSLAvalues: jest.fn(),
    triggerResolutionIdStats: jest.fn(),
    triggerFilterRules: jest.fn(),
    title: 'mock',
    showContinueMyReview: false,
    slaRulesProcessed: false,
    taskCode: '',
    text: 'mock',
  };
  const wrapper = shallow(
    <TestHooks.LabelWithIcon {...props} />,
  );
  it('should call triggerPushData on pushdata click', () => {
    wrapper.find('WithStyles(ForwardRef(Button))').at(0).simulate('click');
    expect(props.triggerPushData).toBeCalledTimes(1);
  });
  it('should call clearRuleResponse on rule response sweetalert click', () => {
    wrapper.find('n').at(0).simulate('confirm');
    expect(props.clearRuleResponse).toBeCalledTimes(1);
  });
});

describe('renders <SlaHeader /> no sweetalert', () => {
  const props = {
    passedRules: [],
    failedRules: [],
    resolutionData: [{ resolutionId: '' }],
    allRules: [],
    clearRuleResponse: jest.fn(),
    closeSweetAlert: jest.fn(),
    disabled: true,
    disablePushData: true,
    enablePushDataButton: true,
    filter: false,
    handleValueChange: jest.fn(),
    isAllRulesPassed: true,
    isAssigned: true,
    resolutionId: '123',
    resolutionText: 'mock',
    resultData: {},
    ruleResponse: {},
    triggerHeader: true,
    showPushDataButton: true,
    triggerPushData: jest.fn(),
    triggerSetSLAvalues: jest.fn(),
    triggerResolutionIdStats: jest.fn(),
    triggerFilterRules: jest.fn(),
    title: 'Post mock',
    showContinueMyReview: false,
    slaRulesProcessed: false,
    taskCode: '',
    text: 'mock',
  };
  const wrapper = shallow(
    <TestHooks.LabelWithIcon {...props} />,
  );
  it('should not render sweetalert', () => {
    expect(wrapper.find('SweetAlertBox')).toHaveLength(0);
  });
  it('should call triggerFilterRules on component unmount', () => {
    wrapper.instance().componentWillUnmount();
    expect(props.triggerFilterRules).toBeCalledTimes(1);
  });
});
