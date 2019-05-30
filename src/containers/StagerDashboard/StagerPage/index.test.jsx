import React from 'react';
import { shallow } from 'enzyme';
import { TestExports } from './StagerPage';

describe('<StagerPage />', () => {
  it('shows StagerPage', () => {
    const wrapper = shallow(
      <TestExports.StagerPage />,
    );
    expect(wrapper.find('ContentHeader')).toHaveLength(1);
    expect(wrapper.find('Connect(Controls)')).toHaveLength(1);
    expect(wrapper.find('WithStyles(Grid)')).toHaveLength(3);
    expect(wrapper.find('Connect(StagerDetailsTable)')).toHaveLength(1);
    expect(wrapper.find('StagerTiles')).toHaveLength(1);
  });
});
