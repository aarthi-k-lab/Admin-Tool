import React from 'react';
import { shallow } from 'enzyme';
import ChatIcon from '@material-ui/icons/Chat';
import CommentsWidget from './CommentsWidget';
import { TestHooks } from './WidgetComponent';

describe('<WidgetComponent />', () => {
  it('shows WidgetComponents', () => {
    const data = [
      {
        id: 'Comments',
        icon: <ChatIcon />,
        component: <CommentsWidget />,
        show: true,
      },
    ];
    const wrapper = shallow(
      <TestHooks.WidgetComponent currentWidget="Comments" rightAppBar={data} />,
    );
    expect(wrapper.find('Connect(CommentsWidget)')).toHaveLength(1);
    expect(wrapper.find('div')).toHaveLength(3);
  });
});
