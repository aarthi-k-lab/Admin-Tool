import React from 'react';
import { shallow } from 'enzyme';
import { TestHooks } from './Status';

const defaultProps = {
  onCardClick: jest.fn(),
  clickedCard: '',
};
describe('<Navigation />', () => {
  const navigationList = [
    {
      header: 'Trial Period',
      assignee: 'Prasad',
      status: 'FAILED',
      statusDate: '10/11/2018',
      startDate: '08/07/2018',
      endDate: '10/09/2017',
      expectedCompletionDate: '04/02/2019',
    },
  ];

  const navigationListWithNoData = [];
  const classes = {
    connectorDisabled: {
    },
    connectorLine: {
    },
    inactiveIconContainer: {
    },
    activeIconContainer: {
    },
    inactiveIcon: {
    },
    activeIcon: {
    },
    iconText: {
    },
    labelRoot: {
    },
  };
  it('shows Navigation with data', () => {
    const { Status } = TestHooks;
    const wrapper = shallow(
      <Status {...defaultProps} classes={classes} statusList={navigationList} />,
    );
    expect(wrapper.find('div')).toHaveLength(navigationList.length * 2);
  });

  it('shows Navigation with no data', () => {
    const { Status } = TestHooks;
    const wrapper = shallow(
      <Status {...defaultProps} classes={classes} statusList={navigationListWithNoData} />,
    );
    expect(wrapper.find('div')).toHaveLength(0);
  });
});
