import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Tooltip from '@material-ui/core/Tooltip';
import * as R from 'ramda';
import Button from '@material-ui/core/Button';
import NumberFormat from 'react-number-format';
import IncomeCalcWidget from 'containers/IncomeCalc/IncomeCalcWidget';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { operations, selectors as checklistSelectors } from 'ducks/tasks-and-checklist';
import {
  operations as dashboardOperations,
  selectors as dashboardSelectors,
} from 'ducks/dashboard';
import {
  selectors as incomeSelectors,
  operations as incomeOperations,
} from 'ducks/income-calculator';
import { hideClearButton, financialChecklist, checklistGridColumnSize } from 'constants/common';
import { operations as documentChecklistOperations } from 'ducks/document-checklist';
import Grid from '@material-ui/core/Grid';
import {
  LockCalculation,
} from 'components/ContentHeader';
import RadioButtons from './RadioButtons';
import SlaRules from '../SlaRules';
import CheckBox from './Checkbox';
import TextFields from './TextFields';
import BasicDatePicker from './BasicDatePicker';
import styles from './Checklist.css';
import SlaHeader from '../SlaHeader';
import ConfirmationDialogBox from '../Tasks/OptionalTask/ConfirmationDialogBox';
import HTMLElements from '../../constants/componentTypes';
import { FEUW_CHECKLIST } from '../../constants/frontEndChecklist';

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

const getChecklistGridName = (key, type) => R.pathOr(R.pathOr('', [key, 'default'], checklistGridColumnSize), [key, type], checklistGridColumnSize);

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
    this.checkErrors = this.checkErrors.bind(this);
    this.onClickLockCalc = this.onClickLockCalc.bind(this);
    this.onBackButtonClick = this.onBackButtonClick.bind(this);
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

  onClickLockCalc = () => {
    const {
      lockCalculation, ficoBluePrintCode, ficoLockCalculation,
    } = this.props;
    if (FEUW_CHECKLIST.includes(ficoBluePrintCode)) {
      ficoLockCalculation();
    } else {
      lockCalculation();
    }
  }

  onBackButtonClick = () => {
    const { closeHistoryView } = this.props;
    closeHistoryView();
  }

  getMultilineTextValue(id, initialValue) {
    const { multilineTextDirtyValues } = this.state;
    const dirtyValue = multilineTextDirtyValues[id];
    if (dirtyValue === undefined) {
      return initialValue;
    }
    return dirtyValue;
  }

  checkErrors() {
    const {
      onErrorValidation, documentValidation, groupName,
    } = this.props;
    onErrorValidation(groupName);
    documentValidation(groupName);
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

  handleChange(id, taskCode, additionalInfo) {
    const { onChange, processAction } = this.props;
    const actions = R.propOr(false, 'actions', additionalInfo);
    return (event) => {
      if (actions) {
        const { postProcess, postData } = actions;
        processAction(postProcess, { ...postData, value: event.target.value });
      }
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
      CHECKBOX, READ_ONLY_TEXT, CURRENCY, CHECKLIST_INTERFACE,
      INCOME_CALCULATOR, EXPENSE_CALCULATOR,
    } = HTMLElements;
    let element = {};
    switch (type) {
      case CHECKLIST_INTERFACE:
      case INCOME_CALCULATOR:
      case EXPENSE_CALCULATOR: {
        const { checklistType } = additionalInfo;
        return (<IncomeCalcWidget processInstance={processInstance} type={checklistType} />);
      }
      case RADIO_BUTTONS: {
        const onChange = this.handleChange(id, taskCode, additionalInfo);
        element = (
          <RadioButtons
            key={id}
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
            key={id}
            InputProps={{
              inputComponent: NumberFormatCustom,
            }}
          />
        );
        const hint = R.prop('hint', options);
        if (R.isNil(hint) || R.isEmpty(hint)) {
          element = textField;
        } else {
          element = (
            <Tooltip
              key={id}
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
      } break;
      case CHECKBOX: {
        const onChange = this.handleCheckboxChange(id, taskCode, value);
        element = (
          <CheckBox
            key={id}
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
        const textField = (<TextFields {...prop} key={id} />);
        const hint = R.prop('hint', options);
        if (R.isNil(hint) || R.isEmpty(hint)) {
          element = textField;
        } else {
          element = (
            <Tooltip
              key={id}
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
        const textField = (<TextFields {...prop} key={id} />);
        const hint = R.prop('hint', options);
        if (R.isNil(hint) || R.isEmpty(hint)) {
          element = textField;
        } else {
          element = (
            <Tooltip
              key={id}
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
        const datePicker = (<BasicDatePicker {...prop} key={id} />);
        if (R.isNil(hint) || R.isEmpty(hint)) {
          element = datePicker;
        } else {
          element = (
            <Tooltip
              key={id}
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
        }
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
        const textField = (<TextFields {...prop} key={id} />);
        const hint = R.prop('hint', options);
        if (R.isNil(hint) || R.isEmpty(hint)) {
          element = textField;
        } else {
          element = (
            <Tooltip
              key={id}
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
            key={id}
            InputProps={{
              readOnly: true,
            }}
          />
        );
        const hint = R.prop('hint', options);
        if (R.isNil(hint) || R.isEmpty(hint)) {
          element = textField;
        } else {
          element = (
            <Tooltip
              key={id}
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
        const textField = (<TextFields {...prop} key={id} />);
        const hint = R.prop('hint', options);
        if (R.isNil(hint) || R.isEmpty(hint)) {
          element = textField;
        } else {
          element = (
            <Tooltip
              key={id}
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
        element = <SlaRules {...props} key={id} />;
      } break;
      default:
        element = (
          <div key={id}>
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
      className, location, resolutionId, resolutionData, triggerHeader, incomeCalcInProgress,
      disableNext, disablePrev, onNext, onPrev, isIncomeVerification, historyView,
      disabledChecklist, enableLockButton, groupName, ficoBluePrintCode,
    } = this.props;
    const {
      isDialogOpen, dialogContent, dialogTitle,
    } = this.state;
    const { additionalInfo: { checklistType } } = checklistItems[0];
    const type = checklistType || checklistItems[0].type;
    const { AV } = HTMLElements;
    const showControlButtons = isIncomeVerification && !historyView && !disabledChecklist;
    const showCheckButton = isIncomeVerification && !historyView
    && !disabledChecklist && checklistType !== AV
    && !FEUW_CHECKLIST.includes(ficoBluePrintCode) ? (
      <Button
        className="material-ui-button"
        color="primary"
        onClick={this.checkErrors}
        style={{ marginRight: '0.5rem' }}
        variant="contained"
      >
        CHECK
      </Button>
      ) : null;

    const showLock = showControlButtons && groupName !== 'PROC' ? (
      <LockCalculation
        disabled={!enableLockButton}
        onClick={this.onClickLockCalc}
      />
    ) : null;
    const addBackButton = isIncomeVerification && historyView && !disabledChecklist
    && R.equals(type, AV) ? (
      <Button
        color="primary"
        onClick={this.onBackButtonClick}
      >
         BACK
      </Button>
      )
      : null;

    const addClearButton = (!hideClearButton.includes(type)) ? (
      <>
        {!(location.pathname === '/special-loan' || triggerHeader) && (
          <div styleName="clearButton">
            <Button disabled={checklistItems[0].disabled} onClick={() => this.handleOpen()}>
              Clear
            </Button>
          </div>
        )}
      </>
    ) : null;

    const checklistElements = checklistItems.filter(({ isVisible }) => isVisible)
      .map(this.renderChecklistItem);

    const isFinanceChecklist = financialChecklist.includes(type);

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
        <Grid container style={{ marginTop: '1rem' }}>
          <Grid item xs={getChecklistGridName('title', !R.isNil(addBackButton) ? `${type}-back` : type)}>
            <Typography styleName={financialChecklist.includes(type) ? 'checklist-title-income-calc' : 'checklist-title'}>{title}</Typography>
          </Grid>
          { !R.isNil(showCheckButton) && (
          <Grid item xs={getChecklistGridName('check', type)}>
            {showCheckButton}
          </Grid>
          )
          }
          { !R.isNil(showLock) && (
          <Grid item xs={getChecklistGridName('lock', type)}>
            {showLock}
          </Grid>
          )
          }
          { !R.isNil(addBackButton) && (
          <Grid item xs={getChecklistGridName('back', type)}>
            {addBackButton}
          </Grid>
          )
        }
          { R.isNil(addBackButton) && (
          <>
            <Grid item xs={getChecklistGridName('prev', type)}>
              <Button
                color="primary"
                disabled={disablePrev}
                onClick={onPrev}
              >
                  Prev
              </Button>
            </Grid>
            <Grid item xs={getChecklistGridName('next', type)}>
              <Button
                color="primary"
                disabled={disableNext}
                onClick={onNext}
              >
                    Next
              </Button>
            </Grid>

          </>
          )}
          { !R.isNil(addClearButton) && (
          <Grid item xs={getChecklistGridName('clear', type)}>
            {addClearButton}
          </Grid>
          )
          }
        </Grid>
        <div style={{ padding: !incomeCalcInProgress && type === 'sla-rules' ? '0 .2rem 0 21.1rem' : '' }} styleName={incomeCalcInProgress ? 'incomeCalc-inprogress' : 'scrollable-checklist'}>
          {isFinanceChecklist ? checklistElements
            : (
              <Paper elevation={0} styleName="checklist-form-controls">
                {checklistElements}
              </Paper>
            )
          }
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
  incomeCalcInProgress: false,
  ruleResultFromTaskTree: [],
  disableNext: false,
  disablePrev: false,
  lockCalculation: () => {},
  onErrorValidation: () => {},
  isIncomeVerification: false,
  disabledChecklist: false,
  enableLockButton: false,
  historyView: false,
  groupName: null,
  ficoBluePrintCode: '',
  ficoLockCalculation: () => {},
};

NumberFormatCustom.propTypes = {
  inputRef: PropTypes.func.isRequired,
};

Checklist.propTypes = {
  checklistItems: PropTypes.arrayOf(
    PropTypes.shape({
      additionalInfo: PropTypes.shape(),
      disabled: PropTypes.bool,
      id: PropTypes.string,
      isVisible: PropTypes.bool,
      options: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.shape({
          displayName: PropTypes.string.isRequired,
          value: PropTypes.string.isRequired,
        })),
        PropTypes.shape(),
      ]),
      showPushData: PropTypes.bool,
      taskCode: PropTypes.string,
      title: PropTypes.string,
      type: PropTypes.oneOf(Object.values(HTMLElements)),
      value: PropTypes.any,
    }),
  ).isRequired,
  children: PropTypes.node,
  className: PropTypes.string,
  closeHistoryView: PropTypes.func.isRequired,
  currentChecklistType: PropTypes.func.isRequired,
  disabledChecklist: PropTypes.bool,
  disableNext: PropTypes.bool,
  disablePrev: PropTypes.bool,
  documentValidation: PropTypes.func.isRequired,
  enableLockButton: PropTypes.bool,
  ficoBluePrintCode: PropTypes.string,
  ficoLockCalculation: PropTypes.func,
  groupName: PropTypes.string,
  handleClearSubTask: PropTypes.func.isRequired,
  handleDeleteTask: PropTypes.func.isRequired,
  handleShowDeleteTaskConfirmation: PropTypes.func.isRequired,
  historyView: PropTypes.bool,
  incomeCalcInProgress: PropTypes.bool,
  inProgress: PropTypes.bool.isRequired,
  isIncomeVerification: PropTypes.bool,
  location: PropTypes.shape({
    pathname: PropTypes.string,
    search: PropTypes.string.isRequired,
  }).isRequired,
  lockCalculation: PropTypes.func,
  onChange: PropTypes.func.isRequired,
  onErrorValidation: PropTypes.func,
  onNext: PropTypes.func.isRequired,
  onPrev: PropTypes.func.isRequired,
  processAction: PropTypes.func.isRequired,
  putComputeRulesPassed: PropTypes.func.isRequired,
  resolutionData: PropTypes.arrayOf(PropTypes.string).isRequired,
  resolutionId: PropTypes.string.isRequired,
  ruleResultFromTaskTree: PropTypes.arrayOf(PropTypes.shape),
  selectedChecklistLock: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  triggerHeader: PropTypes.bool,
};

function mapDispatchToProps(dispatch) {
  return {
    currentChecklistType: operations.currentChecklistType(dispatch),
    onErrorValidation: dashboardOperations.onErrorValidation(dispatch),
    lockCalculation: incomeOperations.lockCalculation(dispatch),
    closeHistoryView: incomeOperations.closeHistoryView(dispatch),
    documentValidation: documentChecklistOperations.onDocValidation(dispatch),
    ficoLockCalculation: incomeOperations.ficoLockCalculation(dispatch),
  };
}

const mapStateToProps = (state) => {
  const isAssigned = dashboardSelectors.isAssigned(state);
  const ficoBluePrintCode = checklistSelectors.selectedTaskBlueprintCode(state);
  return {
    isIncomeVerification: isAssigned && dashboardSelectors.isIncomeVerification(state),
    historyView: incomeSelectors.getHistoryView(state),
    disabledChecklist: incomeSelectors.disabledChecklist(state),
    enableLockButton: dashboardSelectors.enableLockButton(state),
    selectedChecklistLock: dashboardSelectors.getSelectedChecklistLock(state),
    inProgress: incomeSelectors.inProgress(state),
    groupName: dashboardSelectors.groupName(state),
    ficoBluePrintCode,
  };
};

const TestHooks = {
  Checklist,
  NumberFormatCustom,
  removeCharaters,
};

export { TestHooks };

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Checklist));
