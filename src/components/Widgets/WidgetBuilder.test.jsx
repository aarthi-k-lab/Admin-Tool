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
      <TestHooks.WidgetBuilder />,
    );
    wrapper.setState({ rightAppBarSelected: 'Comments', rightAppBarOpen: true, rightAppBar: data });
    expect(wrapper.find('WidgetComponent')).toHaveLength(1);
  });
  it('renders WidgetIcon', () => {
    const wrapper = shallow(
      <TestHooks.WidgetBuilder />,
    );
    expect(wrapper.find('WidgetIcon')).toHaveLength(1);
  });

  it('should render the Booking widget on DOCSIN', () => {
    const wrapper = shallow(
      <TestHooks.WidgetBuilder />,
    );
    wrapper.setProps({
      groupName: 'DOCSIN',
    });
    expect(wrapper.find('WidgetIcon')).toHaveLength(2);
  });

  it('should not render the Booking widget on DOC GEN page', () => {
    const wrapper = shallow(
      <TestHooks.WidgetBuilder />,
    );
    wrapper.setProps({
      groupName: 'DOCGEN',
    });
    expect(wrapper.find('WidgetIcon')).toHaveLength(1);
  });

  it('should call the triggerHeader function', () => {
    const triggerHeader = jest.fn();
    const wrapper = shallow(
      <TestHooks.WidgetBuilder triggerHeader={triggerHeader} />,
    );
    wrapper.setProps({
      groupName: 'DOCSIN',
    });
    expect(wrapper.find('WidgetIcon')).toHaveLength(2);
    wrapper.find('WidgetIcon').at(1).simulate('WidgetClick');
    expect(triggerHeader).toBeCalled();
  });
});
