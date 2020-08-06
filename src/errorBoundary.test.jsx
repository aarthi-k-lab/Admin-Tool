import React from 'react';
import { shallow, mount } from 'enzyme';
import ErrorBoundary from './ErrorBoundary';

describe('<ErrorBoundary />', () => {
  it('should render the child component on success case', () => {
    const Something = () => null;
    const wrapper = shallow(
      <ErrorBoundary>
        <Something />
      </ErrorBoundary>,
    );
    expect(wrapper.find('Something')).toHaveLength(1);
  });
  it('should display an ErrorMessage if wrapped component throws', () => {
    const Something = () => null;
    const wrapper = mount(
      <ErrorBoundary>
        <Something />
      </ErrorBoundary>,
    );
    const error = new Error('test');
    wrapper.find(Something).simulateError(error);
    wrapper.setState({ hasError: true });
    expect(wrapper.find('h1').at(0).text()).toBe('Something went wrong.');
  });
});
