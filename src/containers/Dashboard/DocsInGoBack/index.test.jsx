import React from 'react';
import { shallow } from 'enzyme';
import { TestHooks } from './DocsInGoBack';

describe('<DocsInGoBack />', () => {
  it('shows DocsInGoBack widget with buttons ', () => {
    const { DocsInGoBack } = TestHooks;
    const user = { id: 25, groupList: 'docsin-mgr' };
    const wrapper = shallow(<DocsInGoBack user={user} />);
    const grid = wrapper.find('ContentHeader');

    expect(grid).toHaveLength(0);
    expect(wrapper.find({ showSendToDocsIn: true })).toHaveLength(1);
  });
  it('shows DocsInGoBack widget without buttons ', () => {
    const { DocsInGoBack } = TestHooks;
    const user = { id: 25, groupList: 'util' };
    const wrapper = shallow(<DocsInGoBack user={user} />);
    const grid = wrapper.find('ContentHeader');

    expect(grid).toHaveLength(0);
    expect(wrapper.find({ showSendToDocsIn: true })).toHaveLength(0);
  });
  it('shows DocsInGoBack widget without in progress ', () => {
    const { DocsInGoBack } = TestHooks;
    const user = { id: 25, groupList: 'util-mrg' };
    const wrapper = shallow(<DocsInGoBack inProgress={false} user={user} />);

    expect(wrapper.find('Loader')).toHaveLength(0);
  });
  it('shows DocsInGoBack widget in progress ', () => {
    const { DocsInGoBack } = TestHooks;
    const user = { id: 25, groupList: 'util-mrg' };
    const wrapper = shallow(<DocsInGoBack inProgress user={user} />);

    expect(wrapper.find('Loader')).toHaveLength(1);
  });
  it('should not post comments', () => {
    const onPostComment = jest.fn();
    // const componentDidMount = jest.fn();
    const { DocsInGoBack } = TestHooks;
    const user = { id: 25, groupList: 'docsin-mgr' };
    const wrapper = shallow(<DocsInGoBack inProgress onPostComment={onPostComment} user={user} />);
    wrapper.update();
    wrapper.instance().forceUpdate();
    wrapper.setState({ savedComments: undefined });
    expect(wrapper.instance().props.onPostComment).toHaveBeenCalledTimes(0);
  });
});
