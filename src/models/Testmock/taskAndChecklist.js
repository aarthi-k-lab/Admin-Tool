const checklistItems = [
  {
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
  },
];

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


const checkBox = [{
  id: '5f16de580b35fd3d16e891a0', isVisible: true, options: [{ displayName: 'Yes', value: 'Yes', hint: '' }, { displayName: 'No', value: 'No', hint: '' }], taskCode: 'ALL_RTO_RDOC_CHK1', title: 'Are there any documents that require recordation?', type: 'radio', value: 'Yes', source: '', additionalInfo: {},
}, {
  id: '5f16de580b35fde7ede8919f',
  isVisible: true,
  options: [
    { displayName: 'Modification Agreement', value: 'Modification Agreement', hint: 'Select all that Apply' },
    { displayName: 'Assumption Agreement', value: 'Assumption Agreement', hint: 'Select all that Apply' },
    { displayName: 'Partial Claim', value: 'Partial Claim', hint: 'Select all that Apply' },
    { displayName: '258A', value: '258A', hint: 'Select all that Apply' }],
  taskCode: 'ALL_RTO_DISP_CHK2',
  title: 'Please select ALL documents that require recordation',
  type: 'checkbox',
  source: '',
  additionalInfo: {},
}];

const checkBoxWithOldValues = [{
  id: '5f16de580b35fd3d16e891a0', isVisible: true, options: [{ displayName: 'Yes', value: 'Yes', hint: '' }, { displayName: 'No', value: 'No', hint: '' }], taskCode: 'ALL_RTO_RDOC_CHK1', title: 'Are there any documents that require recordation?', type: 'radio', value: 'Yes', source: '', additionalInfo: {},
}, {
  id: '5f16de580b35fde7ede8919f',
  isVisible: true,
  options: [
    { displayName: 'Modification Agreement', value: 'Modification Agreement', hint: 'Select all that Apply' },
    { displayName: 'Assumption Agreement', value: 'Assumption Agreement', hint: 'Select all that Apply' },
    { displayName: 'Partial Claim', value: 'Partial Claim', hint: 'Select all that Apply' },
    { displayName: '258A', value: '258A', hint: 'Select all that Apply' }],
  taskCode: 'ALL_RTO_DISP_CHK2',
  title: 'Please select ALL documents that require recordation',
  type: 'checkbox',
  source: '',
  value: ['Modification Agreement'],
  additionalInfo: {},
}];

const checkBoxWithMultipleValues = [{
  id: '5f16de580b35fd3d16e891a0', isVisible: true, options: [{ displayName: 'Yes', value: 'Yes', hint: '' }, { displayName: 'No', value: 'No', hint: '' }], taskCode: 'ALL_RTO_RDOC_CHK1', title: 'Are there any documents that require recordation?', type: 'radio', value: 'Yes', source: '', additionalInfo: {},
}, {
  id: '5f16de580b35fde7ede8919f',
  isVisible: true,
  options: [
    { displayName: 'Modification Agreement', value: 'Modification Agreement', hint: 'Select all that Apply' },
    { displayName: 'Assumption Agreement', value: 'Assumption Agreement', hint: 'Select all that Apply' },
    { displayName: 'Partial Claim', value: 'Partial Claim', hint: 'Select all that Apply' },
    { displayName: '258A', value: '258A', hint: 'Select all that Apply' }],
  taskCode: 'ALL_RTO_DISP_CHK2',
  title: 'Please select ALL documents that require recordation',
  type: 'checkbox',
  source: '',
  value: ['Modification Agreement', 'Assumption Agreement'],
  additionalInfo: {},
}];

const numberAndReadOnlyText = [{
  id: '5f16e27c0b35fd5200e89376', isVisible: true, options: { hint: 'Please enter the amount' }, taskCode: 'ALL_INC_INC_CHK2', title: 'Is the expected incentive amount correct?', type: 'read-only-text', source: '', additionalInfo: {},
}, {
  id: '5f16e27c0b35fd975ae8937a', isVisible: true, options: [{ displayName: 'Yes', value: 'Yes' }, { displayName: 'No', value: 'No' }], taskCode: 'ALL_INC_INC_CHK2A', title: 'Is the expected incentive amount correct?', type: 'radio', value: 'Yes', source: '', additionalInfo: {},
}, {
  id: '5f16e27c0b35fd5b31e89375', isVisible: false, options: { hint: 'Please enter the amount' }, taskCode: 'ALL_INC_INC_CHK3', title: 'What is the expected incentive amount?', type: 'number', source: '', additionalInfo: {},
}, {
  id: '5f16e27c0b35fdd6a0e89379', isVisible: true, options: { hint: 'Please enter the amount' }, taskCode: 'ALL_INC_INC_CHK4', title: 'Is the actual incentive amount received correct?', type: 'multiline-text', source: '', additionalInfo: {},
}, {
  id: '5f16e27c0b35fd7cfae89377', isVisible: true, options: [{ displayName: 'Yes', value: 'Yes' }, { displayName: 'No', value: 'No' }], taskCode: 'ALL_INC_INC_CHK4A', title: 'Is the actual incentive amount received correct?', type: 'radio', value: 'No', source: '', additionalInfo: {},
}, {
  id: '5f16e27c0b35fd2085e89378', isVisible: true, options: { hint: 'Please enter the amount' }, taskCode: 'ALL_INC_INC_CHK5', title: 'What is the actual incentive amount received?', type: 'number', source: '', additionalInfo: {},
}, {
  id: '5f16e27cs34b35fd5242e891', isVisible: true, options: { hint: 'Please enter the amount' }, taskCode: 'ALL_INC_INC_CHK2', title: 'Is the expected incentive amount correct?', type: 'currency', source: '', additionalInfo: {},
}, {
  id: '5f16e27cs34b35fd5242e891',
  isVisible: true,
  options: { hint: 'Please enter the amount' },
  taskCode: 'ALL_INC_INC_CHK2',
  title: 'Is the expected incentive amount correct?',
  type: 'currency',
  source: '',
  value: '123',
  additionalInfo: {},
}, {
  id: '1f16e27c0b35fdd6a0e89312', isVisible: true, options: { hint: 'Please enter the amount' }, taskCode: 'ALL_INC_INC_CHK14', title: 'Is the actual incentive amount received correct?', type: 'multiline-text', source: '', additionalInfo: {},
}, {
  id: 'nf16227c0b35fdd6a0e8939g', isVisible: true, options: { hint: 'Please enter the amount' }, taskCode: 'ALL_INC_INC_CHK24', title: 'Is the actual incentive amount received correct?', type: 'text', source: '', additionalInfo: {},
}];

const checklistWithoutHint = [{
  id: '5f16e27c0b35fd5200e89376', isVisible: true, options: [], taskCode: 'ALL_INC_INC_CHK2', title: 'Is the expected incentive amount correct?', type: 'read-only-text', source: '', additionalInfo: {},
}, {
  id: '5f16e27c0b35fd5200e89343', isVisible: true, options: { hint: '' }, taskCode: 'ALL_INC_INC_CHK2', title: 'Is the expected incentive amount correct?', type: 'read-only-text', source: '', additionalInfo: {},
}, {
  id: '5f16e27c0b35fdd6a0e89379', isVisible: true, options: [], taskCode: 'ALL_INC_INC_CHK4', title: 'Is the actual incentive amount received correct?', type: 'multiline-text', source: '', additionalInfo: {},
}, {
  id: '1f16e27c0b35fdd6a0e89312', isVisible: true, options: { hint: '' }, taskCode: 'ALL_INC_INC_CHK14', title: 'Is the actual incentive amount received correct?', type: 'multiline-text', source: '', additionalInfo: {},
}, {
  id: '5f16e27c0b35fd2085e89378', isVisible: true, options: [], taskCode: 'ALL_INC_INC_CHK5', title: 'What is the actual incentive amount received?', type: 'number', source: '', additionalInfo: {},
}, {
  id: '5f16e27c0b35fd2085e83vf3', isVisible: true, options: { hint: '' }, taskCode: 'ALL_INC_INC_CHK5', title: 'What is the actual incentive amount received?', type: 'number', source: '', additionalInfo: {},
}, {
  id: '5f16e27cs34b35fd5242e891', isVisible: true, options: [], taskCode: 'ALL_INC_INC_CHK2', title: 'Is the expected incentive amount correct?', type: 'currency', source: '', additionalInfo: {},
}, {
  id: '5f16e27cs34b323d5242e823',
  isVisible: true,
  options: { hint: '' },
  taskCode: 'ALL_INC_INC_CHK2',
  title: 'Is the expected incentive amount correct?',
  type: 'currency',
  source: '',
  value: '123',
  additionalInfo: {},
}, {
  id: '0f16227c0b35fdd6x0e8939g', isVisible: true, options: [], taskCode: 'ALL_INC_INC_CHK24', title: 'Is the actual incentive amount received correct?', type: 'text', source: '', additionalInfo: {},
}, {
  id: '6f16227c0b35fdd6a0e89136', isVisible: true, options: { hint: '' }, taskCode: 'ALL_INC_INC_CHK24', title: 'Is the actual incentive amount received correct?', type: 'text', source: '', additionalInfo: {},
}, {
  id: 'ff16e73287s902e4b6fd4d14',
  disabled: false,
  isVisible: true,
  options: { },
  taskCode: 'GOV_LNHR_CHK28',
  title: 'What is the date of the last modification completed? ',
  type: 'date',
  value: '07-21-2020',
  source: '',
  additionalInfo: {},
  showPushData: false,
  state: 'in-progress',
}, {
  id: 'ff16e73287s902e4b6fd4d1234',
  disabled: false,
  isVisible: true,
  options: { hint: '' },
  taskCode: 'GOV_LNHR_CHK28',
  title: 'What is the date of the last modification completed? ',
  type: 'date',
  value: '07-21-2020',
  source: '',
  additionalInfo: {},
  showPushData: false,
  state: 'in-progress',
}];

const datePickerChecklistItems = [{
  id: '5f16e73287d90e47c8fda30c', disabled: false, isVisible: true, options: [{ displayName: 'Yes', value: 'Yes', hint: 'The borrower must wait 1 full year after origination to be eligible for a modification and must have made a total of 4 payments over the life of the loan.' }, { displayName: 'No', value: 'No', hint: 'The borrower must wait 1 full year after origination to be eligible for a modification and must have made a total of 4 payments over the life of the loan.' }], taskCode: 'GOV_LNHR_CHK20', title: 'Did the loan meet minimum payment performance requirements after origination to continue this evaluation? ', type: 'radio', value: 'Yes', source: '', additionalInfo: {}, showPushData: false, state: 'in-progress',
}, {
  id: '5f16e73287d90e020ffda30d', disabled: false, isVisible: true, options: [{ displayName: 'Yes', value: 'Yes', hint: 'The FHA insurance status may be found in the RPA results or on the Neighborhood Watch site. Active status indicates that the insurance is intact. ' }, { displayName: 'No', value: 'No', hint: 'The FHA insurance status may be found in the RPA results or on the Neighborhood Watch site. Active status indicates that the insurance is intact. ' }], taskCode: 'GOV_LNHR_CHK22', title: 'Is the FHA insurance intact?', type: 'radio', value: 'Yes', source: '', additionalInfo: {}, showPushData: false, state: 'in-progress',
}, {
  id: '5f16e73287d90e2eb0fda319', disabled: false, isVisible: true, options: { hint: 'Review the RPA results and determine the unpaid principal balance (UPB) at time of default. If the RPA is unable to determine the UPB at default then either review the FHA Neighborhood Watch site or the prior servicer pay history to determine the amount, whichever method is appropriate. ' }, taskCode: 'GOV_LNHR_CHK23', title: 'Determine the UPB at time of default.', type: 'number', value: '1', source: '', additionalInfo: {}, showPushData: false, state: 'in-progress',
}, {
  id: '5f16e73287d90e2af0fda315', disabled: false, isVisible: true, options: { hint: 'Review the RPA results and determine the total previous partial claim amount. This amount is the total of all existing unpaid partial claims in Neighborhood Watch. ' }, taskCode: 'GOV_LNHR_CHK24', title: 'Determine total previous partial claim amount. ', type: 'number', value: '1', source: '', additionalInfo: {}, showPushData: false, state: 'in-progress',
}, {
  id: '5f16e73287d90ed52dfda31a', disabled: false, isVisible: false, options: [], taskCode: 'GOV_LNHR_CHK26', title: 'How many times has the loan been modified previously?', type: 'number', source: '', additionalInfo: {}, showPushData: false, state: 'in-progress',
}, {
  id: '5f16e73287d90e346efda314', disabled: false, isVisible: false, options: [{ displayName: 'Yes', value: 'Yes' }, { displayName: 'No', value: 'No' }], taskCode: 'GOV_LNHR_CHK27', title: 'Has the loan exceeded the maximum allowable number of modifications?', type: 'radio', source: '', additionalInfo: {}, showPushData: false, state: 'in-progress',
}, {
  id: '5f16e73287d90ee4b6fda318',
  disabled: false,
  isVisible: true,
  options: { hint: ' Review the RPA results and determine the date of the the last modification completed.' },
  taskCode: 'GOV_LNHR_CHK28',
  title: 'What is the date of the last modification completed? ',
  type: 'date',
  value: '07-21-2020',
  source: '',
  additionalInfo: {},
  showPushData: false,
  state: 'in-progress',
}, {
  id: 'ff16e73287s902e4b6fd4d14',
  disabled: false,
  isVisible: true,
  options: { },
  taskCode: 'GOV_LNHR_CHK28',
  title: 'What is the date of the last modification completed? ',
  type: 'date',
  value: '07-21-2020',
  source: '',
  additionalInfo: {},
  showPushData: false,
  state: 'in-progress',
}, {
  id: '5f16e73287d90eec78fda31e', disabled: false, isVisible: true, options: [{ displayName: 'Yes', value: 'Yes', hint: 'Review the RPA results and determine if a completed loan modification has been reported to the investor within the past 24 months.' }, { displayName: 'No', value: 'No', hint: 'Review the RPA results and determine if a completed loan modification has been reported to the investor within the past 24 months.' }], taskCode: 'GOV_LNHR_CHK31', title: 'Did the loan have a modification within the prior 24 months?', type: 'radio', source: '', additionalInfo: {}, showPushData: false, state: 'in-progress',
}, {
  id: '5f16e73287d90ed64dfda31b', disabled: false, isVisible: false, options: [{ displayName: 'Yes', value: 'Yes', hint: 'Review the RPA results and determine if a completed loan modification has been reported to the investor within the past 36 months.' }, { displayName: 'No', value: 'No', hint: 'Review the RPA results and determine if a completed loan modification has been reported to the investor within the past 36 months.' }], taskCode: 'GOV_LNHR_CHK32', title: 'Did the loan have a modification within the prior 36 months?', type: 'radio', source: '', additionalInfo: {}, showPushData: false, state: 'in-progress',
}];

const unknownChecklistType = [{
  id: '5f16e73287d90ed64dfda31b',
  disabled: false,
  isVisible: true,
  taskCode: 'GOV_LNHR_CHK32',
  title: 'Did the loan have a modification within the prior 36 months?',
  type: 'drop-down-menu',
  source: '',
  additionalInfo: {},
  showPushData: false,
  state: 'in-progress',

}, {
  id: '5f16e73287d90ed64dfda31b',
  disabled: false,
  isVisible: true,
  taskCode: 'GOV_LNHR_CHK32',
  title: 'Did the loan have a modification within the prior 36 months?',
  type: 'label-with-icon',
  source: '',
  additionalInfo: {},
  showPushData: false,
  state: 'in-progress',

}];

const allRulesPassed = [
  {
    corporateAdvanceBalanceCheck: 'true',
    text: 'There are no corporate advances in Remedy',
  },
  {
    borrowerFundCheck: 'true',
    text: 'Borrower Funds(Suspense Balance + Down Payment) in Remedy(0 + 0) <= Balance(Suspense Balance + MISC Balance) in LSAMS(0 + 0)',
  },
];

const allRulesFailed = [
  {
    corporateAdvanceBalanceCheck: 'false',
    text: 'There are no corporate advances in Remedy',
  },
  {
    borrowerFundCheck: 'false',
    text: 'Borrower Funds(Suspense Balance + Down Payment) in Remedy(0 + 0) <= Balance(Suspense Balance + MISC Balance) in LSAMS(0 + 0)',
  },
];

const modBookingResponse = [
  {
    corporateAdvanceBalanceCheck: 'true',
    text: 'There are no corporate advances in Remedy',
  },
  {
    borrowerFundCheck: 'false',
    text: 'Borrower Funds(Suspense Balance + Down Payment) in Remedy(0 + 0) <= Balance(Suspense Balance + MISC Balance) in LSAMS(0 + 0)',
  }];


const radioButtonChecklist = [{
  id: '5f16e27c0b35fd975ae8937a',
  isVisible: true,
  options: [{ displayName: 'Yes', value: 'Yes' }, { displayName: 'No', value: 'No' }],
  taskCode: 'ALL_INC_INC_CHK2A',
  title: 'Is the expected incentive amount correct?',
  type: 'radio',
  value: 'Yes',
  source: '',
  additionalInfo: {},
}];

const dropdownChecklist = [{
  id: '5eec5b0c4291ef769c2c4af3',
  disabled: false,
  isVisible: true,
  options: [],
  taskCode: 'DOCSIN_INGR_CHK7',
  title: 'Select the assignee ',
  type: 'dropdown',
  source: 'adgroup',
  additionalInfo: { group: 'docsin' },
  showPushData: false,
  state: 'in-progress',
},
{
  id: '6eec5b0c4291ef232c2c4af',
  disabled: false,
  isVisible: true,
  options: { hint: '' },
  taskCode: 'DOCSIN_INGR_CHK9',
  title: 'Select the assignee ',
  type: 'dropdown',
  source: 'adgroup',
  additionalInfo: { group: 'docsin' },
  showPushData: false,
  state: 'in-progress',
}, {
  id: '6eec5b0c4291ef232c2c4af',
  disabled: false,
  isVisible: true,
  options: { hint: 'Please choose from the drop down' },
  taskCode: 'DOCSIN_INGR_CHK9',
  title: 'Select the assignee ',
  type: 'dropdown',
  source: 'adgroup',
  additionalInfo: { group: 'docsin' },
  showPushData: false,
  state: 'in-progress',
}];

module.exports = {
  datePickerChecklistItems,
  numberAndReadOnlyText,
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
  checkBox,
  modBookingResponse,
  allRulesPassed,
  checkBoxWithOldValues,
  checkBoxWithMultipleValues,
  checklistWithoutHint,
  unknownChecklistType,
  radioButtonChecklist,
  dropdownChecklist,
  allRulesFailed,
};
