import React from 'react';
import { shallow } from 'enzyme';
import ContentHeader from '.';

describe('<ContentHeader />', () => {
  test('displays the title', () => {
    const title = 'Fancy title';
    const wrapper = shallow(<ContentHeader title={title} />);
    expect(wrapper.find('WithStyles(Tooltip)')).toHaveLength(1);
  });
});
