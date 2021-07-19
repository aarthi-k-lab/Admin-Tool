import React from 'react';
import { shallow } from 'enzyme';
import { TestExports } from './CommentBox';

let defaultProps ={
  onCommentChange : jest.fn(),
}
describe('<CommentBox />', () => {
  it('prompts to enter the Comments ', () => {
    const wrapper = shallow(
      <TestExports.CommentBox {...defaultProps} onCheck={false} />,
    );
    expect(wrapper.find('p')).toHaveLength(1);
    expect(wrapper.find('textarea')).toHaveLength(1);
  });
});
