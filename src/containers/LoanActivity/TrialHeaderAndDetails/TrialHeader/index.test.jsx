import React from 'react';
import { shallow } from 'enzyme';
import TrialHeader from './TrialHeader';

describe('<TrialHeader />', () => {
  it('should render TrialHeader component', () => {
    const trialHeader = {
      downPayment: 123,
      evalId: 123,
      fhaTrialLetterReceivedDate: 'mock',
      loanId: 123,
      resolutionChoiceType: 'mock',
      resolutionId: 123,
      trialAcceptanceDate: 'mock',
      trialName: 'mock',
    };
    const props = {
      trialHeader,
    };
    const wrapper = shallow(
      <TrialHeader {...props} />,
    );
    expect(wrapper.find('Fragment')).toHaveLength(1);
  });
  it('should not render TrialHeader component', () => {
    const trialHeader = {
    };
    const props = {
      trialHeader,
    };
    const wrapper = shallow(
      <TrialHeader {...props} />,
    );
    expect(wrapper.find('Fragment')).toHaveLength(0);
  });
  it('should render TrialHeader as Trial Period', () => {
    const trialHeader = {
      downPayment: 123,
      evalId: 123,
      fhaTrialLetterReceivedDate: new Date(),
      loanId: 123,
      resolutionChoiceType: 'mock',
      resolutionId: 123,
      trialAcceptanceDate: 'mock',
      trialName: 'Trial',
    };
    const props = {
      trialHeader,
    };
    const wrapper = shallow(
      <TrialHeader {...props} />,
    );
    expect(wrapper.find('Fragment')).toHaveLength(1);
    expect(wrapper.find('span').at(7).text()).toBe('Trial');
  });
});
