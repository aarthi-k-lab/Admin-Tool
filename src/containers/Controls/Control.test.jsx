/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { shallow, mount } from 'enzyme';
import {
  EndShift, Expand, GetNext, Assign, Unassign, SendToUnderwriting,
  SendToDocGen, SendToDocGenStager, ContinueMyReview, SendToDocsIn,
  CompleteForbearance, CompleteMyReview,
} from 'components/ContentHeader';
import Control from '../Dashboard/TasksAndChecklist/Controls';
import userdts from '../../models/Testmock/controls';
import { TestHooks } from './Controls';

const defaultProps = {
  onAssignToMeClick: jest.fn(),
  showCompleteMyReview: false,
  taskName: '',
  taskStatus: '',
  user: userdts,
  disableTrialTaskButton: false,
  disableValidation: false,
  dispositionCode: '',
  evalId: '',
  processId: '',
  showUpdateRemedy: false,
  validateDispositionTrigger: jest.fn(),
  errorBanner: {
    errors: [],
    warnings: [],
  },
  lockCalculation: jest.fn(),
};

describe('<Controls />', () => {
  it('does not show Any button', () => {
    const wrapper = shallow(<TestHooks.Controls
      {...defaultProps}
      disableTrialTaskButton
      disableValidation
      dispositionCode="0"
      evalId="0"
      history
      processId="0"
      user={userdts}
      validateDispositionTrigger={jest.fn()}
    />);
    expect(wrapper.find(Assign)).toHaveLength(0);
    expect(wrapper.find(Unassign)).toHaveLength(0);
    expect(wrapper.find(Control)).toHaveLength(0);
    expect(wrapper.find(GetNext)).toHaveLength(0);
    expect(wrapper.find(SendToUnderwriting)).toHaveLength(0);
    expect(wrapper.find(CompleteForbearance)).toHaveLength(0);
    expect(wrapper.find(SendToDocGenStager)).toHaveLength(0);
    expect(wrapper.find(SendToDocGen)).toHaveLength(0);
    expect(wrapper.find(SendToDocsIn)).toHaveLength(0);
    expect(wrapper.find(ContinueMyReview)).toHaveLength(0);
    expect(wrapper.find(CompleteMyReview)).toHaveLength(0);
    expect(wrapper.find(EndShift)).toHaveLength(0);
    expect(wrapper.find(Expand)).toHaveLength(1);
  });

  it('show / hide  \'Assign\' & \'Unassign\' button ', () => {
    let props = {
      disableTrialTaskButton: true,
      disableValidation: true,
      dispositionCode: '0',
      evalId: '0',
      processId: '0',
      showAssign: false,
      user: { userdts },
      validateDispositionTrigger: jest.fn(),
    };
    const wrapper = shallow(<TestHooks.Controls {...defaultProps} {...props} groupName="ABCD" />);
    expect(wrapper.find(Unassign)).toHaveLength(0);
    expect(wrapper.find(Assign)).toHaveLength(0);
    props = { ...props, groupName: 'FEUW' };
    wrapper.setProps({ ...props });
    expect(wrapper.find(Unassign)).toHaveLength(0);
    expect(wrapper.find(Assign)).toHaveLength(1);
    wrapper.setProps({ ...props, showAssign: true });
    expect(wrapper.find(Assign)).toHaveLength(0);
    expect(wrapper.find(Unassign)).toHaveLength(1);
  });

  it('show / hide  \' Validate\' button ', () => {
    const spy = jest.spyOn(TestHooks.Controls.prototype, 'validateDisposition');
    const validateDispositionTrigger = jest.fn();
    const props = {
      disableValidation: true,
      dispositionCode: '0',
      evalId: '0',
      processId: '0',
      showAssign: null,
      user: { ...userdts },
      validateDispositionTrigger,
      groupName: 'FEUW',
      onAssignToMeClick: jest.fn(),
    };
    const wrapper = mount(<TestHooks.Controls {...defaultProps} {...props} />);
    expect(wrapper.find(Control)).toHaveLength(0);
    wrapper.setProps({ ...props, showValidate: true });
    expect(wrapper.find(Control)).toHaveLength(1);
    wrapper.setProps({ ...props, showValidate: false, showUpdateRemedy: true });
    expect(wrapper.find(Control)).toHaveLength(1);
    wrapper.setProps({ disableValidation: false });
    wrapper.find('WithStyles(ForwardRef(Button))').simulate('click');
    expect(validateDispositionTrigger).toBeCalled();
    expect(spy).toBeCalled();
    document.dispatchEvent(new KeyboardEvent('keydown', { keyCode: 86 }));
    document.dispatchEvent(new KeyboardEvent('keyup', { keyCode: 86 }));
    expect(validateDispositionTrigger).toBeCalledTimes(2);
    expect(spy).toBeCalledTimes(2);
  });

  it('simulate  \'GetNext Click\'', () => {
    const onGetNext = jest.fn();
    const spy = jest.spyOn(TestHooks.Controls.prototype, 'handlegetNext');
    const props = {
      ...defaultProps,
      disableTrialTaskButton: true,
      dispositionCode: '0',
      evalId: '0',
      onGetNext,
      processId: '0',
      showCompleteMyReview: true,
      showUpdateRemedy: true,
      showValidate: true,
      enableGetNext: false,
      isFirstVisit: true,
      enableValidate: false,
      taskName: 'Trial Plan',
      taskStatus: 'Active',
      user: { ...userdts },
      validateDispositionTrigger: jest.fn(),
    };
    const wrapper = mount(<TestHooks.Controls {...defaultProps} {...props} />);
    expect(wrapper.find(GetNext)).toHaveLength(0);
    wrapper.setProps({ showGetNext: true });
    expect(wrapper.find(GetNext)).toHaveLength(1);
    wrapper.find(GetNext).simulate('click');
    expect(spy).not.toBeCalled();
    wrapper.setProps({ enableGetNext: true, isFirstVisit: false, enableValidate: false });
    wrapper.find(GetNext).simulate('click');
    document.dispatchEvent(new KeyboardEvent('keydown', { keyCode: 71 }));
    document.dispatchEvent(new KeyboardEvent('keyup', { keyCode: 71 }));
    expect(spy).not.toBeCalled();
    wrapper.setProps({ enableGetNext: true, isFirstVisit: true, enableValidate: true });
    wrapper.find(GetNext).simulate('click');
    expect(spy).toBeCalled();
    expect(onGetNext).toBeCalled();
    document.dispatchEvent(new KeyboardEvent('keydown', { keyCode: 71 }));
    document.dispatchEvent(new KeyboardEvent('keyup', { keyCode: 71 }));
    expect(spy).toBeCalledTimes(2);
    expect(onGetNext).toBeCalledTimes(2);
  });

  it('simulate  \'EndShift\'', () => {
    const onEndShift = jest.fn();
    const wrapper = mount(<TestHooks.Controls
      {...defaultProps}
      onEndShift={onEndShift}
    />);
    expect(wrapper.find(EndShift)).toHaveLength(0);
    wrapper.setProps({ showEndShift: true });
    expect(wrapper.find(EndShift)).toHaveLength(1);
    wrapper.setProps({ enableEndShift: false });
    wrapper.find(EndShift).simulate('click');
    expect(onEndShift).not.toBeCalled();
    wrapper.setProps({ enableEndShift: true, enableValidate: false });
    wrapper.find(EndShift).simulate('click');
    expect(onEndShift).not.toBeCalled();
    wrapper.setProps({ enableEndShift: true, enableValidate: true });
    wrapper.find(EndShift).simulate('click');
    expect(onEndShift).toBeCalled();
    document.dispatchEvent(new KeyboardEvent('keydown', { keyCode: 69 }));
    document.dispatchEvent(new KeyboardEvent('keyup', { keyCode: 69 }));
    expect(onEndShift).toBeCalledTimes(2);
  });

  it('simulate  \' SendToDocGenStager and  ForbearanceIcon\' click', () => {
    const onSendToDocGen = jest.fn();
    const onTrialTask = jest.fn();
    const sendToDocGenStagerSpy = jest.spyOn(TestHooks.Controls.prototype, 'handleSendToDocGenStager');
    const handleTrialSpy = jest.spyOn(TestHooks.Controls.prototype, 'handleTrial');
    const wrapper = mount(<TestHooks.Controls
      {...defaultProps}
      disableTrialTaskButton
      enableSendToDocGen={false}
      onSendToDocGen={onSendToDocGen}
      onTrialTask={onTrialTask}
    />);
    const showTrialIcon = {
      taskStatus: 'Active',
      taskName: 'Trial Plan',
    };
    expect(wrapper.find(SendToDocGenStager)).toHaveLength(0);
    wrapper.setProps({ showSendToDocGenStager: true });
    expect(wrapper.find(SendToDocGenStager)).toHaveLength(1);
    wrapper.setProps({ enableSendToDocGen: false, disableTrialTaskButton: false });
    wrapper.find(SendToDocGenStager).simulate('click');
    expect(sendToDocGenStagerSpy).not.toBeCalled();
    wrapper.setProps({ enableSendToDocGen: true, disableTrialTaskButton: false, isTrialDisable: false });
    wrapper.find(SendToDocGenStager).simulate('click');
    expect(sendToDocGenStagerSpy).toBeCalled();
    expect(onSendToDocGen).toBeCalledWith(true);
    wrapper.setProps({ showSendToDocGenStager: false, ...showTrialIcon });
    expect(wrapper.find(SendToDocGenStager)).toHaveLength(1);
    wrapper.setProps({ disableTrialTaskButton: true });
    wrapper.find(SendToDocGenStager).simulate('click');
    expect(handleTrialSpy).not.toBeCalled();
    wrapper.setProps({ disableTrialTaskButton: false });
    wrapper.find(SendToDocGenStager).simulate('click');
    expect(handleTrialSpy).toBeCalled();
    expect(onTrialTask).toBeCalled();
    const showForbearanceIcon = {
      taskStatus: 'Active',
      taskName: 'Forbearance',
    };
    expect(wrapper.find(CompleteForbearance)).toHaveLength(0);
    wrapper.setProps({ showSendToDocGenStager: false, ...showForbearanceIcon });
    expect(wrapper.find(CompleteForbearance)).toHaveLength(1);
    wrapper.setProps({ disableTrialTaskButton: true });
    wrapper.find(CompleteForbearance).simulate('click');
    expect(handleTrialSpy).toBeCalledTimes(1);
    wrapper.setProps({ disableTrialTaskButton: false });
    wrapper.find(CompleteForbearance).simulate('click');
    expect(handleTrialSpy).toBeCalledTimes(2);
    expect(onTrialTask).toBeCalledTimes(2);
  });

  it('simulate  \'SendToUnderWritingIcon Click\'', () => {
    const onSentToUnderwriting = jest.fn();
    const spy = jest.spyOn(TestHooks.Controls.prototype, 'handleSentToUnderwriting');
    const wrapper = mount(<TestHooks.Controls
      {...defaultProps}
      onSentToUnderwriting={onSentToUnderwriting}
    />);
    expect(wrapper.find(SendToUnderwriting)).toHaveLength(0);
    wrapper.setProps({ showSendToUnderWritingIcon: true });
    expect(wrapper.find(SendToUnderwriting)).toHaveLength(1);
    wrapper.setProps({ enableSendToUW: false });
    wrapper.find(SendToUnderwriting).simulate('click');
    expect(spy).not.toBeCalled();
    wrapper.setProps({ enableSendToUW: true, isTrialDisable: false });
    wrapper.find(SendToUnderwriting).simulate('click');
    expect(spy).toBeCalled();
    expect(onSentToUnderwriting).toBeCalled();
  });

  it('simulate  \' SendToDocGen Click\'', () => {
    const onSendToDocGen = jest.fn();
    const spy = jest.spyOn(TestHooks.Controls.prototype, 'handleSendToDocGen');
    const wrapper = mount(<TestHooks.Controls
      {...defaultProps}
      onSendToDocGen={onSendToDocGen}
    />);
    expect(wrapper.find(SendToDocGen)).toHaveLength(0);
    wrapper.setProps({ showSendToDocGen: true });
    expect(wrapper.find(SendToDocGen)).toHaveLength(1);
    wrapper.setProps({ enableSendToDocGen: false });
    wrapper.find(SendToDocGen).simulate('click');
    expect(spy).not.toBeCalled();
    wrapper.setProps({ enableSendToDocGen: true });
    wrapper.find(SendToDocGen).simulate('click');
    expect(spy).toBeCalled();
    expect(onSendToDocGen).toBeCalledWith(false);
  });

  it('simulate  \'SendToDocsIn Click\'', () => {
    const onSendToDocsIn = jest.fn();
    const spy = jest.spyOn(TestHooks.Controls.prototype, 'handleSendToDocsIn');
    const wrapper = mount(<TestHooks.Controls
      {...defaultProps}
      onSendToDocsIn={onSendToDocsIn}
    />);
    expect(wrapper.find(SendToDocsIn)).toHaveLength(0);
    wrapper.setProps({ showSendToDocsIn: true });
    expect(wrapper.find(SendToDocsIn)).toHaveLength(1);
    wrapper.setProps({ enableSendToDocsIn: false });
    wrapper.find(SendToDocsIn).simulate('click');
    expect(spy).not.toBeCalled();
    wrapper.setProps({ enableSendToDocsIn: true });
    wrapper.find(SendToDocsIn).simulate('click');
    expect(spy).toBeCalled();
    expect(onSendToDocsIn).toBeCalled();
  });

  it('simulate  \'ContinueMyReview Click\'', () => {
    const onContinueMyReview = jest.fn();
    const spy = jest.spyOn(TestHooks.Controls.prototype, 'handleContinueMyReview');
    const wrapper = shallow(<TestHooks.Controls
      {...defaultProps}
      onContinueMyReview={onContinueMyReview}
    />);
    expect(wrapper.find(ContinueMyReview)).toHaveLength(0);
    wrapper.setProps({ showContinueMyReview: true });
    expect(wrapper.find(ContinueMyReview)).toHaveLength(1);
    wrapper.find(ContinueMyReview).simulate('click');
    expect(spy).toBeCalled();
    expect(onContinueMyReview).toBeCalledWith('Assigned');
  });

  it('simulate  \'CompleteMyReview Click\'', () => {
    const onCompleteMyReview = jest.fn();
    const wrapper = shallow(<TestHooks.Controls
      {...defaultProps}
      groupName="FEUW"
      onCompleteMyReview={onCompleteMyReview}
    />);
    expect(wrapper.find(CompleteMyReview)).toHaveLength(0);
    wrapper.setProps({ showCompleteMyReview: true });
    expect(wrapper.find(CompleteMyReview)).toHaveLength(0);
    wrapper.setProps({ groupName: 'BOOKING' });
    expect(wrapper.find(CompleteMyReview)).toHaveLength(1);
    wrapper.find(CompleteMyReview).simulate('click');
    expect(onCompleteMyReview).toBeCalledWith('Complete My Review');
  });

  it('simulate  \' componentWillUnmount\'', () => {
    const onAssignToMeClick = jest.fn();
    const onExpand = jest.fn();
    const wrapper = shallow(<TestHooks.Controls
      {...defaultProps}
      groupName="FEUW"
      onAssignToMeClick={onAssignToMeClick}
      onExpand={onExpand}
    />);
    document.dispatchEvent(new KeyboardEvent('keydown', { keyCode: 77 }));
    document.dispatchEvent(new KeyboardEvent('keyup', { keyCode: 77 }));
    expect(onExpand).toBeCalled();
    wrapper.instance().componentWillUnmount();
    expect(onAssignToMeClick).toBeCalledWith(false);
  });
});
