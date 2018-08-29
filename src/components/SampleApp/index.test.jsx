import React from 'react';
import { shallow } from 'enzyme';

import SampleApp from './index';

describe('<SampleApp />', () => {
  it('has expected text', () => {
    const wrapper = shallow(<SampleApp />);
    expect(wrapper.text()).toBe('Hello World');
  });
});
