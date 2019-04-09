const status = [
  {
    id: 'nsianiasfno3',
    name: 'FILE INCOMPLETE',
    activities: [
      { id: 'jasjfoisadsoij', activityName: 'Send To Front End Underwriting', verbiage: 'If income calculation is incomplete please ensure the most recent resolution case substatus is in "Referral or Referral KB" and the Resolution Status is Open.' },
      { id: 'ajsoidjasoajejc', activityName: 'Missing Documents', verbiage: 'When documents are still needed for the account please update the Remedy checklist and ensure the Eval and most recent Resolution Case substatus changes to "Missing Docs"' },
    ],
    labelDisplay: 'none',
    expanded: false,
  },
  {
    id: 'nsianiawedwesfno3',
    name: 'DECISION',
    activities: [
      { id: 'ajsoidwenewdendjasoajejc', activityName: 'Send For QC Review', verbiage: 'If the review results in a potential approval, then select this option to handoff for final QC and approval review. Ensure the status of Remedy is in either a Sent for Approval resolution status with an Active Eval. Please note for Loan Modification and Forgiveness Modification the resolution cases should be in a Locked Resolution Status and for Government Trial the Resolution Status should be Closed.' },
      { id: 'jasjfoisawdeddsoij', activityName: 'Approval', verbiage: 'If the modification is approved then ensure the Eval Status is Approved and the resolution status is Closed. Please note for a Loan Modification and Forgiveness Modification case(s) ensure the resolution status is in Sent for Approval.' },
      { id: 'ajsoidwedjasoajejc', activityName: 'Reject', verbiage: 'The Eval status should be "Rejected" and the Eval Substatus should be "Sent for Reject". The most recent Resolution Case should be in a "Rejected" Status.' },
    ],
    labelDisplay: 'none',
    expanded: false,
  },
  {
    id: 'nsdnewjdnianiasfno3',
    name: 'ACTION REQUIRED',
    activities: [
      { id: 'jasjfoisdiwdadsoij', activityName: 'Freddie RPA Required', verbiage: 'Select this option if the account requires the Workout Prospector (WPII) to be modelled. The resolution status should be Locked.' },
      {
        id: 'ajsoidjasjdwidjoajejc',
        activityName: 'Non-Delegated Review Required',
        verbiage: 'Choose this option if you submitted the file for a non-delegated review and requires a response from the investor. The resolution status should be either open or locked and the substatus should be "Nondelegated Pending".',
      },
      {
        id: 'ajsosdfidjasjdwidjoajejc',
        activityName: 'Successor In Interest Review',
        verbiage: 'If a successor of interest is required and still pending confirmation then choose this option to follow up after 4 business days.',
      },
      {
        id: 'ajsoidjasjdwdfsidjoajejc',
        activityName: 'Suspicious Activity Review',
        verbiage: 'If you notice suspicious activity on the documents provided, after you submit the loan for review then select this option to follow up after 3 business days.',
      },
      { id: 'ajsoidjasjf49837sidjoajejc', activityName: 'Wait', verbiage: 'If you are unable to move forward with your review do to unforeseen circumstance and you have your manager\'s permission then select this option to follow up after 24 hours.' },
      { id: 'l9329uidjasjdwdfsidjoajejc', activityName: 'Litigation Wait', verbiage: 'If you are a litigation specialist and the file is in litigation pending final resolution, then select this option to follow up after 4 business days. The resolution status should be open and the substatus should be Litigation Handling.' },
      { id: 'ajsoidk92349837sidjoajejc', activityName: 'Ticket Submitted', verbiage: 'If a ticket is needed to be submitted then choose this option to follow up after 24 hours.' },
    ],
    labelDisplay: 'none',
    expanded: false,
  },
  {
    id: 'nsianiasfno38e8328',
    name: 'HANDOFF',
    activities: [
      { id: 'jasjfoisadsoisdfj', activityName: 'Offshore Review Required', verbiage: 'Select this option if you are an onshore agent requesting for offshore to review. Please ensure the Eval is Active and the most recent Resolution case is open and the resolution substatus is not in "Referral", "Referral KB" or "Tax Transcript Ordered".' },
      {
        id: 'ajsdsfsa23oidjasoajejc',
        activityName: 'Offshore Team Lead Review Required',
        verbiage: 'Select this option if you are an offshore agent and need assistance from your Team Lead to complete the task.',
      },
      {
        id: 'aj837489asjdwdfsidjoajejc',
        activityName: 'Onshore Review Required',
        verbiage: 'Select this option if you are an offshore team lead and need an onshore review for further assistance.',
      },
      {
        id: 'ajojw489asjdwdfsidjoajejc',
        activityName: 'Onshore Team Lead Review Required',
        verbiage: 'Select this option if you have a team lead onshore that will assist with certain activities.',
      },
      {
        id: 'aj837489asjdniwedjoajejc',
        activityName: 'Manager Review Required',
        verbiage: 'Select this option if you are an onshore agent and need your manager\'s help to review a file.',
      },
      {
        id: 'aj837ndwisjdwdfsidjoajejc',
        activityName: 'Manager Lock Required',
        verbiage: 'Select this option if a manager lock is required.',
      },
      {
        id: 'aj837489asjdwcyuwevdjoajejc',
        activityName: 'Litigation',
        verbiage: 'Select this option if the loan requires the litigation team to review the file. The resolution status should be open and the substatus should be Litigation Handling',
      },
      {
        id: '489asjdwdfsidjoajejcaj837',
        activityName: 'Sent for Reject',
        verbiage: 'The Eval status should be Active and the Eval Substatus should be "Sent for Reject". The most recent Resolution Case should be in a "Rejected" Status.',
      },
      {
        id: 'jdwdfsidjoajejcaj837489as',
        activityName: 'Send to Underwriting',
        verbiage: 'Select this option if you are an agent reviewing "Sent for Reject" loans and want to hand back to the underwriter to re-review. Ensure you provide comments and that the Eval status is "Active", the Eval substatus is in "Referral" or "Referral KB" and the Resolution case is in \'open\' and the resolution substatus is in "Escrow KB.',
      },
    ],
    labelDisplay: 'none',
    expanded: false,
  },
];

export default function getStatus() {
  return status;
}
