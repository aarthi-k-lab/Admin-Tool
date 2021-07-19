import React from 'react';
import { mount, shallow } from 'enzyme';
import * as R from 'ramda';
import Tooltip from '@material-ui/core/Tooltip';
import { TestHooks } from './Checklist';
import {
  checklistItems, bookingChecklistItems, checkBox, dropdownChecklist,
  numberAndReadOnlyText, datePickerChecklistItems, radioButtonChecklist,
  modBookingResponse, checkBoxWithOldValues, checkBoxWithMultipleValues,
  allRulesPassed, unknownChecklistType,
} from '../../models/Testmock/taskAndChecklist';
import SlaHeader from '../SlaHeader';
import CheckBox from './Checkbox';
import TextFields from './TextFields';
import BasicDatePicker from './BasicDatePicker';
import RadioButtons from './RadioButtons';

describe('<Checklist />', () => {
  const props = {
    checklistItems,
    location: {
      pathname: '/frontend-checklist',
      search: '',
    },
    handleClearSubTask: jest.fn(),
    handleDeleteTask: jest.fn(),
    handleShowDeleteTaskConfirmation: jest.fn(),
    onChange: jest.fn(),
    resolutionData: [],
    resolutionId: '',
    title: '',
    putComputeRulesPassed: jest.fn(),
  };

  const bookingChecklist = {
    checklistItems: bookingChecklistItems,
    location: {
      pathname: '/special-loan',
      search: '',
    },
  };

  it('Show /hide Clear button', () => {
    const spy = jest.spyOn(TestHooks.Checklist.prototype, 'handleOpen');
    const wrapper = shallow(<TestHooks.Checklist {...props} />);
    expect(wrapper.find('WithStyles(ForwardRef(Button))').text()).toBe('Clear');
    wrapper.find('WithStyles(ForwardRef(Button))').simulate('click');
    expect(spy).toBeCalled();
    expect(wrapper.instance().state.isDialogOpen).toBe(true);
    wrapper.setProps({ ...props, checklistItems: bookingChecklistItems });
    expect(wrapper.find('WithStyles(ForwardRef(Button))')).toHaveLength(0);
  });

  it('Show /hide SLAHeader', () => {
    const wrapper = shallow(<TestHooks.Checklist {...props} />);
    expect(wrapper.find(SlaHeader)).toHaveLength(0);
    wrapper.setProps({ ...props, triggerHeader: true });
    expect(wrapper.find(SlaHeader)).toHaveLength(1);
    wrapper.setProps({ ...props, triggerHeader: false, ...bookingChecklist });
    expect(wrapper.find(SlaHeader)).toHaveLength(1);
  });

  it('Dialog title - handleClose', async () => {
    const handleCloseSpy = jest.spyOn(TestHooks.Checklist.prototype, 'handleClose');
    const wrapper = mount(<TestHooks.Checklist
      {...props}
      dialogContent="Do you want to delete"
      dialogTitle="DELETE TASK"
      isDialogOpen
    />);
    let buttonYes = '';
    buttonYes = wrapper.find('WithStyles(ForwardRef(Button))').filterWhere(n => n.text() === 'Yes');
    buttonYes.simulate('click');
    expect(handleCloseSpy).toBeCalledWith(true);
  });

  it('Dialog title - handleClear', async () => {
    const handleClearSpy = jest.spyOn(TestHooks.Checklist.prototype, 'handleClear');
    const wrapper = mount(<TestHooks.Checklist
      {...props}
      dialogContent="Do you want to clear checklist"
      dialogTitle="CLEAR CHECKLIST"
      isDialogOpen
    />);
    let buttonYes = '';
    buttonYes = wrapper.find('WithStyles(ForwardRef(Button))').filterWhere(n => n.text() === 'Yes');
    buttonYes.simulate('click');
    expect(handleClearSpy).toBeCalledWith(true);
  });

  it('Dialog title - default', async () => {
    const handleCloseDialogSpy = jest.spyOn(TestHooks.Checklist.prototype, 'handleCloseDialog');
    const handleClearSpy = jest.spyOn(TestHooks.Checklist.prototype, 'handleClear');
    const wrapper = mount(<TestHooks.Checklist
      {...props}
    />);
    let buttonYes = '';
    wrapper.find('WithStyles(ForwardRef(Button))').simulate('click');
    expect(wrapper.instance().state.isDialogOpen).toBe(true);
    buttonYes = wrapper.find('WithStyles(ForwardRef(Button))').filterWhere(n => n.text() === 'Yes');
    buttonYes.simulate('click');
    expect(handleCloseDialogSpy).toBeCalledWith(true, wrapper.instance().state.dialogTitle);
    expect(handleClearSpy).toBeCalledWith(true);
  });

  it('Render checklist Checkbox', () => {
    const checkBoxProps = {
      checklistItems: checkBox,
    };
    const wrapper = shallow(<TestHooks.Checklist
      {...props}
      {...checkBoxProps}
    />);
    expect(wrapper.find(CheckBox)).toHaveLength(1);
    let id = '';
    let multilineTextDirtyValues = '';
    id = '5f16de580b35fde7ede8919f';
    // fresh checklist
    multilineTextDirtyValues = { '5f16de580b35fde7ede8919f': ['Modification Agreement'] };
    wrapper.find(CheckBox).prop('onChange')({ target: { value: 'Modification Agreement', checked: true } });
    expect(wrapper.instance().state.multilineTextDirtyValues[id])
      .toStrictEqual(multilineTextDirtyValues[id]);
    expect(props.onChange).toBeCalledWith(id, multilineTextDirtyValues[id], 'ALL_RTO_DISP_CHK2');

    // checklist with old values
    wrapper.setProps({ ...props, checklistItems: checkBoxWithOldValues });
    multilineTextDirtyValues = { '5f16de580b35fde7ede8919f': ['Modification Agreement', 'Assumption Agreement'] };
    wrapper.find(CheckBox).prop('onChange')({ target: { value: 'Assumption Agreement', checked: true } });
    expect(wrapper.instance().state.multilineTextDirtyValues[id])
      .toStrictEqual(multilineTextDirtyValues[id]);
    expect(props.onChange).toBeCalledWith(id, multilineTextDirtyValues[id], 'ALL_RTO_DISP_CHK2');

    // unchecking all values
    multilineTextDirtyValues = { '5f16de580b35fde7ede8919f': null };
    wrapper.find(CheckBox).prop('onChange')({ target: { value: 'Modification Agreement', checked: false } });
    expect(wrapper.instance().state.multilineTextDirtyValues[id])
      .toStrictEqual(null);
    expect(props.onChange).toBeCalledWith(id, multilineTextDirtyValues[id], 'ALL_RTO_DISP_CHK2');

    // unchecking one value
    wrapper.setProps({ ...props, checklistItems: checkBoxWithMultipleValues });
    multilineTextDirtyValues = { '5f16de580b35fde7ede8919f': ['Assumption Agreement'] };
    wrapper.find(CheckBox).prop('onChange')({ target: { value: 'Modification Agreement', checked: false } });
    expect(wrapper.instance().state.multilineTextDirtyValues[id])
      .toStrictEqual(multilineTextDirtyValues[id]);
  });

  it('Handle change ', () => {
    const checkBoxProps = {
      checklistItems: radioButtonChecklist,
    };
    const wrapper = shallow(<TestHooks.Checklist
      {...props}
      {...checkBoxProps}
    />);
    wrapper.find(RadioButtons).prop('onChange')({ target: { value: 'Yes' } });
    expect(props.onChange).toBeCalledWith('5f16e27c0b35fd975ae8937a', 'Yes', 'ALL_INC_INC_CHK2A');
  });

  it('Render Checklist items ', () => {
    const checklistProps = {
      checklistItems,
    };
    const wrapper = shallow(<TestHooks.Checklist {...props} {...checklistProps} />);
    wrapper.setProps({ checklistItems: numberAndReadOnlyText });
    expect(wrapper.find(Tooltip)).toHaveLength(7);
    expect(wrapper.find(TextFields).at(0).prop('type')).toBe('read-only-text');
    expect(wrapper.find(TextFields).at(1).prop('type')).toBe('multiline-text');
    expect(wrapper.find(TextFields).at(2).prop('type')).toBe('number');
    expect(wrapper.find(TextFields).at(3).prop('InputProps').inputComponent).toBe(TestHooks.NumberFormatCustom);
    wrapper.find(TextFields).at(1).prop('onChange')({ target: { value: 'hello' } });
    let id = '5f16e27c0b35fdd6a0e89379';
    const multilineTextDirtyValues = R.assoc(id, 'hello', {});
    expect(wrapper.instance().state.multilineTextDirtyValues)
      .toStrictEqual(multilineTextDirtyValues);
    wrapper.find(TextFields).at(3).prop('onChange')({ target: { value: 'hello123' } });
    id = '5f16e27cs34b35fd5242e891';
    expect(wrapper.instance().state.multilineTextDirtyValues)
      .toStrictEqual(R.assoc(id, '123', multilineTextDirtyValues));
    wrapper.setProps({ ...props, checklistItems: datePickerChecklistItems });
    expect(wrapper.find(BasicDatePicker)).toHaveLength(2);
    expect(TestHooks.removeCharaters('ABCD123')).toBe('123');
    wrapper.find(BasicDatePicker).at(0).prop('refCallback')({ target: { value: 'Yes' } });
    expect(props.onChange).toBeCalledWith('5f16e73287d90ee4b6fda318', { target: { value: 'Yes' } }, 'GOV_LNHR_CHK28');
    wrapper.setProps({ ...props, checklistItems: unknownChecklistType });
    expect(wrapper.find('WithStyles(ForwardRef(Paper))').text()).toBe('Unknown checklist item type:drop-down-menu');
    wrapper.setProps({ ...props, checklistItems: dropdownChecklist });
  });

  it('Checklist- componentDidMount', () => {
    const wrapper = shallow(<TestHooks.Checklist
      {...props}
      {...bookingChecklist}
      ruleResultFromTaskTree={allRulesPassed}
    />);
    expect(props.putComputeRulesPassed).toHaveBeenCalledWith(true);
    wrapper.setProps({
      ...props,
      ruleResultFromTaskTree: modBookingResponse,
    });
    wrapper.instance().componentDidMount();
    expect(props.putComputeRulesPassed).toHaveBeenCalledWith(false);
  });
});
