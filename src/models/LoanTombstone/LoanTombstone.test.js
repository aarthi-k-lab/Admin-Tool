import LoanTombstone from '.';

const inputJson1 = {
  loanNumber: '596401265',
  brandName: 'NSM',
  investorLoanNumber: '0000000',
  upbAmount: 162910.83,
  nextPaymentDueDate: '2018-09-01T00:00:00.000Z',
  investorInformation: {
    investorCode: '135',
    investorName: 'HELT 2007-FRE1',
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
  LoanExtensionTable: {
    fldd: 'Tue Nov 28 2006 00:00:00 GMT+0000 (UTC)',
  },
  LossmitModPline: [
    {
      lastDocRcvdDttm: null,
      isStateRvw: null,
    },
    {
      lastDocRcvdDttm: 'Wed Jul 18 2018 14:45:36 GMT+0000 (UTC)',
      isStateRvw: null,
    },
    {
      lastDocRcvdDttm: 'Tue Dec 04 2018 14:27:18 GMT+0000 (UTC)',
      isStateRvw: null,
    },
    {
      lastDocRcvdDttm: null,
      isStateRvw: null,
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

const inputJson12 = {
  evalId: 646515,
  waterfallId: null,
  resolutionChoiceType: 'HAMP-PRA Alternate Waterfall',
};

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
    content: '135 - HELT 2007-FRE1',
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
    content: '09/01/2018',
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
    content: '11/28/2006',
    title: 'FLDD Date',
  },
  {
    content: 'NA',
    title: 'Lien Position',
  },
  {
    content: '12/04/2018',
    title: 'Days Until CFPB Timeline Expiration',
  },
];

const inputJson2 = {
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
  LoanExtensionTable: {
    fldd: null,
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
    },
    {
      lastDocRcvdDttm: null,
      isStateRvw: null,
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
    it('returns the data complying to Tombstone UI schema', () => {
      expect(LoanTombstone.getTombstoneItems(inputJson1, inputJson12)).toEqual(output1);
      expect(LoanTombstone.getTombstoneItems(inputJson2, inputJson12)).toEqual(output2);
    });
  });
});
