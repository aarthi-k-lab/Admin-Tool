import React from 'react';
import { shallow } from 'enzyme';
import Close from './Close';

describe('<Tabs />', () => {
  it('should render the Close component', () => {
    const wrapper = shallow(
      <Close />,
    );
    expect(wrapper.find('WithStyles(ForwardRef(Button))')).toHaveLength(1);
  });
});
