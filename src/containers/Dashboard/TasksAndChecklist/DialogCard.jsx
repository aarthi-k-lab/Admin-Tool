import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import IconButton from '@material-ui/core/IconButton';
import ExpandIcon from '@material-ui/icons/ExpandLess';
// import Dialog from '@material-ui/core/Dialog';
import ChatBubbleIcon from '@material-ui/icons/ChatBubble';
import CollapseIcon from '@material-ui/icons/ExpandMore';
import InfoIcon from '@material-ui/icons/Info';
// import { select } from 'node_modules/redux-saga/effects';
import styles from './DialogCard.css';
import DispositionComment from './DispositionComment';

const propertyValidation = {
  dialogHeader: PropTypes.string,
  dialogContent: PropTypes.string,
  message: PropTypes.string.isRequired,
  showDialog: PropTypes.bool,
  title: PropTypes.string.isRequired,
};

class DialogCard extends Component {
  constructor(props) {
    super(props);
    this.state = { activeIcon: 'comment', expanded: false };
  }

  changeActiveIcon(selectedActiveIcon) {
    this.setState({ activeIcon: selectedActiveIcon });
  }

  toggleExpand() {
    const { expanded } = this.state;
    this.setState({ expanded: !expanded });
  }

  render() {
    const {
      commentsRequired,
      className,
      dialogContent,
      dialogHeader,
      message,
      shouldShow,
      title,
    } = this.props;
    const { activeIcon, expanded } = this.state;
    if (!shouldShow) {
      return null;
    }
    return (
      <>
        <div className={classNames(className, styles['dialog-card'])}>
          <span styleName="title">{title}</span>
          <span styleName="message">{message}</span>
          <IconButton
            classes={{
              root: styles['sizing-icon'],
            }}
            onClick={() => this.changeActiveIcon('comment')}
          >
            <ChatBubbleIcon styleName={activeIcon === 'comment' ? 'active-disp-icon' : 'disp-icon'} />
          </IconButton>
          <IconButton
            classes={{
              root: styles['sizing-icon'],
            }}
            onClick={() => this.changeActiveIcon('instructions')}
          >
            <InfoIcon styleName={activeIcon === 'instructions' ? 'active-disp-icon' : 'disp-icon'} />
          </IconButton>
          <IconButton
            classes={{
              root: styles['sizing-icon'],
            }}
            onClick={() => this.toggleExpand()}
          >
            {expanded ? <ExpandIcon styleName="active-disp-icon" /> : <CollapseIcon styleName="active-disp-icon" />}
          </IconButton>
          <DispositionComment
            activeIcon={activeIcon}
            allTaskScenario={message === 'All Tasks Completed'}
            commentsRequired={commentsRequired}
            content={dialogContent}
            expanded={expanded}
            header={dialogHeader}
          />
        </div>
      </>
    );
  }
}

DialogCard.defaultProps = {
  className: '',
  shouldShow: true,
};


DialogCard.propTypes = {
  ...propertyValidation,
  className: PropTypes.string,
  commentsRequired: PropTypes.bool.isRequired,
  onDialogToggle: PropTypes.func.isRequired,
  shouldShow: PropTypes.bool,
};

export default DialogCard;
