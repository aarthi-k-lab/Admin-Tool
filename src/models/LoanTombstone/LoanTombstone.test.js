import LoanTombstone from '.';

const inputJsonLoanDetails1 = {
  loanNumber: '596401265',
  brandName: 'NSM',
  investorLoanNumber: '0000000',
  upbAmount: 162910.83,
  nextPaymentDueDate: '2018-09-01T00:00:00.000Z',
  investorInformation: {
    investorCode: '135',
    investorName: 'HELT 2007-FRE1',
  },
  InvestorHierarchy: {
    levelNumber: 3,
    levelName: 'Special',
  },
  successorInInterest: [],
  loanTypeDescription: 'Conv/Unins',
  LoanMilestoneDates: [
    {
      mlstnTypeNm: 'BalloonDate',
      mlstnDttm: 'Mon Dec 01 2036 00:00:00 GMT+0000 (UTC)',
    },
    {
      mlstnTypeNm: 'LoanClosingDate',
      mlstnDttm: 'Tue Nov 28 2006 00:00:00 GMT+0000 (UTC)',
    },
    {
      mlstnTypeNm: 'LoanFundedDate',
      mlstnDttm: 'Mon Mar 05 2007 00:00:00 GMT+0000 (UTC)',
    },
    {
      mlstnTypeNm: 'ServiceTransferInDate',
      mlstnDttm: 'Fri Jul 06 2007 00:00:00 GMT+0000 (UTC)',
    },
  ],
  LoanExtension: {
    firstLegalDueDate: 'Tue Nov 28 2006 00:00:00 GMT+0000 (UTC)',
  },
  LossmitModPline: [
    {
      lastDocRcvdDttm: 'Tue Dec 04 2018 14:27:18 GMT+0000 (UTC)',
      isStateRvw: null,
      evalId: 646515,
    },
    {
      lastDocRcvdDttm: null,
      isStateRvw: null,
      evalId: 1702968,
    },
    {
      lastDocRcvdDttm: 'Wed Jul 18 2018 14:45:36 GMT+0000 (UTC)',
      isStateRvw: null,
      evalId: 1869959,
    },
    {
      lastDocRcvdDttm: 'Tue Dec 04 2018 14:27:18 GMT+0000 (UTC)',
      isStateRvw: null,
      evalId: 1920135,
    },
  ],
  primaryBorrower: {
    firstName: 'ELLEN',
    lastName: 'DOE',
    borrowerType: 'Borrower',
    ssn: 'xx-xxx-5421',
  },
  coBorrowers: [
    {
      firstName: 'LEOCADIA',
      lastName: 'DOE',
      borrowerType: 'Co-Borrower',
      ssn: 'xx-xxx-5422',
    },
    {
      firstName: 'JON',
      lastName: 'SNOW',
      borrowerType: 'Co-Borrower',
      ssn: 'xx-xxx-5423',
    },
  ],
  successorInInterestStatus: 'Pending',
  foreclosureSalesDate: 'Tue Dec 04 2018 14:27:18 GMT+0000 (UTC)',
};

const inputJsonEvalDetails = {
  evalId: 646515,
  waterfallId: null,
  resolutionChoiceType: 'HAMP-PRA Alternate Waterfall',
  lastDocumentReceivedDate: null,
};

const inputJsonPreviousDisposition = [
  {
    processId: '213453',
    evalId: '1928799',
    taskId: '1718961',
    stsChangedCode: 'Freddie RPA Required',
    status: 'Replied',
    date: 1551166757000,
    taskName: 'Underwriting',
  },
];

const inputJsonPrioritization = [

  {
    processId: '213575',
    loanNumber: '345432',
    evalId: '1928799',
    taskId: '1721050',
    taskName: 'Underwriting',
    stsChangedCode: 'Wait',
    status: 'Replied',
    assignee: 'ashish.menon@mrcooper.com',
    statusDate: 1551425501000,
    incomeRequried: true,
    latestHandOffDisposition: 'Offshore Review Required',
  },
];

const output1 = [
  {
    content: '596401265',
    title: 'Loan #',
  },
  {
    content: '646515',
    title: 'Eval Id',
  },
  {
    content: 'Freddie RPA Required',
    title: 'Previous Disposition',
  },
  {
    content: 'Offshore Review Required',
    title: 'Latest Handoff Disposition',
  },
  {
    content: '0000000',
    title: 'Investor Loan #',
  },
  {
    content: 'ELLEN DOE/LEOCADIA DOE, JON SNOW',
    title: 'Borrower/Co-Borrower',
  },
  {
    content: 'xx-xxx-5421/xx-xxx-5422, xx-xxx-5423',
    title: 'Borrower SSN/Co-Borrower SSN',
  },
  {
    content: 'Pending',
    title: 'Successor in Interest Status',
  },
  {
    content: 'NSM',
    title: 'Brand Name',
  },
  {
    content: '135 - HELT 2007-FRE1 - Special',
    title: 'Investor',
  },
  {
    content: 'Conv/Unins',
    title: 'Loan Type Description',
  },
  {
    content: '$162,910.83',
    title: 'UPB',
  },
  {
    content: '08/31/2018',
    title: 'Next Payment Due Date',
  },
  {
    content: 'NA',
    title: 'Waterfall Name',
  },
  {
    content: 'HAMP-PRA Alternate Waterfall',
    title: 'Modification Type',
  },
  {
    content: '12/04/2018',
    title: 'Foreclosure Sale Date and Status',
  },
  {
    content: '11/27/2006',
    title: 'FLDD Date',
  },
  {
    content: 'NA',
    title: 'Lien Position',
  },
  {
    content: 'NA',
    title: 'CFPB Timeline Expiration Date',
  },
  {
    content: 'NA',
    title: 'Days Until CFPB Timeline Expiration',
  },
];

const inputJsonLoanDetails2 = {
  loanNumber: '596401265',
  investorLoanNumber: null,
  upbAmount: Number.NaN,
  nextPaymentDueDate: '',
  investorInformation: {
    investorCode: '135',
  },
  primaryBorrower: {},
  coBorrowers: [
  ],
  LoanExtension: {
    firstLegalDueDate: null,
  },
  successorInInterest: [],
  foreclosureSalesDate: null,
  loanTypeDescription: null,
  LoanMilestoneDates: [
    {
      mlstnTypeNm: 'BalloonDate',
      mlstnDttm: 'Mon Dec 01 2036 00:00:00 GMT+0000 (UTC)',
    },
  ],
  LossmitModPline: [
    {
      lastDocRcvdDttm: null,
      isStateRvw: null,
      evalId: null,
    },
    {
      lastDocRcvdDttm: null,
      isStateRvw: null,
      evalId: null,

    },
  ],
};

const output2 = [
  {
    content: '596401265',
    title: 'Loan #',
  },
  {
    content: '646515',
    title: 'Eval Id',
  },
  {
    content: 'Freddie RPA Required',
    title: 'Previous Disposition',
  },
  {
    content: 'Offshore Review Required',
    title: 'Latest Handoff Disposition',
  },
  {
    content: 'NA',
    title: 'Investor Loan #',
  },
  {
    content: 'NA/NA',
    title: 'Borrower/Co-Borrower',
  },
  {
    content: 'NA/NA',
    title: 'Borrower SSN/Co-Borrower SSN',
  },
  {
    content: 'NA',
    title: 'Successor in Interest Status',
  },
  {
    content: 'NA',
    title: 'Brand Name',
  },
  {
    content: 'NA',
    title: 'Investor',
  },
  {
    content: 'NA',
    title: 'Loan Type Description',
  },
  {
    content: 'NA',
    title: 'UPB',
  },
  {
    content: 'NA',
    title: 'Next Payment Due Date',
  },
  {
    content: 'NA',
    title: 'Waterfall Name',
  },
  {
    content: 'HAMP-PRA Alternate Waterfall',
    title: 'Modification Type',
  },
  {
    content: 'NA',
    title: 'Foreclosure Sale Date and Status',
  },
  {
    content: 'NA',
    title: 'FLDD Date',
  },
  {
    content: 'NA',
    title: 'Lien Position',
  },
  {
    content: 'NA',
    title: 'CFPB Timeline Expiration Date',
  },
  {
    content: 'NA',
    title: 'Days Until CFPB Timeline Expiration',
  },
];

describe('models/LoanTombstone', () => {
  describe('getUrl', () => {
    it('returns the URL', () => {
      expect(LoanTombstone.getUrl(596401265)).toBe('/api/ods-gateway/loans/596401265');
    });
  });
  describe('getTombstoneItems', () => {
    // #TODO the current date is used in the test and diff is calculated --> Changed to null and NA
    //       The diff would change every day and tests would keep on failing.
    it('returns the data complying to Tombstone UI schema', () => {
      expect(LoanTombstone.getTombstoneItems(inputJsonLoanDetails2, inputJsonEvalDetails, inputJsonPreviousDisposition, inputJsonPrioritization)).toEqual(output2);
      expect(LoanTombstone.getTombstoneItems(inputJsonLoanDetails1, inputJsonEvalDetails, inputJsonPreviousDisposition, inputJsonPrioritization)).toEqual(output1);
    });
  });
});
