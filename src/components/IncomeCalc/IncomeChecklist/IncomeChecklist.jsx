import React from 'react';
import PropTypes from 'prop-types';
import NumberFormat from 'react-number-format';
import * as R from 'ramda';
import { connect } from 'react-redux';
import { selectors as incomeSelectors, operations as incomeOperations } from 'ducks/income-calculator';
import { operations as taskOperations } from 'ducks/tasks-and-checklist';
import { operations as dashboardOperations, selectors as dashboardSelector } from 'ducks/dashboard';
import { selectors as widgetsSelectors } from 'ducks/widgets';
import processItem from 'lib/CustomFunctions';
import { getChecklistItems } from 'lib/checklist';
import { UNFORMAT } from 'lib/Formatters';
import TooltipWrapper from '../TooltipWrapper';
import TextFields from '../TextFields';
import ComponentTypes from '../../../constants/componentTypes';
import TaskSection from '../TaskSection';
import CustomButton from '../CustomButton';
import TabView from '../TabView';
import './IncomeChecklist.css';
import Dropdown from '../Dropdown';
import RadioButtons from '../RadioButtons';
import DatePicker from '../DatePicker';
import CheckBox from '../Checkbox';
import GridView from '../GridView';
import {
  FINANCIAL_CALCULATOR,
} from '../../../constants/widgets';


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

const unformat = (value, format) => {
  let unformattedValue = value;
  if (format && value) {
    unformattedValue = UNFORMAT[format](value);
  }
  return unformattedValue;
};

class IncomeChecklist extends React.PureComponent {
  constructor(props) {
    super(props);
    this.getMultilineTextValue = this.getMultilineTextValue.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.handleTextChange = this.handleTextChange.bind(this);
    this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
    this.handleCheckbox = this.handleCheckbox.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleWidgetClick = this.handleWidgetClick.bind(this);
    this.state = {
      multilineTextDirtyValues: {},
    };
    this.lastEditedValue = undefined;
  }


  componentDidMount() {
    const { toggleIncvrfn, checklistType, currentChecklistType } = this.props;
    currentChecklistType(checklistType);
    toggleIncvrfn(true);
  }

  componentWillUnmount() {
    const { toggleIncvrfn, disableLockButton, currentChecklistType } = this.props;
    currentChecklistType('');
    toggleIncvrfn(false);
    disableLockButton(false);
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

  getMultilineTextValue(id, initialValue, getValueFromStore) {
    const { multilineTextDirtyValues } = this.state;
    const dirtyValue = multilineTextDirtyValues[id];
    if (dirtyValue === undefined && !getValueFromStore) {
      return initialValue;
    }
    return dirtyValue;
  }

  handleWidgetCalcTypeChange = (source, value, title, isFinanceWidgetOpen) => () => {
    const { incomeCalcChecklist } = this.props;
    const buttonTitle = R.equals(source, 'value') ? value : title;
    const calcType = buttonTitle === 'Income' ? 'incomeCalcData' : 'expenseCalcData';
    incomeCalcChecklist({ isOpen: isFinanceWidgetOpen, calcType });
  }

  handleWidgetClick(title) {
    const {
      disableFinanceCalcTabButton: { disableIncomeButton, disableExpenseButton },
    } = this.props;
    if (R.equals('Income', title)) return disableIncomeButton || false;
    if (R.equals('Expense', title)) return disableExpenseButton || false;
    return false;
  }

  handleDateChange(id, taskCode, additionalInfo) {
    const { onChange, processAction } = this.props;
    const actions = R.propOr(false, 'actions', additionalInfo);
    return (value) => {
      if (actions) {
        const { postProcess, postData } = actions;
        processAction(postProcess, { ...postData, value });
      }
      onChange(id, value, taskCode);
    };
  }

  handleClick(id, taskCode) {
    const { onDelete } = this.props;
    return () => {
      onDelete(id, taskCode);
    };
  }

  handleChange(id, taskCode, additionalInfo) {
    const { onChange } = this.props;
    return (event) => {
      onChange(id, event.target.value, taskCode);
      processItem({ additionalInfo, value: event.target.value }, 'onChange');
    };
  }

  handleRemoveTask(id, taskCode) {
    const { onRemoveTask } = this.props;
    const { onChange } = this.props;
    return (value) => {
      onRemoveTask([id]);
      onChange(id, value, taskCode);
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

  handleTextChange(id) {
    return (event) => {
      const { multilineTextDirtyValues: oldValues } = this.state;
      const { value } = event.target;
      const multilineTextDirtyValues = R.assoc(id, value, oldValues);
      this.setState({
        multilineTextDirtyValues,
      });
    };
  }


  handleBlur(id, taskCode, additionalInfo) {
    return (event) => {
      const { format, skipDBSave } = additionalInfo;
      const { onChange, storeTaskValue } = this.props;
      if (event) {
        const { multilineTextDirtyValues: oldValues } = this.state;
        let value = (
          R.is(String, event.target.value)
            ? R.trim(event.target.value)
            : ''
        );
        value = unformat(value, format);
        const dirtyValue = R.isEmpty(value) ? null : value;
        if (R.has(id, oldValues)) {
          if (!skipDBSave) {
            onChange(id, dirtyValue, taskCode);
          } else {
            storeTaskValue(taskCode, dirtyValue);
          }
          this.setState({
            multilineTextDirtyValues: R.dissoc(id, oldValues),
          });
        }
      }
    };
  }

  renderChildren(disableChecklist) {
    return subTasks => this.renderChecklistItem(getChecklistItems(subTasks,
      disableChecklist));
  }


  renderChecklistItem = (checklistItems) => {
    const {
      BUTTON, TASK_SECTION, TABS, DROPDOWN, RADIO_BUTTONS, TEXT, DATE, CHECKBOX,
    } = ComponentTypes;
    const {
      disabled: disableIncomeCalc, checklistLoadStatus, location, incomeCalcData,
      isAssigned, taskValues, openWidgetList,
    } = this.props;
    const skipSubTask = [TASK_SECTION];
    const children = [];
    return checklistItems.map((item) => {
      const processedItem = processItem({ ...item, incomeCalcData }, 'preProcess');
      const {
        disabled: disabledChecklistItem,
        id,
        options,
        title,
        type,
        taskCode,
        value,
        source,
        additionalInfo,
        subTasks,
        state,
        failureReason,
      } = processedItem;
      const disabled = !isAssigned || disableIncomeCalc || disabledChecklistItem;
      let element = {};
      if (subTasks && !skipSubTask.includes(type)) children.push(subTasks);
      switch (type) {
        case TABS: {
          const onChange = this.handleDateChange(id, taskCode);
          const onDelete = this.handleRemoveTask(id, taskCode);
          const { tabViewList } = processedItem;
          const props = {
            title,
            additionalInfo,
            subTasks,
            onChange,
            onDelete,
            location,
            tabViewList,
            renderChildren: this.renderChildren(),
            value,
            failureReason,
          };
          element = <TabView key={id} {...props} />;
        } break;
        case TASK_SECTION: {
          const onChange = this.handleDateChange(id, taskCode, additionalInfo);
          const { accHeaderData } = processedItem;
          const onDelete = this.handleRemoveTask(id, taskCode);
          const props = {
            title,
            additionalInfo,
            subTasks,
            onChange,
            onDelete,
            location,
            value,
            disabled,
            renderChildren: this.renderChildren(disabled),
            failureReason,
            source,
            accHeaderData,
          };
          element = <TaskSection key={id} {...props} />;
        } break;
        case 'grid': {
          const onChange = this.handleDateChange(id, taskCode);
          const onDelete = this.handleRemoveTask(id, taskCode);
          const props = {
            title,
            additionalInfo,
            subTasks,
            onChange,
            onDelete,
            location,
            value,
            disabled,
            failureReason,
          };
          element = <GridView key={id} {...props} />;
        } break;
        case BUTTON: {
          const onChange = this.handleDateChange(id, taskCode, additionalInfo);
          const text = title || additionalInfo.placeholder;
          const isFinanceWidgetOpen = R.contains(FINANCIAL_CALCULATOR, openWidgetList);
          const typeClick = this.handleWidgetCalcTypeChange(source, value, title,
            isFinanceWidgetOpen);
          const disableWidgetClick = this.handleWidgetClick(title);
          const props = {
            id,
            taskCode,
            title: text,
            additionalInfo,
            onChange,
            typeClick,
            options,
            state,
            source,
            value,
            failureReason,
            disabled,
            isFinanceWidgetOpen,
            disableWidgetClick,
          };
          element = (<CustomButton key={id} {...props} />);
        } break;
        case DROPDOWN: {
          const onChange = this.handleChange(id, taskCode, additionalInfo);
          const getValue = this.getMultilineTextValue(id, value);
          const prop = {
            disabled,
            onChange,
            title,
            type: DROPDOWN,
            value: getValue,
            source,
            additionalInfo,
            subTasks,
            renderChildren: this.renderChildren(),
            failureReason,
            checklistLoadStatus,
          };
          element = (<Dropdown key={id} {...prop} />);
        } break;
        case TEXT: {
          const { format, skipDBSave } = additionalInfo;
          const refCallback = this.handleBlur(id, taskCode, additionalInfo);
          const onChange = this.handleTextChange(id, format);
          const getValue = this.getMultilineTextValue(id, value, skipDBSave);
          const prop = {
            onBlur: refCallback,
            disabled,
            onChange,
            componentTitle: title,
            type: TEXT,
            value: skipDBSave && getValue === undefined ? R.propOr('', taskCode, taskValues) : getValue,
            source,
            additionalInfo,
            subTasks,
            renderChecklistItems: this.renderChecklistItem,
            failureReason,
            checklistLoadStatus,
          };
          element = <TextFields key={id} {...prop} />;
        } break;
        case RADIO_BUTTONS: {
          const onChange = this.handleChange(id, taskCode);
          const text = title || additionalInfo.placeholder;
          const props = {
            id,
            disabled,
            taskCode,
            title: text,
            additionalInfo,
            onChange,
            options,
            state,
            source,
            selectedValue: value,
            failureReason,
            checklistLoadStatus,
          };
          element = (<RadioButtons key={id} {...props} />);
        } break;
        case DATE: {
          const onChange = this.handleDateChange(id, taskCode);
          const text = title || additionalInfo.placeholder;
          const props = {
            disabled,
            id,
            taskCode,
            title: text,
            additionalInfo,
            onChange,
            options,
            state,
            source,
            value,
            failureReason,
          };
          element = (<DatePicker key={id} {...props} />);
        } break;
        case CHECKBOX: {
          const onChange = this.handleCheckboxChange(id, taskCode, value);
          const onChangeMultipleBox = this.handleChange(id, taskCode);
          const props = {
            id,
            taskCode,
            title,
            additionalInfo,
            onChange,
            options,
            state,
            source,
            value,
            disabled,
            onChangeMultipleBox,
            failureReason,
            checklistLoadStatus,
          };
          element = (<CheckBox key={id} {...props} />);
        } break;
        default:
          element = (
            <div />
          );
      }
      return R.prop('errorToolTip', additionalInfo)
        ? <TooltipWrapper element={element} failureReason={failureReason} /> : element;
    });
  }

  render() {
    const { checklistItems, className } = this.props;
    return (
      <section className={className}>
        {this.renderChecklistItem(checklistItems)}
      </section>
    );
  }
}

IncomeChecklist.defaultProps = {
  className: '',
  rootTaskId: '',
  displayInRow: false,
  children: null,
  ruleResultFromTaskTree: [],
  disabled: false,
  checklistLoadStatus: null,
  isAssigned: false,
  taskValues: {},
  openWidgetList: [],
};

NumberFormatCustom.propTypes = {
  inputRef: PropTypes.func.isRequired,
};

IncomeChecklist.propTypes = {
  checklistItems: PropTypes.arrayOf(
    PropTypes.shape({
      disabled: PropTypes.bool.isRequired,
      id: PropTypes.string.isRequired,
      isVisible: PropTypes.bool,
      options: PropTypes.arrayOf(PropTypes.shape({
        displayName: PropTypes.string.isRequired,
        value: PropTypes.string.isRequired,
      })),
      showPushData: PropTypes.bool.isRequired,
      taskCode: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      type: PropTypes.oneOf(Object.values(ComponentTypes)).isRequired,
      value: PropTypes.any,
    }),
  ).isRequired,
  checklistLoadStatus: PropTypes.string,
  checklistType: PropTypes.string.isRequired,
  children: PropTypes.arrayOf(PropTypes.shape()),
  className: PropTypes.string,
  currentChecklistType: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  disableFinanceCalcTabButton: PropTypes.shape().isRequired,
  disableLockButton: PropTypes.func.isRequired,
  displayInRow: PropTypes.bool,
  handleClearSubTask: PropTypes.func.isRequired,
  handleDeleteTask: PropTypes.func.isRequired,
  handleShowDeleteTaskConfirmation: PropTypes.func.isRequired,
  incomeCalcChecklist: PropTypes.func.isRequired,
  incomeCalcData: PropTypes.shape().isRequired,
  isAssigned: PropTypes.bool,
  location: PropTypes.shape({
    pathname: PropTypes.string,
    search: PropTypes.string.isRequired,
  }).isRequired,
  onChange: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onRemoveTask: PropTypes.func.isRequired,
  openWidgetList: PropTypes.arrayOf(PropTypes.string),
  processAction: PropTypes.func.isRequired,
  putComputeRulesPassed: PropTypes.func.isRequired,
  resolutionData: PropTypes.arrayOf(PropTypes.string).isRequired,
  resolutionId: PropTypes.string.isRequired,
  rootTaskId: PropTypes.string,
  ruleResultFromTaskTree: PropTypes.arrayOf(PropTypes.shape),
  selectedWidget: PropTypes.string.isRequired,
  storeTaskValue: PropTypes.func.isRequired,
  taskValues: PropTypes.shape(),
  title: PropTypes.string.isRequired,
  toggleIncvrfn: PropTypes.func.isRequired,
};


const TestHooks = {
  IncomeChecklist,
  NumberFormatCustom,
};

export { TestHooks };

const mapStateToProps = state => ({
  incomeCalcData: incomeSelectors.getIncomeCalcData(state),
  checklistLoadStatus: incomeSelectors.getIncomeChecklistLoadStatus(state),
  isAssigned: dashboardSelector.isAssigned(state),
  taskValues: incomeSelectors.getTaskValues(state),
  openWidgetList: widgetsSelectors.getOpenWidgetList(state),
  disableFinanceCalcTabButton: dashboardSelector.getDisableFinanceCalcTabButton(state),
});

const mapDispatchToProps = dispatch => ({
  processAction: taskOperations.preProcessChecklistItems(dispatch),
  toggleIncvrfn: dashboardOperations.toggleIncvrfn(dispatch),
  disableLockButton: dashboardOperations.disableLockButton(dispatch),
  storeTaskValue: incomeOperations.storeTaskValue(dispatch),
  currentChecklistType: taskOperations.currentChecklistType(dispatch),
  incomeCalcChecklist: incomeOperations.incomeCalcChecklist(dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(IncomeChecklist);
