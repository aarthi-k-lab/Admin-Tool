import React from 'react';
import { shallow } from 'enzyme';
import App from '.';

describe('<App />', () => {
  it('should render App component in expand view', () => {
    const Something = () => null;
    const props = {
      expandView: true,
    };
    const wrapper = shallow(
      <App {...props}>
        <Something />
      </App>,
    );
    expect(wrapper.find('Something')).toHaveLength(1);
    expect(wrapper.find('Connect(LeftNav)')).toHaveLength(0);
  });
  it('should render App component in default view', () => {
    const Something = () => null;
    const props = {
      expandView: false,
    };
    const wrapper = shallow(
      <App {...props}>
        <Something />
      </App>,
    );
    expect(wrapper.find('Something')).toHaveLength(1);
    expect(wrapper.find('Connect(LeftNav)')).toHaveLength(1);
  });
});
