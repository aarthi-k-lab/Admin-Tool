import React from 'react';
import { shallow } from 'enzyme';
import { TestHooks } from './Tombstone';

describe('<TombstoneWrapper />', () => {
  it('shows loader', () => {
    const wrapper = shallow(
      <TestHooks.TombstoneWrapper
        data={[]}
        error={false}
        loading
      />,
    );
    expect(wrapper.find('TombstoneLoader')).toHaveLength(1);
  });
  it('shows error', () => {
    const wrapper = shallow(
      <TestHooks.TombstoneWrapper
        data={[]}
        error
        loading={false}
      />,
    );
    expect(wrapper.find('TombstoneError')).toHaveLength(1);
  });
  it('show tombstone data', () => {
    const data = [];
    const wrapper = shallow(
      <TestHooks.TombstoneWrapper
        data={data}
        error={false}
        loading={false}
      />,
    );
    const tombstone = wrapper.find('Tombstone');
    expect(tombstone).toHaveLength(1);
    expect(tombstone.at(0).prop('items')).toBe(data);
  });
});
