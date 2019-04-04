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
  const classes = {
    connectorDisabled: {
      padding: 0,
    },
    connectorLine: {
      minHeight: 'auto',
    },
    inactiveIconContainer: {
      position: 'relative',
      top: '70px',
      left: '-6px',
    },
    activeIconContainer: {
      position: 'relative',
      top: '70px',
      left: '-8px',
    },
    inactiveIcon: {
      color: '#9e9e9e !important',
      width: '12px',
    },
    activeIcon: {
      color: '#9e9e9e !important',
      width: '18px',
    },
    iconText: {
      display: 'none !important',
    },
    labelRoot: {
      marginLeft: '12px',
      display: 'none',
    },
  };
  it('shows Navigation with data', () => {
    const { Status } = TestHooks;
    const wrapper = shallow(
      <Status classes={classes} statusList={navigationList} />,
    );
    expect(wrapper.find('div')).toHaveLength(navigationList.length * 2);
  });

  it('shows Navigation with no data', () => {
    const { Status } = TestHooks;
    const wrapper = shallow(
      <Status classes={classes} statusList={navigationListWithNoData} />,
    );
    expect(wrapper.find('div')).toHaveLength(0);
  });
});
