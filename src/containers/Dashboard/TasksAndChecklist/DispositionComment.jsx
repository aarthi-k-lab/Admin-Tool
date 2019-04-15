import React, { Component } from 'react';
import PropTypes from 'prop-types';
import HelpIcon from '@material-ui/icons/Help';
import { connect } from 'react-redux';
import styles from './DispositionComment.css';
import { operations } from '../../../state/ducks/tasks-and-checklist';

class DispositionComment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      content: '',
    };
    this.onCommentChange = this.onCommentChange.bind(this);
    this.renderCommentBox = this.renderCommentBox.bind(this);
    this.onCommentBlur = this.onCommentBlur.bind(this);
  }

  onCommentChange(event) {
    const { triggerValidationDisplay, allTaskScenario } = this.props;
    if (event.target.value !== '') {
      this.setState({ content: event.target.value });
      triggerValidationDisplay(true);
    } else {
      this.setState({ content: '' });
      if (!allTaskScenario) {
        triggerValidationDisplay(false);
      }
    }
  }

  onCommentBlur() {
    const { dispositionCommentTrigger } = this.props;
    const { content } = this.state;
    dispositionCommentTrigger(content);
  }

  renderCommentBox() {
    const { content } = this.state;
    const { expanded, allTaskScenario } = this.props;
    return (
        <>
          {(!content && !allTaskScenario)
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
            <textarea cols="40" id="textarea" multiline name="textarea" onBlur={this.onCommentBlur} onChange={this.onCommentChange} placeholder="Write Your Comment Here" rows="8" value={content} />
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
    const { activeIcon, header, content } = this.props;
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
});

DispositionComment.defaultProps = {
  expanded: false,
  header: 'Steps to Resolve',
  content: 'Please ensure that the eval substatus and case substatus are in missing documents.',
};

DispositionComment.propTypes = {
  activeIcon: PropTypes.string.isRequired,
  allTaskScenario: PropTypes.bool.isRequired,
  content: PropTypes.string,
  dispositionCommentTrigger: PropTypes.func.isRequired,
  expanded: PropTypes.bool,
  header: PropTypes.string,
  triggerValidationDisplay: PropTypes.func.isRequired,
};

export default connect(null, mapDispatchToProps)(DispositionComment);
