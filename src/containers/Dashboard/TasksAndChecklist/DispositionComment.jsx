import React, { Component } from 'react';
import './DispositionComment.css';
// import CommentBox from '../../../components/CommentBox/CommentBox';

class DispositonComment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      content: '',
      refreshHook: false,
      canSubmit: true,
    };
    this.onCommentChange = this.onCommentChange.bind(this);
  }

  onCommentChange(event) {
    if (event.target.value !== '') this.setState({ canSubmit: true });
    this.setState({ content: event.target.value });
  }

  render() {
    const { content, canSubmit, refreshHook } = this.state;
    return (
        <>
          <div
            styleName="comment-box"
          >
            <textarea cols="40" id="textarea" multiline name="textarea" onChange={this.onCommentChange} placeholder="Write Your Comment Here" rows="8" value={content} />
            {!canSubmit && refreshHook
            && (
            <p
              id="text-Area"
              styleName="prompt-error"
            >
            *Comments Required
            </p>
            )}
          </div>
          {/* <CommentBox
            content={content}
            onCheck={canSubmit}
            onCommentChange={this.onCommentChange}
            onRefresh={refreshHook}
            styleName="comment-box"
          /> */}
          </>
    );
  }
}

export default DispositonComment;
