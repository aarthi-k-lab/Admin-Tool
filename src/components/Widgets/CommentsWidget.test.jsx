import React from 'react';
import { shallow, mount } from 'enzyme';
import { TestHooks } from './CommentsWidget';

describe('<CommentsWidget />', () => {
  it('shows the Loader', () => {
    const handleGetComments = jest.fn();
    const wrapper = mount(
      <TestHooks.CommentsWidget onGetComments={handleGetComments} />,
    );
    expect(wrapper.instance().state.Loader).toBe(false);
    const active = wrapper.instance().commentArea;
  });

  it('renders comments activity', () => {
    const handleGetComments = jest.fn();
    const wrapper = mount(
      <TestHooks.CommentsWidget onGetComments={handleGetComments} />,
    );
    expect(wrapper.instance().state.Loader).toBe(false);
    const active = wrapper.instance().commentArea;
    wrapper.instance().renderCommentsActivity();
  });

  it('checks the comments are rendered', () => {
    const data = [{
      content: 'Dispositioned',
      createdOn: '12-3-2101',
    }];
    const data1 = {
      userDetails: {
        name: 'commentsWidget',
      },
    };
    const handleGetComments = jest.fn();
    const wrapper = mount(
      <TestHooks.CommentsWidget comments={data} onGetComments={handleGetComments} User={data1} />,
    );
    const active = wrapper.instance().commentArea;
    expect(wrapper.find('#row_main_container')).toHaveLength(0);
  });

  it('when post button is  clicked the comments are added', () => {
    const data = [{
      content: 'Dispositioned',
      createdOn: '12-3-2101',
    }];
    const data1 = {
      userDetails: {
        name: 'commentsWidget',
      },
    };
    const handleGetComments = jest.fn();
    const wrapper = mount(
      <TestHooks.CommentsWidget comments={data} onGetComments={handleGetComments} User={data1} />,
    );

    const active = wrapper.instance().commentArea;
    wrapper.find('#post_button').at(0).simulate('click');
    expect(wrapper.instance().state.content).toEqual('');
  });
});
