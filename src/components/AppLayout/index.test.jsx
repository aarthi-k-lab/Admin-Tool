import React from 'react';
import { shallow } from 'enzyme';
import AppLayout from '.';

describe('<AppLayout />', () => {
  it('should render AppLayout component', () => {
    const Mock = () => null;
    const wrapper = shallow(
      <AppLayout>
        <Mock />
      </AppLayout>,
    );
    console.log(wrapper.debug());
    expect(wrapper.find('Mock')).toHaveLength(1);
  });
});
