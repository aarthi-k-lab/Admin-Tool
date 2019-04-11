import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import IconButton from '@material-ui/core/IconButton';
import ExpandIcon from '@material-ui/icons/ExpandLess';
import HelpIcon from '@material-ui/icons/Help';
import Dialog from '@material-ui/core/Dialog';
import ChatBubbleIcon from '@material-ui/icons/ChatBubble';
import CollapseIcon from '@material-ui/icons/ExpandMore';
import styles from './DialogCard.css';
import DispositonComment from './DispositionComment';

const propertyValidation = {
  dialogHeader: PropTypes.string,
  dialogContent: PropTypes.string,
  message: PropTypes.string.isRequired,
  showDialog: PropTypes.bool,
  title: PropTypes.string.isRequired,
};

function Modal({
  dialogHeader,
  dialogContent,
  showDialog,
  onClose,
  title,
  message,
}) {
  return (
    <Dialog
      onClose={onClose}
      open={showDialog}
    >
      <div className={classNames(styles['dialog-card'], styles.modal)}>
        <span styleName="title">{title}</span>
        <span styleName="message">{message}</span>
        <IconButton
          classes={{
            root: styles['sizing-icon'],
          }}
          onClick={onClose}
        >
          <ChatBubbleIcon />
          <CollapseIcon />
        </IconButton>
      </div>
      <section styleName="dialog-content">
        <header styleName="dialog-content-header">
          { dialogHeader }
        </header>
        <div styleName="dialog-content-body">
          <HelpIcon classes={{ root: styles['info-icon'] }} />
          { dialogContent }
        </div>
      </section>
    </Dialog>
  );
}

Modal.propTypes = {
  ...propertyValidation,
  onClose: PropTypes.func.isRequired,
};

function DialogCard({
  className,
  dialogContent,
  dialogHeader,
  message,
  onDialogToggle,
  shouldShow,
  showDialog,
  title,
}) {
  if (!shouldShow) {
    return null;
  }
  const dialog = (
    <Modal
      dialogContent={dialogContent}
      dialogHeader={dialogHeader}
      message={message}
      onClose={onDialogToggle}
      showDialog={showDialog}
      title={title}
    />
  );
  return (
    <>
      { dialog }
      <div className={classNames(className, styles['dialog-card'])}>
        <span styleName="title">{title}</span>
        <span styleName="message">{message}</span>
        <IconButton
          classes={{
            root: styles['sizing-icon'],
          }}
          onClick={onDialogToggle}
        >
          <ChatBubbleIcon />
          <CollapseIcon />
          <ExpandIcon />
        </IconButton>
        <DispositonComment />
      </div>
    </>
  );
}

DialogCard.defaultProps = {
  className: '',
  showDialog: false,
  shouldShow: true,
  dialogHeader: 'Steps to Resolve',
  dialogContent: 'Please ensure that the eval substatus and case substatus are in missing documents.',
};


DialogCard.propTypes = {
  ...propertyValidation,
  className: PropTypes.string,
  onDialogToggle: PropTypes.func.isRequired,
  shouldShow: PropTypes.bool,
};

export default DialogCard;
