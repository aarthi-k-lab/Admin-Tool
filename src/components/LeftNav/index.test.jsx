import React from 'react';
import { shallow } from 'enzyme';
import { TestExports } from './LeftNav';

describe('<LeftNav />', () => {
  it('shows LeftNavButtons', () => {
    const user = {
      userDetails: {
        email: 'bernt@mrcooper.com',
        jobTitle: 'CEO',
        name: 'brent',
      },
    };
    const wrapper = shallow(
      <TestExports.LeftNav user={user} />,
    );
    expect(wrapper.find('nav')).toHaveLength(1);
  });
});
