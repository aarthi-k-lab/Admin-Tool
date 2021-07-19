import React from 'react';
import { shallow } from 'enzyme';
import { TestHooks } from './DialogCard';

const defaultProps = {
  commentsRequired: false,
  message: 'msg',
  shouldShow: true,
  title: 'title',
};
describe('<DialogCard />', () => {
  const { DialogCard } = TestHooks;
  it('should render disposition comment box', () => {
    const wrapper = shallow(<DialogCard {...defaultProps} />);
    expect(wrapper.find('div')).toHaveLength(1);
    expect(wrapper.find('span')).toHaveLength(2);
    expect(wrapper.find('span').get(0).props.children).toBe('title');
    expect(wrapper.find('span').get(1).props.children).toBe('msg');
    expect(wrapper.find('WithStyles(ForwardRef(IconButton))')).toHaveLength(3);
    expect(wrapper.find('Connect(DispositionComment)')).toHaveLength(1);
  });
  it('should render chat icon on the dialog card', () => {
    const wrapper = shallow(<DialogCard
      {...defaultProps}
    />);
    expect(wrapper.find('div')).toHaveLength(1);
    expect(wrapper.find('span')).toHaveLength(2);
    expect(wrapper.find('span').get(0).props.children).toBe('title');
    expect(wrapper.find('span').get(1).props.children).toBe('msg');
    expect(wrapper.find('WithStyles(ForwardRef(IconButton))')).toHaveLength(3);
    expect(wrapper.find('#comment')).toHaveLength(1);
    wrapper.find('#comment').simulate('Click');
    expect(wrapper.instance().state.activeIcon).toBe('comment');
  });
  it('should render instruction icon on the dialog card', () => {
    const wrapper = shallow(<DialogCard
      {...defaultProps}
    />);
    expect(wrapper.find('div')).toHaveLength(1);
    expect(wrapper.find('span')).toHaveLength(2);
    expect(wrapper.find('span').get(0).props.children).toBe('title');
    expect(wrapper.find('span').get(1).props.children).toBe('msg');
    expect(wrapper.find('WithStyles(ForwardRef(IconButton))')).toHaveLength(3);
    expect(wrapper.find('#instructions')).toHaveLength(1);
    wrapper.find('#instructions').simulate('Click');
    expect(wrapper.instance().state.activeIcon).toBe('instructions');
  });
  it('should toggle the expand icon on the dialog card', () => {
    const wrapper = shallow(<DialogCard
      {...defaultProps}
    />);
    wrapper.instance().setState({ expanded: false });
    expect(wrapper.find('div')).toHaveLength(1);
    expect(wrapper.find('span')).toHaveLength(2);
    expect(wrapper.find('span').get(0).props.children).toBe('title');
    expect(wrapper.find('span').get(1).props.children).toBe('msg');
    expect(wrapper.find('WithStyles(ForwardRef(IconButton))')).toHaveLength(3);
    expect(wrapper.find('#expand')).toHaveLength(1);
    wrapper.find('#expand').simulate('Click');
    expect(wrapper.instance().state.expanded).toBe(true);
    expect(wrapper.find('#expanded')).toHaveLength(1);
  });
  it('should toggle the collapse icon on the dialog card', () => {
    const wrapper = shallow(<DialogCard
      {...defaultProps}
    />);
    wrapper.instance().setState({ expanded: true });
    expect(wrapper.find('div')).toHaveLength(1);
    expect(wrapper.find('span')).toHaveLength(2);
    expect(wrapper.find('span').get(0).props.children).toBe('title');
    expect(wrapper.find('span').get(1).props.children).toBe('msg');
    expect(wrapper.find('WithStyles(ForwardRef(IconButton))')).toHaveLength(3);
    expect(wrapper.find('#expand')).toHaveLength(1);
    wrapper.find('#expand').simulate('Click');
    expect(wrapper.instance().state.expanded).toBe(false);
    expect(wrapper.find('#collapsed')).toHaveLength(1);
  });
});
