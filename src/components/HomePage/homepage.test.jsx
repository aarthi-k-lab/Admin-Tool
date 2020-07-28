import React from 'react';
import { shallow } from 'enzyme';
import HomePage from '.';

describe('<Homepage>', () => {
  it('should render the HomePage', () => {
    const wrapper = shallow(
      <HomePage />,
    );
    expect(wrapper.find('FullHeightColumn')).toHaveLength(1);
  });
});
