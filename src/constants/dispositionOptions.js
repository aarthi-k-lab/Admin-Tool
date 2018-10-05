const dispositionOptions = [
  {
    additionalInfo: 'Please verify that the evalStatus and subStatus are in Missing Documents',
    key: 'missingDocuments',
    value: 'Missing Documents',
  },
  {
    additionalInfo: '',
    key: 'taxTranscriptOrdered',
    value: 'Tax Transcipt Ordered',
  },
  {
    additionalInfo: 'Please ensure that the case substatus is in Transcript Ordered',
    key: 'taxTranscriptPending',
    value: 'Tax Transcipt Pending',
  },
  {
    additionalInfo: '',
    key: 'suspiciousActivityReview',
    value: 'Suspicious Activity Review',
  },
  {
    additionalInfo: 'Please ensure that the case substatus is in Referral.',
    key: 'suspiciousActivityReviewPending',
    value: 'Suspicious Activity Review Pending',
  },
  {
    additionalInfo: 'Please ensure that the Unemployment Program is in a Closed status and eval has been Approved.',
    key: 'unemploymentApproval',
    value: 'Unemployment Approval',
  },
  {
    additionalInfo: 'Please ensure all cases are in a Rejected status and eval substatus is in Sent for Reject.',
    key: 'reject',
    value: 'Reject',
  },
  {
    additionalInfo: '',
    key: 'wait',
    value: 'Wait',
  },
  {
    additionalInfo: '',
    key: 'allTasksCompleted',
    value: 'All Tasks Completed',
  },
];

export default dispositionOptions;
