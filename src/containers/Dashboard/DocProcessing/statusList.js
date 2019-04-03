const status = [
  {
    id: 'nsdnewjdnianiasfno3',
    name: 'ACTION REQUIRED',
    activities: [
      { id: 'ajsoidjasjf49837sidjoajejc', activityName: 'Wait', verbiage: 'If you are unable to move forward with your review due to an unforeseen circumstance and you have your manager\'s permission then select this option to follow up after 24 hours.' },
      { id: 'l9329uidjasjdwdfsidjoajejc', activityName: 'Litigation Wait', verbiage: 'If you are a litigation specialist and the file is in litigation pending final resolution, then select this option to follow up after 4 business days. The resolution status should be open and the substatus should be Litigation Handling.' },
      { id: 'uidjasjdwdfsidjoajejcl9329', activityName: 'Suspicious Activity Review', verbiage: 'If you notice suspicious activity on the documents provided, after you submit the loan for review then select this option to follow up after 3 business days.' },
      { id: 'jdwdfsidjoajejcl9329uidjas', activityName: 'Ticket Submitted', verbiage: 'If a ticket is needed to be submitted then choose this option to follow up after 24 hours.' },
    ],
    labelDisplay: 'none',
    expanded: false,
  },
  {
    id: 'nsianiasfno38e8328',
    name: 'HANDOFF',
    activities: [
      { id: 'jasjfoisadsoisdfj', activityName: 'Offshore Review Required', verbiage: 'Select this option if you are an onshore agent requesting for offshore to review. Please ensure the Eval is Active and the most recent Resolution case is open and the resolution substatus is in "Referral" or  "Referral KB".' },
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
        id: 'aj837489asjdwcyuwevdjoajejc',
        activityName: 'Litigation Review Needed',
        verbiage: 'Select this option if the loan requires the litigation team to review the file. The resolution status should be open and the substatus should be Litigation Handling.',
      },
    ],
    labelDisplay: 'none',
    expanded: false,
  },
  {
    id: 'nsdnewiasfno3jdnian',
    name: 'DECISION',
    activities: [
      { id: '49837sidjoajejcajsoidjasjf', activityName: 'Missing Documents', verbiage: 'When documents are still needed for the account please update the Remedy checklist and ensure the Eval and most recent Resolution Case substatus changes to "Missing Docs"' },
      { id: 'asjdwdfsidjoajejcl9329uidj', activityName: 'Referral', verbiage: 'If a complete package is received and there are no documents missing, then ensure the Eval and Resolution Substatus is in Referral.' },
      { id: 'fsidjoajejcl9329uidjasjdwd', activityName: 'Reject', verbiage: 'The Eval status should be Active and the Eval Substatus should be "Sent for Reject". The most recent Resolution Case should be in a "Rejected" Status.' },
    ],
    labelDisplay: 'none',
    expanded: false,
  },
];

export default function getStatus() {
  return status;
}
