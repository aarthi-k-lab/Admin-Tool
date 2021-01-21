import React, { Component } from 'react';
import PropTypes from 'prop-types';
import HelpIcon from '@material-ui/icons/Help';
import { connect } from 'react-redux';
import * as R from 'ramda';
import styles from './DispositionComment.css';
import { operations, selectors } from '../../../state/ducks/tasks-and-checklist';
import { operations as dashBoardoperations } from '../../../state/ducks/dashboard';


class DispositionComment extends Component {
  constructor(props) {
    super(props);
    this.onCommentChange = this.onCommentChange.bind(this);
    this.renderCommentBox = this.renderCommentBox.bind(this);
    this.onCommentBlur = this.onCommentBlur.bind(this);
  }

  componentDidMount() {
    const { allTaskScenario, triggerValidationDisplay, dispositionComment } = this.props;
    const displayValidate = dispositionComment ? dispositionComment.comment : null;
    if (allTaskScenario || displayValidate !== null) {
      triggerValidationDisplay(true);
    } else {
      triggerValidationDisplay(false);
    }
  }

  static getDerivedStateFromProps(props) {
    const { allTaskScenario, message } = props;
    if (allTaskScenario) {
      return ({ content: message });
    }
    return ({ content: '' });
  }

  onCommentChange(event) {
    const {
      triggerValidationDisplay,
      allTaskScenario,
      dispositionCommentTrigger,
      onClearUserNotifyMsg,
    } = this.props;
    if (event.target.value.trim() !== '') {
      dispositionCommentTrigger(event.target.value);
      triggerValidationDisplay(true);
    } else {
      dispositionCommentTrigger(null);
      if (!allTaskScenario) {
        triggerValidationDisplay(false);
        onClearUserNotifyMsg();
      }
    }
  }

  onCommentBlur() {
    const {
      message, allTaskScenario, dispositionComment,
      dispositionCommentTrigger,
    } = this.props;
    const { comment } = dispositionComment;
    if ((R.isEmpty(comment) || R.isNil(comment)) && allTaskScenario) {
      dispositionCommentTrigger(message);
    } else dispositionCommentTrigger(comment);
  }

  renderCommentBox() {
    const {
      expanded, allTaskScenario, commentsRequired, dispositionComment,
    } = this.props;
    const comment = (dispositionComment) ? dispositionComment.comment : null;

    return (
      <>
        {(!comment && !allTaskScenario && commentsRequired)
            && (
            <p
              id="text-Area"
              styleName="prompt-error"
            >
            *Comments Required
            </p>
            )}
        <div
          styleName={expanded ? 'expanded-comment-box' : 'comment-box'}
        >
          <textarea cols="40" id="textarea" multiline name="textarea" onBlur={this.onCommentBlur} onChange={this.onCommentChange} placeholder="Write Your Comment Here" rows="8" value={comment} />
        </div>
      </>
    );
  }

  static renderInstructions(header, content) {
    return (
      <section styleName="content">
        <header styleName="content-header">
          { header }
        </header>
        <div styleName="content-body">
          <HelpIcon classes={{ root: styles['info-icon'] }} />
          { content }
        </div>
      </section>
    );
  }

  render() {
    const {
      activeIcon, header, content,
    } = this.props;
    if (activeIcon === 'comment') {
      return this.renderCommentBox();
    }
    if (activeIcon === 'instructions') {
      return this.constructor.renderInstructions(header, content);
    }
    return null;
  }
}

const mapDispatchToProps = dispatch => ({
  triggerValidationDisplay: operations.triggerValidationDisplay(dispatch),
  dispositionCommentTrigger: operations.dispositionCommentTrigger(dispatch),
  changeDispositionComments: operations.changeDispositionComments(dispatch),
  onClearUserNotifyMsg: dashBoardoperations.onClearUserNotifyMsg(dispatch),
});

const mapStateToProps = state => ({
  dispositionComment: selectors.getDispositionComment(state),
});

DispositionComment.defaultProps = {
  dispositionComment: null,
  expanded: false,
  header: 'Steps to Resolve',
  content: 'Please ensure that the eval substatus and case substatus are in missing documents.',
};

DispositionComment.propTypes = {
  activeIcon: PropTypes.string.isRequired,
  allTaskScenario: PropTypes.bool.isRequired,
  commentsRequired: PropTypes.bool.isRequired,
  content: PropTypes.string,
  dispositionComment: PropTypes.shape({
    comment: PropTypes.string,
  }),
  dispositionCommentTrigger: PropTypes.func.isRequired,
  expanded: PropTypes.bool,
  header: PropTypes.string,
  message: PropTypes.string.isRequired,
  onClearUserNotifyMsg: PropTypes.func.isRequired,
  triggerValidationDisplay: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(DispositionComment);

const TestHooks = { DispositionComment };
export { TestHooks };
