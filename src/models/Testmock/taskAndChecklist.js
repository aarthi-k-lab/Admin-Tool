const checklistItems = [{
  id: '5eec5b0b4291ef481b2c4af1',
  disabled: false,
  isVisible: true,
  options: [{ displayName: 'Final Document Review', value: 'Final Document Review' }, { displayName: 'Action Required', value: 'Action Required' }, { displayName: 'Booking Prep Decision', value: 'Booking Prep Decision' }, {
    displayName: 'Safe Act Review', value: 'Safe Act Review', isEnabled: false, textColor: 'red', hint: 'Unable to select Safe Act Review due to the property not being in a Safe Act Required state.',
  }, { displayName: 'Handoff', value: 'Handoff' }],
  taskCode: 'DOCSIN_INGR_CHK1',
  title: 'Please select the Disposition Group?',
  type: 'radio',
  source: '',
  additionalInfo: {},
  showPushData: false,
  state: 'in-progress',
}, {
  id: '5eec5b0c4291ef0f3a2c4b00', disabled: false, isVisible: false, options: [{ displayName: 'Execution Errors', value: 'Execution Errors', hint: 'Select this option if the mod agreement was not executed correctly.' }, { displayName: 'Missing Signatures', value: 'Missing Signatures', hint: 'Select this option if the mod agreement is missing borrower signatures and additional supporting documentation is required.' }, { displayName: 'Name Change Required', value: 'Name Change Required', hint: "Select this option if the borrower's name has changed and the mod agreement must be regenerated. " }, { displayName: 'Send to Booking Prep Agent', value: 'Send to Booking Prep Agent', hint: 'Select this option if the mod agreement has no errors and is ready for booking review.' }], taskCode: 'DOCSIN_INGR_CHK2', title: 'Final Document Review', type: 'radio', source: '', additionalInfo: {}, showPushData: false, state: 'in-progress',
}, {
  id: '5eec5b0c4291ef797b2c4af4', disabled: false, isVisible: false, options: [{ displayName: 'Wait', value: 'Wait', hint: "If you are unable to move forward with your review do to an unforeseen circumstance and you have your manager's permission then select this option to follow up after 24 hours. " }, { displayName: 'Funds Needed to Book', value: 'Funds Needed to Book', hint: 'Select this option if additional funds are needed before the mod may be booked. ' }, { displayName: 'Ticket Submitted', value: 'Ticket Submitted', hint: 'If a ticket is needed to be submitted then choose this option to follow up after 24 hours. ' }, { displayName: 'Cash Adjustment Pending', value: 'Cash Adjustment Pending', hint: 'Select this option if an account services request is pending which must be completed before booking review may continue. ' }], taskCode: 'DOCSIN_INGR_CHK3', title: 'Action Required', type: 'radio', source: '', additionalInfo: {}, showPushData: false, state: 'in-progress',
}, {
  id: '5eec5b0c4291ef43892c4afd',
  disabled: false,
  isVisible: false,
  options: [{ displayName: 'Send to Intake', value: 'Send to Intake', hint: 'Select this option if there is an issue with the mod agreement that requires the intake team to review and address.' }, { displayName: 'Redraw Mod Agreement', value: 'Redraw Mod Agreement', hint: 'Select this option if there is an issue with the mod agreement that requires the doc gen team to review and potentially redraw to correct. ' }, {
    displayName: 'Send to Book', value: 'Send to Book', hint: 'Select this option if all checks are completed and the mod is ready for booking. ', textColor: 'black',
  }, { displayName: 'Send for Reject', value: 'Send for Reject', hint: 'Select this option if the evaluation should be rejected. ' }, {
    displayName: 'Safe Act Required', value: 'Safe Act Required', hint: 'Unable to select Safe Act Review due to the property not being in a Safe Act Required state.', isEnabled: false, textColor: 'red',
  }],
  taskCode: 'DOCSIN_INGR_CHK4',
  title: 'Booking Prep Decision',
  type: 'radio',
  source: '',
  additionalInfo: {},
  showPushData: false,
  state: 'in-progress',
}, {
  id: '5eec5b0c4291ef53e92c4af5',
  disabled: false,
  isVisible: false,
  options: [{ displayName: 'Send to Intake', value: 'Send to Intake', hint: 'Select this option if there is an issue with the mod agreement that requires the intake team to review and address.' }, { displayName: 'Redraw Mod Agreement', value: 'Redraw Mod Agreement', hint: 'Select this option if there is an issue with the mod agreement that requires the doc gen team to review and potentially redraw to correct. ' }, {
    displayName: 'Send to Book', value: 'Send to Book', hint: 'Select this option if all checks are completed and the mod is ready for booking. ', textColor: 'black',
  }, { displayName: 'Send for Reject', value: 'Send for Reject', hint: 'Select this option if the evaluation should be rejected. ' }, {
    displayName: 'Safe Act Required', value: 'Safe Act Required', hint: 'Unable to select Safe Act Review due to the property not being in a Safe Act Required state.', isEnabled: false, textColor: 'red',
  }, { displayName: 'Reject', value: 'Reject', hint: 'Select this option if you are a manager and the evaluation should be rejected.' }],
  taskCode: 'DOCSIN_INGR_CHK4A',
  title: 'Booking Prep Decision',
  type: 'radio',
  source: '',
  additionalInfo: {},
  showPushData: false,
  state: 'in-progress',
}, {
  id: '5eec5b0c4291ef1f312c4af6', disabled: false, isVisible: false, options: [{ displayName: 'Yes', value: 'Yes', hint: 'Select YES if a loan assumption agreement has been received and is executed properly.' }, { displayName: 'No', value: 'No', hint: 'Select NO if a loan assumption agreement has NOT been received.' }], taskCode: 'DOCSIN_INGR_CHK4.10', title: 'Is this a loan assumption?', type: 'radio', source: '', additionalInfo: {}, showPushData: false, state: 'in-progress',
}, {
  id: '5eec5b0c4291ef2d862c4afe', disabled: false, isVisible: false, options: [{ displayName: 'Yes', value: 'Yes', hint: 'Select YES if a prior servicer generated the mod agreement.' }, { displayName: 'No', value: 'No', hint: 'Select NO if Mr Cooper generated the mod agreement.' }], taskCode: 'DOCSIN_INGR_CHK4.20', title: 'Did a prior servicer generate the mod agreement?', type: 'radio', source: '', additionalInfo: {}, showPushData: false, state: 'in-progress',
}, {
  id: '5eec5b0b4291ef08902c4af2', disabled: false, isVisible: false, options: [{ displayName: 'Yes', value: 'Yes', hint: 'Select YES if a manual change request form has been created and used for the booking review.' }, { displayName: 'No', value: 'No', hint: 'Select NO if a manual change request for will NOT be created and used for the booking review.' }], taskCode: 'DOCSIN_INGR_CHK4.30', title: 'Will a manual change request form be submitted for booking review?', type: 'radio', source: '', additionalInfo: {}, showPushData: false, state: 'in-progress',
}, {
  id: '5eec5b0c4291ef7d332c4b05', disabled: false, isVisible: false, options: [{ displayName: 'Safe Act Denied', value: 'Safe Act Denied', hint: 'Select this option if there is an issue with the mod agreement and Safe Act is denied. ' }, { displayName: 'Safe Act Approved', value: 'Safe Act Approved', hint: 'Select this option if there are no issues with the mod agreement and Safe Act is approved. ' }], taskCode: 'DOCSIN_INGR_CHK5', title: 'Safe Act Review', type: 'radio', source: '', additionalInfo: {}, showPushData: false, state: 'in-progress',
}, {
  id: '5eec5b0c4291effd272c4b02', disabled: false, isVisible: false, options: [{ displayName: 'Offshore Review Required', value: 'Offshore Review Required', hint: 'Select this option if you are an onshore agent requesting for offshore to review. Please ensure the Eval is Active and the most recent Resolution case is open and the resolution substatus is not in "Referral", "Referral KB" or "Tax Transcript Ordered". ' }, { displayName: 'Offshore Team Lead Review Required', value: 'Offshore Team Lead Review Required', hint: 'Select this option if you are an offshore agent and need assistance from your Team Lead to complete the task. ' }, { displayName: 'Onshore Review Required', value: 'Onshore Review Required', hint: 'Select this option if you are an offshore team lead and need an onshore review for further assistance. ' }, { displayName: 'Onshore Team Lead Review Required', value: 'Onshore Team Lead Review Required', hint: 'Select this option if you have a team lead onshore that will assist with certain activities.' }, { displayName: 'Manager Unreject Required', value: 'Manager Unreject Required', hint: 'Select this option if you need a manager to unreject the evaluation and mod case so that booking review can continue. ' }, { displayName: 'Manager Review Required', value: 'Manager Review Required', hint: "Select this option if you are an onshore agent and need your manager's help to review a file. " }], taskCode: 'DOCSIN_INGR_CHK6', title: 'Handoff', type: 'radio', source: '', additionalInfo: {}, showPushData: false, state: 'in-progress',
}, {
  id: '5eec5b0c4291ef769c2c4af3', disabled: false, isVisible: false, options: [], taskCode: 'DOCSIN_INGR_CHK7', title: 'Select the assignee ', type: 'dropdown', source: 'adgroup', additionalInfo: { group: 'docsin' }, showPushData: false, state: 'in-progress',
}];

const selectedTaskId = '5eec5b0b4291effef72c4aef';
const rootTaskId = '5eec5b0b4291efaca32c4aea';
const selectedTaskBlueprintCode = 'DOCSIN_INGR';

const inProgress = false;
const instructions = '-';
const isAssigned = true;
const message = 'do-not-display';
const location = {
  pathname: '/docs-in',
};

const bookingChecklistItems = [{
  id: '5ee9f8c34291ef38292c445e', disabled: false, isVisible: true, options: [], taskCode: 'SLAPOST_CHK10', title: 'Pre-Mod UPB Check', type: 'sla-rules', source: '', additionalInfo: { displayName: 'Determine whether the correct pre-mod UPB from Remedy was used to book the modification in LSAMS.' }, showPushData: false, state: 'in-progress',
}, {
  id: '5ee9f8c34291efa8f32c4460', disabled: false, isVisible: true, options: [], taskCode: 'SLAPOST_CHK11', title: 'Last Paid Installment Date (LPI Date) Check', type: 'sla-rules', source: '', additionalInfo: { displayName: 'Determine whether the correct Last Paid Installment Date (LPI) Date from Remedy was used to book the modification. ' }, showPushData: false, state: 'in-progress',
}, {
  id: '5ee9f8c34291ef433d2c445c', disabled: false, isVisible: true, options: [], taskCode: 'SLAPOST_CHK12', title: 'UPB Check', type: 'sla-rules', source: '', additionalInfo: { displayName: 'Determine whether the correct modified UPB from Remedy was updated in LSAMS at mod booking. ' }, showPushData: false, state: 'in-progress',
}, {
  id: '5ee9f8c34291ef22892c4468', disabled: false, isVisible: true, options: [], taskCode: 'SLAPOST_CHK13', title: 'Next Due Date Check', type: 'sla-rules', source: '', additionalInfo: { displayName: 'Determine whether the correct Next Due Date from Remedy was updated correctly in LSAMS at mod booking. ' }, showPushData: false, state: 'in-progress',
}, {
  id: '5ee9f8c34291efe2032c445f', disabled: false, isVisible: true, options: [], taskCode: 'SLAPOST_CHK14', title: 'Payment Changes Check', type: 'sla-rules', source: '', additionalInfo: { displayName: 'Determine whether the interest rates, P&I payment amounts, and monthly escrow effective dates from Remedy were updated correctly in LSAMS at mod booking. ' }, showPushData: false, state: 'in-progress',
}, {
  id: '5ee9f8c34291ef16802c4465', disabled: false, isVisible: true, options: [], taskCode: 'SLAPOST_CHK15', title: 'Monthly Escrow Check', type: 'sla-rules', source: '', additionalInfo: { displayName: 'Determine whether the monthly escrow payment from Remedy was updated correctly in LSAMS at mod booking. ' }, showPushData: false, state: 'in-progress',
}, {
  id: '5ee9f8c34291ef9c272c4461', disabled: false, isVisible: true, options: [], taskCode: 'SLAPOST_CHK16', title: 'Forbearance Check', type: 'sla-rules', source: '', additionalInfo: { displayName: 'Determine whether principal forbearance from Remedy (if applicable) was updated correctly in LSAMS at mod booking. ' }, showPushData: false, state: 'in-progress',
}, {
  id: '5ee9f8c34291efb9602c445d', disabled: false, isVisible: true, options: [], taskCode: 'SLAPOST_CHK17', title: 'Forgiveness Check', type: 'sla-rules', source: '', additionalInfo: { displayName: 'Determine whether principal forgiveness from Remedy (if applicable) was updated correctly in LSAMS at mod booking. ' }, showPushData: false, state: 'in-progress',
}, {
  id: '5ee9f8c34291ef81252c4466', disabled: false, isVisible: true, options: [], taskCode: 'SLAPOST_CHK18', title: 'Partial Claim Check', type: 'sla-rules', source: '', additionalInfo: { displayName: 'Determine whether partial claim from Remedy (if applicable) was updated correctly in LSAMS at mod booking. ' }, showPushData: false, state: 'in-progress',
}, {
  id: '5ee9f8c34291ef47c32c4463', disabled: false, isVisible: true, options: [], taskCode: 'SLAPOST_CHK19', title: 'Maturity Date Check', type: 'sla-rules', source: '', additionalInfo: { displayName: 'Determine whether the mod maturity date from Remedy was updated correctly in LSAMS at mod booking. ' }, showPushData: false, state: 'in-progress',
}, {
  id: '5ee9f8c34291efd32a2c4469', disabled: false, isVisible: true, options: [], taskCode: 'SLAPOST_CHK20', title: 'Balloon Date Check', type: 'sla-rules', source: '', additionalInfo: { displayName: 'Determine whether the balloon date was updated correctly in LSAMS at mod booking. ' }, showPushData: false, state: 'in-progress',
}, {
  id: '5ee9f8c34291ef2b862c4462', disabled: false, isVisible: true, options: [], taskCode: 'SLAPOST_CHK21', title: 'Interest Flag Check', type: 'sla-rules', source: '', additionalInfo: { displayName: 'Determine whether the interest flag was updated correctly in LSAMS at mod booking. ' }, showPushData: false, state: 'in-progress',
}, {
  id: '5ee9f8c34291ef294d2c4464', disabled: false, isVisible: true, options: [], taskCode: 'SLAPOST_CHK22', title: 'ARM Specification Check', type: 'sla-rules', source: '', additionalInfo: { displayName: 'Determine whether the ARM Specification was updated correctly in LSAMS at mod booking. ' }, showPushData: false, state: 'in-progress',
}, {
  id: '5ee9f8c34291efa9092c446a', disabled: false, isVisible: true, options: [], taskCode: 'SLAPOST_CHK23', title: 'Mortgage Instrument Check', type: 'sla-rules', source: '', additionalInfo: { displayName: 'Determine whether the mortgage instrument was updated correctly in LSAMS at mod booking. ' }, showPushData: false, state: 'in-progress',
}, {
  id: '5ee9f8c34291ef7c5c2c4467', disabled: false, isVisible: true, options: [], taskCode: 'SLAPOST_CHK24', title: 'Late Fees Check', type: 'sla-rules', source: '', additionalInfo: { displayName: 'Determine whether all late fees were waived from LSAMS at mod booking. ' }, showPushData: false, state: 'in-progress',
}];
module.exports = {
  location,
  message,
  checklistItems,
  selectedTaskId,
  rootTaskId,
  selectedTaskBlueprintCode,
  inProgress,
  instructions,
  isAssigned,
  bookingChecklistItems,
};
