import React from 'react';
import { shallow } from 'enzyme';
import { TestHooks } from './StagerPopup';

describe('<StagerPopUp >', () => {
  const getStagerGroup = jest.fn();
  const onClearDocGenAction = jest.fn();
  const triggerDispositionOperationCall = jest.fn();
  it('should call the handlePopUp function', () => {
    const action = '';
    const popupData = {
      hitLoans: [],
      missedLoans: ['mock1', 'mock2'],
    };
    const props = {
      getStagerGroup,
      onClearDocGenAction,
      triggerDispositionOperationCall,
      action,
      popupData,
    };
    const handlePopUp = jest.spyOn(TestHooks.StagerPopup.prototype, 'handlePopUp');
    const onCloseClick = jest.spyOn(TestHooks.StagerPopup.prototype, 'onCloseClick');
    const onEyeIconClick = jest.spyOn(TestHooks.StagerPopup.prototype, 'onEyeIconClick');
    const onRetryClick = jest.spyOn(TestHooks.StagerPopup.prototype, 'onRetryClick');
    const wrapper = shallow(
      <TestHooks.StagerPopup {...props} />,
    );
    wrapper.find('WithStyles(ForwardRef(ExpansionPanel))').simulate('change');
    expect(handlePopUp).toBeCalled();
    wrapper.find('WithStyles(ForwardRef(Button))').at(1).simulate('click');
    expect(onCloseClick).toBeCalled();
    expect(onClearDocGenAction).toBeCalledTimes(1);
    wrapper.find('RemoveRedEyeIcon').at(0).simulate('click');
    expect(onEyeIconClick).toBeCalled();
    wrapper.find('WithStyles(ForwardRef(Button))').at(0).simulate('click');
    expect(onRetryClick).toBeCalled();
  });
  it('should call the handleCheckbox function', () => {
    const action = '';
    const popupData = {
      missedLoans: ['mock1', 'mock2'],
    };
    const props = {
      getStagerGroup,
      onClearDocGenAction,
      triggerDispositionOperationCall,
      action,
      popupData,
    };
    const handlePopUp = jest.spyOn(TestHooks.StagerPopup.prototype, 'handlePopUp');
    const onCloseClick = jest.spyOn(TestHooks.StagerPopup.prototype, 'onCloseClick');
    const onRetryClick = jest.spyOn(TestHooks.StagerPopup.prototype, 'onRetryClick');
    const handleCheckbox = jest.spyOn(TestHooks.StagerPopup.prototype, 'handleCheckbox');
    const wrapper = shallow(
      <TestHooks.StagerPopup {...props} />,
    );
    wrapper.find('WithStyles(ForwardRef(ExpansionPanel))').simulate('change');
    expect(handlePopUp).toBeCalled();
    wrapper.find('WithStyles(ForwardRef(Button))').at(1).simulate('click');
    expect(onCloseClick).toBeCalled();
    expect(onClearDocGenAction).toBeCalledTimes(3);
    wrapper.find('WithStyles(ForwardRef(Button))').at(0).simulate('click');
    expect(onRetryClick).toBeCalled();
    wrapper.setState({ checkedData: [{}, {}] });
    wrapper.find('WithStyles(ForwardRef(Checkbox))').at(0).simulate('change', { target: {} });
    expect(handleCheckbox).toBeCalled();
    wrapper.find('WithStyles(ForwardRef(Checkbox))').at(0).simulate('change', { target: { checked: true } });
    expect(handleCheckbox).toBeCalled();
  });
  it('should call the handleCheckbox function', () => {
    const action = '';
    const popupData = {
    };
    const props = {
      getStagerGroup,
      onClearDocGenAction,
      triggerDispositionOperationCall,
      action,
      popupData,
    };
    const onCloseClick = jest.spyOn(TestHooks.StagerPopup.prototype, 'onCloseClick');
    const wrapper = shallow(
      <TestHooks.StagerPopup {...props} />,
    );
    expect(onCloseClick).toBeCalled();
  });
});
