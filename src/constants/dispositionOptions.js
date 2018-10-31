const dispositionOptions = [
  {
    additionalInfo: 'Please verify that the EvalStatus and SubStatus are in Missing Documents.',
    key: 'missingDocuments',
    value: 'Missing Documents',
  },
  {
    additionalInfo: 'Please ensure ResolutionSubstatus is Transcript Ordered.',
    key: 'taxTranscriptOrdered',
    value: 'Tax Transcript Ordered',
  },
  {
    additionalInfo: 'Please ensure that the case Substatus is in Transcript Ordered.',
    key: 'taxTranscriptPending',
    value: 'Tax Transcript Pending',
  },
  {
    additionalInfo: 'Please ensure ResolutionSubstatus is Referral.',
    key: 'suspiciousActivityReview',
    value: 'Suspicious Activity Review',
  },
  {
    additionalInfo: 'Please ensure that the case Substatus is in Referral.',
    key: 'suspiciousActivityReviewPending',
    value: 'Suspicious Activity Review Pending',
  },
  {
    additionalInfo: 'Please ensure that the Unemployment Program is in a Closed status and eval has been Approved.',
    key: 'unemploymentApproval',
    value: 'Unemployment Approval',
  },
  {
    additionalInfo: 'Please ensure all cases are in a Rejected status and eval Substatus is in Sent for Reject.',
    key: 'reject',
    value: 'Reject',
  },
  {
    additionalInfo: 'Please ensure ResolutionSubstatus is Referral or Referral KB.',
    key: 'wait',
    value: 'Wait',
  },
  {
    additionalInfo: 'Please ensure ResolutionSubstatus is Income Calculated.',
    key: 'allTasksCompleted',
    value: 'All Tasks Completed',
  },
];

export default dispositionOptions;
