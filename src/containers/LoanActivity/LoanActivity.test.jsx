import React from 'react';
import { shallow } from 'enzyme';
import { TestHooks } from './LoanActivity';

const defaultProps = {
  loadTrials: jest.fn(),
  LoanNumber: 0,
  onAdditionalInfo: jest.fn(),
  onAdditionalInfoSelect: jest.fn(),
  onHistorySelect: jest.fn(),
};
describe('<LoanActivity />', () => {
  it('shows Trial widget in Loading mode', () => {
    const { LoanActivity } = TestHooks;
    const wrapper = shallow(
      <LoanActivity {...defaultProps} />,
    );
    const grid = wrapper.find('div');
    expect(grid).toHaveLength(1);
  });
  it('should render SweetAlertBox', () => {
    const loadTrials = jest.fn();
    const evalId = 'mock';
    const getTrialResponse = {
      status: 'mock',
      type: '',
      level: '',
    };
    const props = {
      loadTrials,
      evalId,
      getTrialResponse,
    };
    const { LoanActivity } = TestHooks;
    const handleClose = jest.spyOn(LoanActivity.prototype, 'handleClose');
    const wrapper = shallow(
      <LoanActivity {...defaultProps} {...props} />,
    );

    expect(wrapper.find('SweetAlertBox')).toHaveLength(1);
    wrapper.find('SweetAlertBox').at(0).simulate('confirm');
    expect(handleClose).toBeCalled();
  });
});
