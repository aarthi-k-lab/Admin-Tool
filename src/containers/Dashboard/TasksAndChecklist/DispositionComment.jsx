import React, { Component } from 'react';
import PropTypes from 'prop-types';
import HelpIcon from '@material-ui/icons/Help';
import { connect } from 'react-redux';
import * as R from 'ramda';
import styles from './DispositionComment.css';
import { operations, selectors } from '../../../state/ducks/tasks-and-checklist';

class DispositionComment extends Component {
  constructor(props) {
    super(props);
    this.onCommentChange = this.onCommentChange.bind(this);
    this.renderCommentBox = this.renderCommentBox.bind(this);
    this.onCommentBlur = this.onCommentBlur.bind(this);
  }

  componentDidMount() {
    const { allTaskScenario, triggerValidationDisplay } = this.props;
    if (!allTaskScenario) {
      triggerValidationDisplay(false);
    } else {
      // this.setState({ content: message });
      triggerValidationDisplay(true);
    }
  }

  onCommentChange(event) {
    const { triggerValidationDisplay, allTaskScenario, changeDispositionComments } = this.props;
    if (event.target.value !== '') {
      changeDispositionComments(event.target.value);
      triggerValidationDisplay(true);
    } else {
      changeDispositionComments(null);
      if (!allTaskScenario) {
        triggerValidationDisplay(false);
      }
    }
  }

  onCommentBlur() {
    const {
      message, allTaskScenario, getChangedComments,
      changeDispositionComments, dispositionCommentTrigger,
    } = this.props;
    // const { content } = this.state;
    // console.log(R.isEmpty(getChangedComments), message,
    // allTaskScenario, changeDispositionComments);
    if ((R.isEmpty(getChangedComments) || R.isNil(getChangedComments)) && allTaskScenario) {
      changeDispositionComments(message);
      // dispositionCommentTrigger(message);
    }
    console.log('sent Comments>>>', getChangedComments);
    dispositionCommentTrigger(getChangedComments);
  }

  renderCommentBox() {
    const { getChangedComments } = this.props;
    const { expanded, allTaskScenario, commentsRequired } = this.props;
    return (
        <>
          {(!(getChangedComments) && !allTaskScenario && commentsRequired)
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
            <textarea cols="40" id="textarea" multiline name="textarea" onBlur={this.onCommentBlur} onChange={this.onCommentChange} placeholder="Write Your Comment Here" rows="8" value={getChangedComments} />
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
      </section>);
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
});

const mapStateToProps = state => ({
  getDispositionComment: selectors.getDispositionComment(state),
  getChangedComments: selectors.getChangedComments(state),
});

DispositionComment.defaultProps = {
  getChangedComments: '',
  getDispositionComment: null,
  expanded: false,
  header: 'Steps to Resolve',
  content: 'Please ensure that the eval substatus and case substatus are in missing documents.',
  message: '',
};

DispositionComment.propTypes = {
  activeIcon: PropTypes.string.isRequired,
  allTaskScenario: PropTypes.bool.isRequired,
  changeDispositionComments: PropTypes.func.isRequired,
  commentsRequired: PropTypes.bool.isRequired,
  content: PropTypes.string,
  dispositionCommentTrigger: PropTypes.func.isRequired,
  expanded: PropTypes.bool,
  getChangedComments: PropTypes.string,
  getDispositionComment: PropTypes.shape({
    comment: PropTypes.string,
  }),
  header: PropTypes.string,
  message: PropTypes.string,
  triggerValidationDisplay: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(DispositionComment);
