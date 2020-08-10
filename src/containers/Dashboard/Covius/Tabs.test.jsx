import React from 'react';
import { shallow } from 'enzyme';
import SimpleTabs from './Tabs';

describe('<Tabs />', () => {
  it('should render three tabs', () => {
    const props = {
      coviusTabIndex: 123,
      getCount: jest.fn(),
      handleTabSelection: jest.fn(),
      renderCountLabel: jest.fn(),
    };
    const wrapper = shallow(
      <SimpleTabs {...props} />,
    );
    expect(wrapper.find('WithStyles(ForwardRef(Tab))')).toHaveLength(3);
    wrapper.find('WithStyles(ForwardRef(Tabs))').simulate('change');
    expect(props.handleTabSelection).toBeCalled();
  });
  it('should render three tabs', () => {
    const getCount = () => true;
    const props = {
      coviusTabIndex: 123,
      getCount,
      handleTabSelection: jest.fn(),
      renderCountLabel: jest.fn(),
    };
    const wrapper = shallow(
      <SimpleTabs {...props} />,
    );
    expect(wrapper.find('WithStyles(ForwardRef(Tab))')).toHaveLength(4);
  });
});
