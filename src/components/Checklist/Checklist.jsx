import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Tooltip from '@material-ui/core/Tooltip';
import * as R from 'ramda';
import Button from '@material-ui/core/Button';
import RadioButtons from './RadioButtons';
import styles from './Checklist.css';
import ConfirmationDialogBox from '../Tasks/OptionalTask/ConfirmationDialogBox';


const RADIO_BUTTONS = 'radio';
const MULTILINE_TEXT = 'multiline-text';

class Checklist extends React.PureComponent {
  constructor(props) {
    super(props);
    this.renderChecklistItem = this.renderChecklistItem.bind(this);
    this.getMultilineTextValue = this.getMultilineTextValue.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.handleTextChange = this.handleTextChange.bind(this);
    this.handleOpen = this.handleOpen.bind(this);
    this.handleClear = this.handleClear.bind(this);
    this.state = {
      multilineTextDirtyValues: {},
      isDialogOpen: false,
      dialogContent: '',
      dialogTitle: '',
    };
  }

  componentWillReceiveProps(newProps) {
    this.setState({
      isDialogOpen: newProps.isDialogOpen,
      dialogContent: newProps.dialogContent,
      dialogTitle: newProps.dialogTitle,
    });
  }

  getMultilineTextValue(id, initialValue) {
    const { multilineTextDirtyValues } = this.state;
    const dirtyValue = multilineTextDirtyValues[id];
    if (dirtyValue === undefined) {
      return initialValue;
    }
    return dirtyValue;
  }

  handleBlur(id, taskCode) {
    return (element) => {
      const { onChange } = this.props;
      if (element) {
        element.addEventListener('blur', (event) => {
          const { multilineTextDirtyValues: oldValues } = this.state;
          const value = (
            R.is(String, event.target.value)
              ? R.trim(event.target.value)
              : ''
          );
          const dirtyValue = R.isEmpty(value) ? null : value;
          const multilineTextDirtyValues = R.dissoc(id, oldValues);
          this.setState({
            multilineTextDirtyValues,
          });
          onChange(id, dirtyValue, taskCode);
        });
      }
    };
  }

  handleChange(id, taskCode) {
    const { onChange } = this.props;
    return (event) => {
      onChange(id, event.target.value, taskCode);
    };
  }

  handleTextChange(id) {
    return (event) => {
      const { multilineTextDirtyValues: oldValues } = this.state;
      const multilineTextDirtyValues = R.assoc(id, event.target.value, oldValues);
      this.setState({
        multilineTextDirtyValues,
      });
    };
  }

  handleOpen() {
    this.setState({
      isDialogOpen: true,
      dialogContent: 'You want to clear all the checklist?',
      dialogTitle: 'CLEAR CHECKLIST',
    });
  }

  handleCloseDialog(isConfirmed, dialogTitle) {
    switch (dialogTitle) {
      case 'DELETE TASK': this.handleClose(isConfirmed); break;
      case 'CLEAR CHECKLIST': this.handleClear(isConfirmed); break;
      default: this.handleClear(isConfirmed); break;
    }
  }

  handleClear(isConfirmed) {
    const { handleClearSubTask } = this.props;
    handleClearSubTask(isConfirmed);
    this.setState({
      isDialogOpen: false,
    });
  }

  handleClose(isConfirmed) {
    const payload = {
      deleteTaskConfirmationDialog: {
        title: 'DELETE TASK',
        isOpen: false,
        content: 'Deleting a task will delete all the associated checklist information. Do you like to proceed?',
      },
    };
    const { handleDeleteTask, handleShowDeleteTaskConfirmation } = this.props;
    handleDeleteTask(isConfirmed);
    handleShowDeleteTaskConfirmation(payload);
    this.setState({
      isDialogOpen: false,
    });
  }

  renderChecklistItem({
    disabled,
    id,
    options,
    title,
    type,
    taskCode,
    value,
  }) {
    switch (type) {
      case RADIO_BUTTONS: {
        const onChange = this.handleChange(id, taskCode);
        return (
          <RadioButtons
            disabled={disabled}
            onChange={onChange}
            options={options}
            selectedValue={value}
            title={title}
          />
        );
      }
      case MULTILINE_TEXT: {
        const refCallback = this.handleBlur(id, taskCode);
        const textField = (
          <TextField
            disabled={disabled}
            inputRef={refCallback}
            label={title}
            maxRows={10}
            multiline
            onChange={this.handleTextChange(id)}
            rows={5}
            value={this.getMultilineTextValue(id, value)}
          />
        );
        const hint = R.prop('hint', options);
        if (R.isNil(hint) || R.isEmpty(hint)) {
          return textField;
        }
        return (
          <Tooltip
            classes={{
              tooltip: styles.tooltip,
            }}
            disableFocusListener
            disableTouchListener
            placement="right"
            title={hint}
          >
            {textField}
          </Tooltip>
        );
      }
      default:
        return (
          <div>
            Unknown checklist item type:
            {type}
          </div>
        );
    }
  }

  render() {
    const {
      checklistItems, children, title,
      className,
    } = this.props;
    const {
      isDialogOpen, dialogContent, dialogTitle,
    } = this.state;
    return (
      <section className={className}>
        {children}
        <div style={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
          <div style={{ flexGrow: 4, flexBasis: 0 }}>
            <Typography styleName="checklist-title" variant="h5">{title}</Typography>
          </div>
          <div style={{ flexGrow: 0, flexBasis: 0, alignSelf: 'flex-end' }}>
            <Button onClick={this.handleOpen}>
              Clear
            </Button>
          </div>
        </div>
        <div styleName="scrollable-checklist">
          <Paper elevation={1} styleName="checklist-form-controls">
            {
              checklistItems
                .filter(({ isVisible }) => isVisible)
                .map(this.renderChecklistItem)
            }
          </Paper>
        </div>
        <ConfirmationDialogBox
          isOpen={isDialogOpen}
          message={dialogContent}
          onClose={isConfirmed => this.handleCloseDialog(isConfirmed, dialogTitle)}
          title={dialogTitle}
        />
      </section>
    );
  }
}

Checklist.defaultProps = {
  className: '',
};

Checklist.propTypes = {
  checklistItems: PropTypes.arrayOf(
    PropTypes.shape({
      disabled: PropTypes.bool.isRequired,
      id: PropTypes.string.isRequired,
      isVisible: PropTypes.bool,
      options: PropTypes.shape({
        displayName: PropTypes.string.isRequired,
        value: PropTypes.string.isRequired,
      }),
      taskCode: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      type: PropTypes.oneOf([RADIO_BUTTONS, MULTILINE_TEXT]).isRequired,
      value: PropTypes.any,
    }),
  ).isRequired,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  handleClearSubTask: PropTypes.func.isRequired,
  handleDeleteTask: PropTypes.func.isRequired,
  handleShowDeleteTaskConfirmation: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,

  title: PropTypes.string.isRequired,
};

export default Checklist;
