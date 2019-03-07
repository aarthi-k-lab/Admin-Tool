import React from 'react';
import { shallow } from 'enzyme';
import { TestExports } from './CommentBox';

describe('<CommentBox />', () => {
  it('prompts to enter the Comments ', () => {
    const wrapper = shallow(
      <TestExports.CommentBox onCheck={false} />,
    );
    expect(wrapper.find('p')).toHaveLength(1);
    expect(wrapper.find('textarea')).toHaveLength(1);
  });
});
