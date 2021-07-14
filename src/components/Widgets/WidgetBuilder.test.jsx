import React from 'react';
import { shallow } from 'enzyme';
import ChatIcon from '@material-ui/icons/Chat';
import CommentsWidget from './CommentsWidget';
import { TestHooks } from './WidgetBuilder';

describe('<WidgetBuilder />', () => {
  it('renders WidgetComponent', () => {
    const data = [
      {
        id: 'Comments',
        icon: <ChatIcon />,
        component: <CommentsWidget />,
        show: true,
      },
    ];
    const wrapper = shallow(
      <TestHooks.WidgetBuilder currentWidget="Comments" openWidgetList={data} />,
    );
    expect(wrapper.find('WidgetComponent')).toHaveLength(1);
  });
  it('renders WidgetIcon', () => {
    const wrapper = shallow(
      <TestHooks.WidgetBuilder page="FEUW" />,
    );
    expect(wrapper.find('WidgetIcon')).toHaveLength(4);
  });

  it('should render the Booking widget on DOCSIN', () => {
    const wrapper = shallow(
      <TestHooks.WidgetBuilder />,
    );
    wrapper.setProps({
      page: 'DOCSIN',
    });
    expect(wrapper.find('WidgetIcon')).toHaveLength(5);
  });

  it('should not render the Booking widget on DOC GEN page', () => {
    const wrapper = shallow(
      <TestHooks.WidgetBuilder />,
    );
    wrapper.setProps({
      page: 'DOCGEN',
    });
    expect(wrapper.find('WidgetIcon')).toHaveLength(4);
  });

  it('should call the onWidgetToggle function', () => {
    const onWidgetToggle = jest.fn();
    const wrapper = shallow(
      <TestHooks.WidgetBuilder onWidgetToggle={onWidgetToggle} page="FEUW" />,
    );
    expect(wrapper.find('WidgetIcon')).toHaveLength(4);
    wrapper.find('WidgetIcon').at(1).simulate('WidgetClick');
    expect(onWidgetToggle).toBeCalled();
  });
});
