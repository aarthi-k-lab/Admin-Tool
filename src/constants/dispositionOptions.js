const dispositionOptions = [
  {
    additionalInfo: 'Please verify that the evalStatus and subStatus are in Missing Documents.',
    key: 'missingDocuments',
    value: 'Missing Documents',
  },
  {
    additionalInfo: 'Please ensure resolutionSubstatus is Transcript Ordered.',
    key: 'taxTranscriptOrdered',
    value: 'Tax Transcript Ordered',
  },
  {
    additionalInfo: 'Please ensure that the case substatus is in Transcript Ordered.',
    key: 'taxTranscriptPending',
    value: 'Tax Transcript Pending',
  },
  {
    additionalInfo: 'Please ensure resolutionSubstatus is Referral.',
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
    additionalInfo: 'Please ensure resolutionSubstatus is Referral or Referral KB.',
    key: 'wait',
    value: 'Wait',
  },
  {
    additionalInfo: 'Please ensure resolutionSubstatus is Income Calculated.',
    key: 'allTasksCompleted',
    value: 'All Tasks Completed',
  },
];

export default dispositionOptions;
