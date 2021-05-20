import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Tooltip from '@material-ui/core/Tooltip';
import * as R from 'ramda';
import Button from '@material-ui/core/Button';
import NumberFormat from 'react-number-format';
import IncomeCalcWidget from 'containers/IncomeCalc/IncomeCalcWidget';
import RadioButtons from './RadioButtons';
import SlaRules from '../SlaRules';
import CheckBox from './Checkbox';
import TextFields from './TextFields';
import BasicDatePicker from './BasicDatePicker';
import styles from './Checklist.css';
import SlaHeader from '../SlaHeader';
import ConfirmationDialogBox from '../Tasks/OptionalTask/ConfirmationDialogBox';
import HTMLElements from '../../constants/componentTypes';

const DIALOG_TITLE = 'Do you want to clear current checklist?';
const DELETE_TASK = 'DELETE TASK';
const CLEAR_CHECKLIST = 'CLEAR CHECKLIST';

const NumberFormatCustom = (props) => {
  const { inputRef, ...other } = props;
  return (
    <NumberFormat
      {...other}
      getInputRef={inputRef}
      isNumericString
      prefix="$"
      thousandSeparator
    />
  );
};

const removeCharaters = value => value.replace(/[^0-9.]/g, '');

class Checklist extends React.PureComponent {
  constructor(props) {
    super(props);
    this.renderChecklistItem = this.renderChecklistItem.bind(this);
    this.getMultilineTextValue = this.getMultilineTextValue.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.handleTextChange = this.handleTextChange.bind(this);
    this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
    this.handleCheckbox = this.handleCheckbox.bind(this);
    this.state = {
      multilineTextDirtyValues: {},
      isDialogOpen: false,
      dialogContent: '',
      dialogTitle: '',
    };
    this.lastEditedValue = undefined;
  }

  componentDidMount() {
    const { putComputeRulesPassed, ruleResultFromTaskTree } = this.props;
    const isAllRulesPassed = ruleResultFromTaskTree.map((item) => {
      const auditRulesResult = JSON.parse(JSON.stringify(item));
      delete auditRulesResult.text;
      const val = Object.values(auditRulesResult)[0];
      return val;
    }).includes('false');
    putComputeRulesPassed(!isAllRulesPassed);
  }

  static getDerivedStateFromProps(props) {
    if (props.isDialogOpen) {
      return {
        isDialogOpen: props.isDialogOpen,
        dialogContent: props.dialogContent,
        dialogTitle: props.dialogTitle,
      };
    }
    return null;
  }

  getMultilineTextValue(id, initialValue) {
    const { multilineTextDirtyValues } = this.state;
    const dirtyValue = multilineTextDirtyValues[id];
    if (dirtyValue === undefined) {
      return initialValue;
    }
    return dirtyValue;
  }

  handleBlur(id, taskCode, type) {
    return (element) => {
      const { onChange } = this.props;
      if (element) {
        element.addEventListener('blur', (event) => {
          const { multilineTextDirtyValues: oldValues } = this.state;
          let value = (
            R.is(String, event.target.value)
              ? R.trim(event.target.value)
              : ''
          );
          value = type === 'currency' ? removeCharaters(value) : value;
          const dirtyValue = R.isEmpty(value) ? null : value;
          if (!R.equals(this.lastEditedValue, oldValues[id])) {
            onChange(id, dirtyValue, taskCode);
            this.lastEditedValue = oldValues[id];
            const multilineTextDirtyValues = R.dissoc(id, oldValues);
            this.setState({
              multilineTextDirtyValues,
            });
          }
        });
      }
    };
  }

  handleDateChange(id, taskCode) {
    const { onChange } = this.props;
    return (value) => {
      onChange(id, value, taskCode);
    };
  }

  handleChange(id, taskCode) {
    const { onChange } = this.props;
    return (event) => {
      onChange(id, event.target.value, taskCode);
    };
  }

  handleCheckbox(id, taskCode, multilineTextDirtyValues) {
    const { onChange } = this.props;
    onChange(id, multilineTextDirtyValues[id], taskCode);
  }

  handleCheckboxChange(id, taskCode, oldValues) {
    return (event) => {
      let multilineTextDirtyValues = {};
      if (R.isEmpty(oldValues) || R.isNil(oldValues)) {
        multilineTextDirtyValues = R.assoc(id, [event.target.value], oldValues);
      } else if (R.contains(event.target.value, oldValues)) {
        const checkboxItems = R.without([event.target.value],
          oldValues);
        const value = R.isEmpty(checkboxItems) ? null : checkboxItems;
        multilineTextDirtyValues = R.assoc(id, value, oldValues);
      } else {
        multilineTextDirtyValues = R.assoc(id, [...oldValues, event.target.value], oldValues);
      }
      this.setState({
        multilineTextDirtyValues,
      });
      this.handleCheckbox(id, taskCode, multilineTextDirtyValues);
    };
  }

  handleTextChange(id, type) {
    return (event) => {
      const { multilineTextDirtyValues: oldValues } = this.state;
      const multilineTextDirtyValues = R.assoc(id, type === 'currency' ? removeCharaters(event.target.value) : event.target.value, oldValues);
      this.setState({
        multilineTextDirtyValues,
      });
    };
  }

  handleOpen() {
    this.setState({
      isDialogOpen: true,
      dialogContent: CLEAR_CHECKLIST,
      dialogTitle: DIALOG_TITLE,
    });
  }

  handleCloseDialog(isConfirmed, dialogTitle) {
    switch (dialogTitle) {
      case DELETE_TASK: this.handleClose(isConfirmed); break;
      case CLEAR_CHECKLIST: this.handleClear(isConfirmed); break;
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
        title: DELETE_TASK,
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
    source,
    additionalInfo,
    processInstance,
  }) {
    const {
      RADIO_BUTTONS, MULTILINE_TEXT, TEXT, NUMBER, DATE, DROPDOWN, SLA_RULES,
      CHECKBOX, READ_ONLY_TEXT, CURRENCY, INCOME_CALCULATOR,
    } = HTMLElements;
    let element = {};
    switch (type) {
      case INCOME_CALCULATOR: {
        return (<IncomeCalcWidget processInstance={processInstance} />);
      }
      case RADIO_BUTTONS: {
        const onChange = this.handleChange(id, taskCode);
        element = (
          <RadioButtons
            disabled={disabled}
            onChange={onChange}
            options={options}
            selectedValue={value}
            title={title}
          />
        );
      } break;
      case CURRENCY: {
        const refCallback = this.handleBlur(id, taskCode, type);
        const onChange = this.handleTextChange(id, type);
        const getValue = this.getMultilineTextValue(id, R.isNil(value)
          ? value : removeCharaters(value));
        const prop = {
          disabled,
          inputRef: refCallback,
          onChange,
          componentTitle: title,
          value: getValue,
        };
        const textField = (
          <TextFields
            {...prop}
            InputProps={{
              inputComponent: NumberFormatCustom,
            }}
          />
        );
        const hint = R.prop('hint', options);
        if (R.isNil(hint) || R.isEmpty(hint)) {
          element = textField;
        }
        element = (
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
      } break;
      case CHECKBOX: {
        const onChange = this.handleCheckboxChange(id, taskCode, value);
        element = (
          <CheckBox
            disabled={disabled}
            onChange={onChange}
            options={options}
            selectedValue={value || []}
            title={title}
          />
        );
      } break;
      case MULTILINE_TEXT: {
        const refCallback = this.handleBlur(id, taskCode);
        const onChange = this.handleTextChange(id);
        const getValue = this.getMultilineTextValue(id, value);
        const prop = {
          disabled,
          inputRef: refCallback,
          onChange,
          componentTitle: title,
          type: MULTILINE_TEXT,
          value: getValue,
        };
        const textField = (<TextFields {...prop} />);
        const hint = R.prop('hint', options);
        if (R.isNil(hint) || R.isEmpty(hint)) {
          element = textField;
        }
        element = (
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
      } break;
      case NUMBER: {
        const refCallback = this.handleBlur(id, taskCode);
        const onChange = this.handleTextChange(id);
        const getValue = this.getMultilineTextValue(id, value);
        const prop = {
          disabled,
          inputRef: refCallback,
          onChange,
          componentTitle: title,
          type: NUMBER,
          value: getValue,
        };
        const textField = (<TextFields {...prop} />);
        const hint = R.prop('hint', options);
        if (R.isNil(hint) || R.isEmpty(hint)) {
          element = textField;
        }
        element = (
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
      } break;
      case DATE: {
        const refCallback = this.handleDateChange(id, taskCode);
        const hint = R.prop('hint', options);
        const prop = {
          disabled,
          format: 'MM/DD/YYYY',
          title,
          refCallback,
          value,
        };
        const datePicker = (<BasicDatePicker {...prop} />);
        if (R.isNil(hint) || R.isEmpty(hint)) {
          element = datePicker;
        }
        element = (
          <Tooltip
            classes={{
              tooltip: styles.tooltip,
            }}
            disableFocusListener
            disableTouchListener
            placement="right"
            title={hint}
          >
            <div>{datePicker}</div>
          </Tooltip>
        );
      } break;
      case TEXT: {
        const refCallback = this.handleBlur(id, taskCode);
        const onChange = this.handleTextChange(id);
        const getValue = this.getMultilineTextValue(id, value);
        const prop = {
          disabled,
          inputRef: refCallback,
          onChange,
          componentTitle: title,
          type: TEXT,
          value: getValue,
        };
        const textField = (<TextFields {...prop} />);
        const hint = R.prop('hint', options);
        if (R.isNil(hint) || R.isEmpty(hint)) {
          element = textField;
        }
        element = (
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
      } break;
      case READ_ONLY_TEXT: {
        const refCallback = this.handleBlur(id, taskCode);
        const getValue = this.getMultilineTextValue(id, value);
        const prop = {
          inputRef: refCallback,
          componentTitle: title,
          type: READ_ONLY_TEXT,
          value: getValue,
        };
        const textField = (
          <TextFields
            {...prop}
            InputProps={{
              readOnly: true,
            }}
          />
        );
        const hint = R.prop('hint', options);
        if (R.isNil(hint) || R.isEmpty(hint)) {
          element = textField;
        }
        element = (
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
      } break;
      case DROPDOWN: {
        // const refCallback = this.handleBlur(id, taskCode);
        const onChange = this.handleChange(id, taskCode);
        const getValue = this.getMultilineTextValue(id, value);
        const prop = {
          disabled,
          onChange,
          componentTitle: title,
          type: DROPDOWN,
          value: getValue,
          source,
          additionalInfo,
        };
        const textField = (<TextFields {...prop} />);
        const hint = R.prop('hint', options);
        if (R.isNil(hint) || R.isEmpty(hint)) {
          element = textField;
        }
        element = (
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
      } break;
      case SLA_RULES: {
        const refCallback = this.handleBlur(id, taskCode);
        const onChange = this.handleTextChange(id);
        const getValue = this.getMultilineTextValue(id, value);
        const props = {
          title,
          options,
          additionalInfo,
          disabled,
          inputRef: refCallback,
          onChange,
          type: TEXT,
          value: getValue,
        };
        element = <SlaRules {...props} />;
      } break;
      default:
        element = (
          <div>
            Unknown checklist item type:
            {type}
          </div>
        );
    }
    return element;
  }

  render() {
    const {
      checklistItems, children, title,
      className, location, resolutionId, resolutionData, triggerHeader,
    } = this.props;
    const {
      isDialogOpen, dialogContent, dialogTitle,
    } = this.state;
    const { INCOME_CALCULATOR } = HTMLElements;
    const checklistElements = checklistItems.filter(({ isVisible }) => isVisible)
      .map(this.renderChecklistItem);
    const addClearButton = (!R.equals(checklistItems[0].type, 'sla-rules') && !R.equals(checklistItems[0].type, 'income-calculator')) && (
      <>
        <div styleName="subTaskDescParent">
          <div styleName="subTaskDescription">
            <Typography styleName="checklist-title">{title}</Typography>
          </div>
        </div>
        {!(location.pathname === '/special-loan' || triggerHeader) && (
          <div styleName="clearButton">
            <Button disabled={checklistItems[0].disabled} onClick={() => this.handleOpen()}>
            Clear
            </Button>
          </div>
        )}
      </>
    );
    return (
      <section className={className}>
        {children}
        { (location.pathname === '/special-loan' || triggerHeader)
          && (
            <SlaHeader
              disabled={checklistItems[0].disabled}
              enablePushDataButton={location.pathname === '/special-loan'}
              resolutionData={resolutionData}
              showPushDataButton={R.propOr(false, 'showPushData', checklistItems[0])}
              text={resolutionId}
              title={title}
              triggerHeader={triggerHeader}
            />
          )}
        {addClearButton}
        <div styleName="scrollable-checklist">
          {R.equals(R.prop('type', R.head(checklistItems)), INCOME_CALCULATOR)
            ? checklistElements : (
              <Paper elevation={1} styleName="checklist-form-controls">
                {checklistElements}
              </Paper>
            ) }

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
  children: null,
  triggerHeader: false,
  ruleResultFromTaskTree: [],
};

NumberFormatCustom.propTypes = {
  inputRef: PropTypes.func.isRequired,
};

Checklist.propTypes = {
  checklistItems: PropTypes.arrayOf(
    PropTypes.shape({
      disabled: PropTypes.bool.isRequired,
      id: PropTypes.string.isRequired,
      isVisible: PropTypes.bool,
      options: PropTypes.arrayOf(PropTypes.shape({
        displayName: PropTypes.string.isRequired,
        hint: PropTypes.string,
        value: PropTypes.string.isRequired,
      })),
      showPushData: PropTypes.bool.isRequired,
      taskCode: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      type: PropTypes.oneOf(Object.values(HTMLElements)).isRequired,
      value: PropTypes.any,
    }),
  ).isRequired,
  children: PropTypes.node,
  className: PropTypes.string,
  handleClearSubTask: PropTypes.func.isRequired,
  handleDeleteTask: PropTypes.func.isRequired,
  handleShowDeleteTaskConfirmation: PropTypes.func.isRequired,
  location: PropTypes.shape({
    pathname: PropTypes.string,
    search: PropTypes.string.isRequired,
  }).isRequired,
  onChange: PropTypes.func.isRequired,
  putComputeRulesPassed: PropTypes.func.isRequired,
  resolutionData: PropTypes.arrayOf(PropTypes.string).isRequired,
  resolutionId: PropTypes.string.isRequired,
  ruleResultFromTaskTree: PropTypes.arrayOf(PropTypes.shape),
  title: PropTypes.string.isRequired,
  triggerHeader: PropTypes.bool,
};


const TestHooks = {
  Checklist,
  NumberFormatCustom,
  removeCharaters,
};

export { TestHooks };

export default Checklist;
