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
});