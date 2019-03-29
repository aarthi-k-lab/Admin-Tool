import React from 'react';
import { shallow } from 'enzyme';
import { TestHooks } from './Status';

describe('<Navigation />', () => {
  const navigationList = [
    {
      header: 'Trail Period',
      assignee: 'Prasad',
      status: 'FAILED',
      statusDate: '11/10/2018',
      startDate: '07/08/2018',
      endDate: '09/10/2017',
      expectedCompletionDate: '02/04/2019',
    },
  ];

  const navigationListWithNoData = [];
  it('shows Navigation with data', () => {
    const { Status } = TestHooks;
    const wrapper = shallow(
      <Status statusList={navigationList} />,
    );
    expect(wrapper.find('div')).toHaveLength(navigationList.length * 2);
  });

  it('shows Navigation with no data', () => {
    const { Status } = TestHooks;
    const wrapper = shallow(
      <Status statusList={navigationListWithNoData} />,
    );
    expect(wrapper.find('div')).toHaveLength(0);
  });
});
