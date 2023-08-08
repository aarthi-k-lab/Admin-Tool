import React from 'react';
import { shallow } from 'enzyme';
import { TestHooks } from './WidgetBuilder';

const defaultProps = {
  className: '',
  onWidgetToggle: jest.fn(),
};
describe('<WidgetBuilder />', () => {
  it('renders WidgetComponent', () => {
    const data = ['Comments'];
    const wrapper = shallow(
      <TestHooks.WidgetBuilder {...defaultProps} currentWidget="Comments" openWidgetList={data} />,
    );
    expect(wrapper.find('WidgetComponent')).toHaveLength(1);
  });
  it('renders WidgetIcon', () => {
    const wrapper = shallow(
      <TestHooks.WidgetBuilder {...defaultProps} page="FEUW" />,
    );
    expect(wrapper.find('WidgetIcon')).toHaveLength(6);
  });

  it('should render the Booking widget on DOCSIN', () => {
    const wrapper = shallow(
      <TestHooks.WidgetBuilder {...defaultProps} />,
    );
    wrapper.setProps({
      page: 'DOCSIN',
    });
    expect(wrapper.find('WidgetIcon')).toHaveLength(6);
  });

  it('should not render the Booking widget on DOC GEN page', () => {
    const wrapper = shallow(
      <TestHooks.WidgetBuilder {...defaultProps} />,
    );
    wrapper.setProps({
      page: 'DOCGEN',
    });
    expect(wrapper.find('WidgetIcon')).toHaveLength(6);
  });

  it('should call the onWidgetToggle function', () => {
    const wrapper = shallow(
      <TestHooks.WidgetBuilder {...defaultProps} page="FEUW" />,
    );
    expect(wrapper.find('WidgetIcon')).toHaveLength(6);
    wrapper.find('WidgetIcon').at(1).simulate('WidgetClick');
    expect(defaultProps.onWidgetToggle).toBeCalled();
  });
});
