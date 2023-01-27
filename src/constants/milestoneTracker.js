const trackerData = [
  {
    milestoneName: 'Processing',
  },
  {
    milestoneName: 'Frontend Underwriting',
  },
  {
    milestoneName: 'Backend Stager',
  },
  {
    milestoneName: 'Underwriting',
  },
  {
    milestoneName: 'Trial Period',
  },
  {
    milestoneName: 'Doc Gen Stager',
  },
  {
    milestoneName: 'Doc Gen',
  },
  {
    milestoneName: 'Document Sent',
  },
  {
    milestoneName: 'Document Received',
  },
  {
    milestoneName: 'Pending Booking',
  },
  {
    milestoneName: 'Post Mod',
  },
];

const milestoneTitleMap = {
  'Processing Review': 'Processing',
  'Income Calculation Review': 'Frontend Underwriting',
  'BackEnd Stager': 'Backend Stager',
  'Underwriting Review': 'Underwriting',
  'Trial Period': 'Trial Period',
  'Document Generation Stager': 'Doc Gen Stager',
  'Document Generation': 'Doc Gen',
  'Document Sent to Homeowner': 'Document Sent',
  'Document Received': 'Document Received',
  'Pending Booking': 'Pending Booking',
  'Post Mod': 'Post Mod',
  'Second Look': 'Second Look',
};

module.exports = { trackerData, milestoneTitleMap };
