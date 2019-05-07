import React from 'react';
import { shallow } from 'enzyme';
import { TestHooks } from './TrialDetails';

describe('<TrialDetails />', () => {
  const trialsDetailData = [
    {
        "evalId": 56629,
        "resolutionId": 2024267,
        "forbearanceId": 395823,
        "trialName": "Trial Plan",
        "trialPmtMonthYear": "June 2014",
        "sequence": "1",
        "totalTrialAmount": "1454.2395",
        "pandIAmount": "1454.2395",
        "escrowAmount": "0.0000",
        "trialDueOn": "2014-06-01T00:00:00",
        "deadlineOn": "2014-06-30T00:00:00",
        "paidOn": "2014-05-30T00:00:00"
    },
    {
        "evalId": 56629,
        "resolutionId": 2024267,
        "forbearanceId": 395823,
        "trialName": "Trial Plan",
        "trialPmtMonthYear": "July 2014",
        "sequence": "2",
        "totalTrialAmount": "1454.2395",
        "pandIAmount": "1454.2395",
        "escrowAmount": "0.0000",
        "trialDueOn": "2014-07-01T00:00:00",
        "deadlineOn": "2014-07-31T00:00:00",
        "paidOn": "2014-06-30T00:00:00"
    },
    {
        "evalId": 56629,
        "resolutionId": 2024267,
        "forbearanceId": 395823,
        "trialName": "Trial Plan",
        "trialPmtMonthYear": "August 2014",
        "sequence": "3",
        "totalTrialAmount": "1454.2395",
        "pandIAmount": "1454.2395",
        "escrowAmount": "0.0000",
        "trialDueOn": "2014-08-01T00:00:00",
        "deadlineOn": "2014-08-31T00:00:00",
        "paidOn": "2014-08-01T00:00:00"
    }
];

  const trialsDetailWithNoData = [];
  it('shows Expansion Panel with data', () => {
    const { TrialDetails } = TestHooks;
    const wrapper = shallow(
      <TrialDetails trialsDetail={trialsDetailData} />,
    );
    expect(wrapper.find('WithStyles(ExpansionPanel)')).toHaveLength(trialsDetailData.length+1);
  });

  it('shows Disposition widget with no data', () => {
    const { TrialDetails } = TestHooks;
    const wrapper = shallow(
      <TrialDetails trialsDetail={trialsDetailWithNoData} />,
    );

    expect(wrapper.find('div')).toHaveLength(2);
  });

  it('should change the ExpandAll label to CollapseAll once when clicked', () => {
    const { TrialDetails } = TestHooks;
    const wrapper = shallow(
      <TrialDetails trialsDetail={trialsDetailData} />,
    );
    expect(wrapper.state().isExpanded).toBe(false);
    const firstButton = wrapper.find('WithStyles(ExpansionPanel)').at(0);
    // const aa = wrapper.state().isExpanded;
    firstButton.simulate('change');
    expect(wrapper.state().isExpanded).toBe(true);
  });


  it('should change the collapseAll label to ExpandAll once when clicked', () => {
    const { TrialDetails } = TestHooks;
    const wrapper = shallow(
      <TrialDetails trialsDetail={trialsDetailData} />,
    );
    expect(wrapper.state().isExpanded).toBe(false);
    const firstButton = wrapper.find('WithStyles(ExpansionPanel)').at(0);
    firstButton.simulate('change');
    firstButton.simulate('change');
    expect(wrapper.state().isExpanded).toBe(false);
  });
});
