import React from 'react';
import PropTypes from 'prop-types';
import './CommentBox.css';

const CommentBox = ({
  onCheck, content, onRefresh, onCommentChange,
}) => (
  <div
    styleName={onCheck ? 'comment-box' : 'red-box'}
  >
    <textarea cols="40" id="textarea" multiline name="textarea" onChange={onCommentChange} placeholder="Enter Comment" rows="8" value={content} />
    {!onCheck && onRefresh
            && (
            <p
              id="text-Area"
              styleName="prompt-error"
            >
            Please enter the Comments
            </p>
            )}
  </div>
);

CommentBox.defaultProps = {
  onCheck: true,
  content: '',
  onRefresh: true,
};

CommentBox.propTypes = {
  content: PropTypes.string,
  onCheck: PropTypes.bool,
  onCommentChange: PropTypes.func.isRequired,
  onRefresh: PropTypes.bool,
};

const TestExports = {
  CommentBox,
};

export default CommentBox;
export { TestExports };
