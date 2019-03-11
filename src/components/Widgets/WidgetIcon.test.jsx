import React from 'react';
import { shallow } from 'enzyme';
// import ChatIcon from '@material-ui/icons/Chat';
// import CommentsWidget from './CommentsWidget';
import { TestExports } from './WidgetIcon';

describe('<WidgetIcon />', () => {
  it('shows WidgetIcons', () => {
    const data = {
      id: 'Comments',
      icon: 'ChatIcon',
      component: 'CommentsWidget',
      show: true,
    };
    const wrapper = shallow(
      <TestExports.WidgetIcon data={data} />,
    );
    expect(wrapper.find('div')).toHaveLength(2);
  });

  it('triggers onClick handler', () => {
    const handleClick = jest.fn();
    const wrapper = shallow(<TestExports.WidgetIcon onWidgetClick={handleClick} />);
    wrapper.simulate('click');
    expect(handleClick.mock.calls.length).toBe(1);
  });
});
