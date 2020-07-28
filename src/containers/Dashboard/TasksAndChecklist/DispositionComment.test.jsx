import React from 'react';
import { shallow } from 'enzyme';
import { TestHooks } from './DispositionComment';

describe('<DispositionComment />', () => {
  const { DispositionComment } = TestHooks;
  const renderInstructions = jest.fn();
  const renderCommentBox = jest.fn();
  const dispositionCommentTrigger = jest.fn();
  const triggerValidationDisplay = jest.fn();
  const onClearUserNotifyMsg = jest.fn();
  const dispositionComment = {
    comment: 'abc',
  };
  it('should render instructions when the active tile is instruction', () => {
    const wrapper = shallow(<DispositionComment activeIcon="instructions" content="abc" header="title" triggerValidationDisplay={triggerValidationDisplay} />);
    expect(renderCommentBox).not.toHaveBeenCalled();
    expect(wrapper.find('section')).toHaveLength(1);
    expect(wrapper.find('header')).toHaveLength(1);
    expect(wrapper.find('div')).toHaveLength(1);
  });
  it('should render disposition comment box when the active tile is comment', () => {
    const wrapper = shallow(<DispositionComment
      activeIcon="comment"
      allTaskScenario
      commentsRequired={false}
      dispositionCommentTrigger={dispositionCommentTrigger}
      triggerValidationDisplay={triggerValidationDisplay}
    />);
    expect(renderCommentBox).not.toHaveBeenCalled();
    expect(wrapper.find('p')).toHaveLength(0);
    expect(wrapper.find('div')).toHaveLength(1);
    expect(wrapper.find('#textarea')).toHaveLength(1);
    wrapper.find('#textarea').simulate('change', { target: { value: 'text changed' } });
    expect(dispositionCommentTrigger).toHaveBeenCalled();
    expect(triggerValidationDisplay).toHaveBeenCalled();
    expect(onClearUserNotifyMsg).not.toHaveBeenCalled();
  });
  it('should render disposition comment box when the active tile is comment => onblur action', () => {
    const wrapper = shallow(<DispositionComment
      activeIcon="comment"
      allTaskScenario
      commentsRequired={false}
      dispositionComment={dispositionComment}
      dispositionCommentTrigger={dispositionCommentTrigger}
      triggerValidationDisplay={triggerValidationDisplay}
    />);
    expect(renderInstructions).not.toHaveBeenCalled();
    expect(wrapper.find('p')).toHaveLength(0);
    expect(wrapper.find('div')).toHaveLength(1);
    expect(wrapper.find('#textarea')).toHaveLength(1);
    wrapper.find('#textarea').simulate('blur', { target: { value: 'text changed' } });
    expect(dispositionCommentTrigger).toHaveBeenCalled();
  });
  it('should render comments required text when there is no comments and is not an alltaskscenario', () => {
    const comments = { comment: null };
    const wrapper = shallow(<DispositionComment
      activeIcon="comment"
      allTaskScenario={false}
      commentsRequired
      dispositionComment={comments}
      dispositionCommentTrigger={dispositionCommentTrigger}
      triggerValidationDisplay={triggerValidationDisplay}
    />);
    expect(renderInstructions).not.toHaveBeenCalled();
    expect(wrapper.find('p')).toHaveLength(1);
    expect(wrapper.find('div')).toHaveLength(1);
    expect(wrapper.find('#textarea')).toHaveLength(1);
  });
  it('should not render comments required text when there is no comments and is an alltaskscenario', () => {
    const comments = { comment: null };
    const wrapper = shallow(<DispositionComment
      activeIcon="comment"
      allTaskScenario
      commentsRequired
      dispositionComment={comments}
      dispositionCommentTrigger={dispositionCommentTrigger}
      triggerValidationDisplay={triggerValidationDisplay}
    />);
    expect(renderInstructions).not.toHaveBeenCalled();
    expect(wrapper.find('p')).toHaveLength(0);
    expect(wrapper.find('div')).toHaveLength(1);
    expect(wrapper.find('#textarea')).toHaveLength(1);
  });
});
