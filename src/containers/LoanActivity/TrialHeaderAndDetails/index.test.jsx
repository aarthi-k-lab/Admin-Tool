import React from 'react';
import { shallow } from 'enzyme';
import TrialHeaderAndDetails from '.';

describe('<TrialHeaderAndDetails />', () => {
  it('should render TrialHeaderAndDetails component', () => {
    const trialHeader = null;
    const props = {
      trialHeader,
    };
    const wrapper = shallow(
      <TrialHeaderAndDetails {...props} />,
    );
    expect(wrapper.find('Fragment')).toHaveLength(1);
  });
  it('should render UserNotification TrialHeader', () => {
    const resultUnderwriting = {
      level: 'success',
      status: 'mock',
    };
    const trialHeader = {
      trialName: 'mock',
    };
    const props = {
      resultUnderwriting,
      trialHeader,
    };
    const wrapper = shallow(
      <TrialHeaderAndDetails {...props} />,
    );
    expect(wrapper.find('UserNotification')).toHaveLength(1);
    expect(wrapper.find('TrialHeader')).toHaveLength(1);
  });
  it('should render TrialHeader as Trial Period', () => {
    const resultUnderwriting = {
      level: 'success',
      status: 'mock',
    };
    const trialHeader = {
      trialName: 'Trial',
    };
    const props = {
      resultUnderwriting,
      trialHeader,
    };
    const wrapper = shallow(
      <TrialHeaderAndDetails {...props} />,
    );
    expect(wrapper.find('UserNotification')).toHaveLength(1);
    expect(wrapper.find('TrialHeader')).toHaveLength(1);
    expect(wrapper.find('div').at(2).text()).toBe('Trial Period');
  });
  it('should render Loader component', () => {
    const inProgress = true;
    const props = {
      inProgress,
    };
    const wrapper = shallow(
      <TrialHeaderAndDetails {...props} />,
    );
    expect(wrapper.find('Loader')).toHaveLength(1);
  });
});
