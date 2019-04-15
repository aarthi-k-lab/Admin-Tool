import React from 'react';
import { shallow } from 'enzyme';
import { TestHooks } from './ExpandPanel';

describe('<ExpandPanel />', () => {
  const monthlyData = [{
    title: 'Trial 1',
    month: 'January 2019',
    status: 'complete',
  },
  {
    title: 'Trial 2',
    month: 'February 2020',
    status: 'failed',
  },
  {
    title: 'Trial 3',
    month: 'February 2020',
    status: 'incomplete',
    monthDetail: [{
      header: 'Total Trial amount',
      value: '$283400',
    }, {
      header: 'P&I',
      value: '$125.00',
    }, {
      header: 'Escrow',
      value: '$85.00',
    }, {
      header: 'Trial Due On',
      value: '02/01/2019',
    }, {
      header: 'Deadline On',
      value: '12/01/2019',
    }, {
      header: 'Paid On',
      value: '12/17/2019',
    }],
  },
  ];

  const monthlyDataWithNoData = [];
  it('shows Expansion Panel with data', () => {
    const { ExpandPanel } = TestHooks;
    const wrapper = shallow(
      <ExpandPanel monthlyDetails={monthlyData} />,
    );
    expect(wrapper.find('WithStyles(ExpansionPanel)')).toHaveLength(monthlyData.length + 1);
  });

  it('shows Disposition widget with no data', () => {
    const { ExpandPanel } = TestHooks;
    const wrapper = shallow(
      <ExpandPanel monthlyDetails={monthlyDataWithNoData} />,
    );
    expect(wrapper.find('div')).toHaveLength(2);
  });

  it('should change the ExpandAll label to CollapseAll once when clicked', () => {
    const { ExpandPanel } = TestHooks;
    const wrapper = shallow(
      <ExpandPanel monthlyDetails={monthlyData} />,
    );
    expect(wrapper.state().isExpanded).toBe(false);
    const firstButton = wrapper.find('WithStyles(ExpansionPanel)').at(0);
    firstButton.simulate('change');
    expect(wrapper.state().isExpanded).toBe(true);
  });


  it('should change the collapseAll label to ExpandAll once when clicked', () => {
    const { ExpandPanel } = TestHooks;
    const wrapper = shallow(
      <ExpandPanel monthlyDetails={monthlyData} />,
    );
    expect(wrapper.state().isExpanded).toBe(false);
    const firstButton = wrapper.find('WithStyles(ExpansionPanel)').at(0);
    firstButton.simulate('change');
    firstButton.simulate('change');
    expect(wrapper.state().isExpanded).toBe(false);
  });
});
