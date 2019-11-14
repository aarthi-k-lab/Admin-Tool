import React from 'react';
import { shallow } from 'enzyme';
import { TestExports } from './StagerPage';

const groups = ['post-mod-stager', 'post-mod-stager-mgr', 'stager-mgr', 'stager'];

describe('<StagerPage />', () => {
  it('shows StagerPage', () => {
    const triggerStagerValue = jest.fn();
    const wrapper = shallow(
      <TestExports.StagerPage groups={groups} stager="ALL_STAGER" triggerStagerValue={triggerStagerValue} />,
    );
    expect(wrapper.find('ContentHeader')).toHaveLength(0);
    expect(wrapper.find('WithStyles(ForwardRef(Grid))')).toHaveLength(3);
    expect(wrapper.find('Connect(StagerDetailsTable)')).toHaveLength(1);
    expect(wrapper.find('StagerTiles')).toHaveLength(1);
  });
});
