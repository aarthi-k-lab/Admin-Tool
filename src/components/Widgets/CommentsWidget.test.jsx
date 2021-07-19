import React from 'react';
import { mount } from 'enzyme';
import { CommentsWidget } from './CommentsWidget';

const defaultProps = {
  addInfoEvalId: '',
  clearOnSearch: false,
  comments: [],
  evalComments: {},
  EvalId: 0,
  isAdditionalInfoOpen: false,
  isAssigned: false,
  isHistoryOpen: false,
  LoanNumber: '',
  onPostComment: jest.fn(),
  ProcessId: 0,
  showEvalId: false,
  TaskId: 0,
  taskIterationCounter: 0,
  User: {
    userDetails: {},
    name: '',
  },
};
describe('<CommentsWidget />', () => {
  it('shows the Loader', () => {
    const handleGetComments = jest.fn();
    const wrapper = mount(
      <CommentsWidget {...defaultProps} onGetComments={handleGetComments} />,
    );
    expect(wrapper.instance().state.Loader).toBe(false);
  });

  it('renders comments activity', () => {
    const handleGetComments = jest.fn();
    const wrapper = mount(
      <CommentsWidget {...defaultProps} onGetComments={handleGetComments} />,
    );
    expect(wrapper.instance().state.Loader).toBe(false);
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
      <CommentsWidget
        {...defaultProps}
        comments={data}
        onGetComments={handleGetComments}
        User={data1}
      />,
    );
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
      <CommentsWidget
        {...defaultProps}
        comments={data}
        onGetComments={handleGetComments}
        User={data1}
      />,
    );
    wrapper.find('#post_button').at(0).simulate('click');
    expect(wrapper.instance().state.content).toEqual('');
  });
});
