import React from 'react';
import { shallow } from 'enzyme';
import { TestExports } from './StagerTiles';

describe('<StagerTiles />', () => {
  const counts = [];
  it('shows StagerTiles', () => {
    const wrapper = shallow(
      <TestExports.StagerTiles counts={counts} />,
    );
    expect(wrapper.find('WithStyles(Select)')).toHaveLength(1);
    expect(wrapper.find('WithStyles(Grid)')).toHaveLength(2);
  });
});
