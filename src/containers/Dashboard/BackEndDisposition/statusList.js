const status = [
  {
    id: 'beuw_file_incomplete',
    name: 'FILE INCOMPLETE',
    activities: [
      { id: 'beuw_send_to_front_end_underwritting', activityName: 'Send To Front End Underwriting', verbiage: 'If income calculation is incomplete please ensure the most recent resolution case substatus is in "Referral or Referral KB" and the Resolution Status is Open.' },
      { id: 'missing_document', activityName: 'Missing Documents', verbiage: 'When documents are still needed for the account please update the Remedy checklist and ensure the Eval and most recent Resolution Case substatus changes to "Missing Docs"' },
    ],
    labelDisplay: 'none',
    expanded: false,
  },
  {
    id: 'beuw_decision',
    name: 'DECISION',
    activities: [
      { id: 'beuw_send_for_qc_review', activityName: 'Send For QC Review', verbiage: 'If the review results in a potential approval, then select this option to handoff for final QC and approval review. Ensure the status of Remedy is in either a Sent for Approval resolution status with an Active Eval. Please note for Loan Modification and Forgiveness Modification the resolution cases should be in a Locked Resolution Status and for Government Trial the Resolution Status should be Closed.' },
      { id: 'beuw_approval', activityName: 'Approval', verbiage: 'If the modification is approved then ensure the Eval Status is Approved and the resolution status is Closed. Please note for a Loan Modification and Forgiveness Modification case(s) ensure the resolution status is in Sent for Approval.' },
      { id: 'beuw_reject', activityName: 'Reject', verbiage: 'The Eval status should be "Rejected" and the Eval Substatus should be "Sent for Reject". The most recent Resolution Case should be in a "Rejected" Status.' },
    ],
    labelDisplay: 'none',
    expanded: false,
  },
  {
    id: 'beuw_action_required',
    name: 'ACTION REQUIRED',
    activities: [
      { id: 'beuw_freddie_rpa_required', activityName: 'Freddie RPA Required', verbiage: 'Select this option if the account requires the Workout Prospector (WPII) to be modelled. The resolution status should be Locked.' },
      {
        id: 'beuw_nondelegate_review_required',
        activityName: 'Non-Delegated Review Required',
        verbiage: 'Choose this option if you submitted the file for a non-delegated review and requires a response from the investor. The resolution status should be either open or locked and the substatus should be "Nondelegated Pending".',
      },
      {
        id: 'beuw_successor_in_interest_review',
        activityName: 'Successor In Interest Review',
        verbiage: 'If a successor of interest is required and still pending confirmation then choose this option to follow up after 4 business days.',
      },
      {
        id: 'beuw_suspicious_activity_review',
        activityName: 'Suspicious Activity Review',
        verbiage: 'If you notice suspicious activity on the documents provided, after you submit the loan for review then select this option to follow up after 3 business days.',
      },
      { id: 'beuw_wait', activityName: 'Wait', verbiage: 'If you are unable to move forward with your review do to unforeseen circumstance and you have your manager\'s permission then select this option to follow up after 24 hours.' },
      { id: 'beuw_litigation_wait', activityName: 'Litigation Wait', verbiage: 'If you are a litigation specialist and the file is in litigation pending final resolution, then select this option to follow up after 4 business days. The resolution status should be open and the substatus should be Litigation Handling.' },
      { id: 'beuw_ticket_submitted', activityName: 'Ticket Submitted', verbiage: 'If a ticket is needed to be submitted then choose this option to follow up after 24 hours.' },
    ],
    labelDisplay: 'none',
    expanded: false,
  },
  {
    id: 'beuw_handoff',
    name: 'HANDOFF',
    activities: [
      { id: 'beuw_offshore_review_required', activityName: 'Offshore Review Required', verbiage: 'Select this option if you are an onshore agent requesting for offshore to review. Please ensure the Eval is Active and the most recent Resolution case is open and the resolution substatus is not in "Referral", "Referral KB" or "Tax Transcript Ordered".' },
      {
        id: 'beuw_offshore_team_lead_review_required',
        activityName: 'Offshore Team Lead Review Required',
        verbiage: 'Select this option if you are an offshore agent and need assistance from your Team Lead to complete the task.',
      },
      {
        id: 'beuw_onshore_review_required',
        activityName: 'Onshore Review Required',
        verbiage: 'Select this option if you are an offshore team lead and need an onshore review for further assistance.',
      },
      {
        id: 'beuw_onshore_team_lead_review_required',
        activityName: 'Onshore Team Lead Review Required',
        verbiage: 'Select this option if you have a team lead onshore that will assist with certain activities.',
      },
      {
        id: 'beuw_manager_review_required',
        activityName: 'Manager Review Required',
        verbiage: 'Select this option if you are an onshore agent and need your manager\'s help to review a file.',
      },
      {
        id: 'beuw_manager_lock_required',
        activityName: 'Manager Lock Required',
        verbiage: 'Select this option if a manager lock is required.',
      },
      {
        id: 'beuw_litigation',
        activityName: 'Litigation',
        verbiage: 'Select this option if the loan requires the litigation team to review the file. The resolution status should be open and the substatus should be Litigation Handling',
      },
      {
        id: 'beuw_sent_for_reject',
        activityName: 'Sent for Reject',
        verbiage: 'The Eval status should be Active and the Eval Substatus should be "Sent for Reject". The most recent Resolution Case should be in a "Rejected" Status.',
      },
      {
        id: 'beuw_sent_to_underwriting',
        activityName: 'Send to Underwriting',
        verbiage: 'Select this option if you are an agent reviewing "Sent for Reject" loans and want to hand back to the underwriter to re-review. Ensure you provide comments and that the Eval status is "Active", the Eval substatus is in "Referral" or "Referral KB" and the Resolution case is in "open" and the resolution substatus is in "Escrow KB".',
      },
    ],
    labelDisplay: 'none',
    expanded: false,
  },
  {
    id: 'beuw_second_look_handoff',
    name: 'SECOND LOOK HANDOFF',
    activities: [
      {
        id: 'beuw_Second_look_offshore_review_required',
        activityName: 'Second Look Offshore Review Required',
        verbiage: 'Select this option if you are an onshore agent requesting for offshore to review. Please ensure the Eval is Active and the most recent Resolution case is open and the resolution substatus is not in "Referral", "Referral KB" or "Tax Transcript Ordered".',
      },
      {
        id: 'beuw_second_look_offshore_team_lead_review_required',
        activityName: 'Second Look Offshore Team Lead Review Required',
        verbiage: 'Select this option if you are an offshore agent and need assistance from your Team Lead to complete the task.',
      },
      {
        id: 'beuw_second_look_onshore_review_required',
        activityName: 'Second Look Onshore Review Required',
        verbiage: 'Select this option if you are an offshore team lead and need an onshore review for further assistance.',
      },
      {
        id: 'beuw_second_look_onshore_team_lead_review_required',
        activityName: 'Second Look Onshore Team Lead Review Required',
        verbiage: 'Select this option if you have a team lead onshore that will assist with certain activities.',
      },
      {
        id: 'beuw_second_look_manager_review_required',
        activityName: 'Second Look Manager Review Required',
        verbiage: 'Select this option if you are an onshore agent and need your manager\'s help to review a file.',
      },
    ],
    labelDisplay: 'none',
    expanded: false,
  },
];

export default function getStatus() {
  return status;
}
