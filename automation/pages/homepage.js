module.exports = {
  elements: {
    cmodLogo: '[alt="logo"]',
    header: '[class*="components-AppHeader-Header__name"]',
    search: '[class*="components-AppHeader-Header__search"]',
    profile: '[alt="profile"]',
    agentPage: '[href="/loan-evaluation"]',
    getNext: '[class*="GetNext"]',
    profileName: {
      selector: '//p[text()="Name: "]/following-sibling::p',
      locateStrategy: 'xpath',
    },
    profileEmail: {
      selector: '//p[text()="Email: "]/following-sibling::p',
      locateStrategy: 'xpath',
    },
    profileGroups: {
      selector: '[class*="Profile-Profile__group-list"] [class*="jss"]',
      locateStrategy: 'xpath',
    },
    agentHomePageText: {
      selector: '//span[text()="We have something more to show here...still baking!!!"]',
      locateStrategy: 'xpath',
    },
    endshiftdisbaled: {
      selector: '//button[@disabled and contains(@class,"EndShift")]',
      locateStrategy: 'xpath',
    },
    getnextdisabled: {
      selector: '//button[@disabled and contains(@class,"GetNext")]',
      locateStrategy: 'xpath',
    },
    loanNbr: {
      selector: '//span[text()="Loan #"]',
      locateStrategy: 'xpath',
    },
    evalId: {
      selector: '//span[text()="EvalId"]',
      locateStrategy: 'xpath',
    },
    investorloan: {
      selector: '//span[text()="Investor Loan #"]/following-sibling::span',
      locateStrategy: 'xpath',
    },
    brandname: {
      selector: '//span[text()="Brand Name"]/following-sibling::span',
      locateStrategy: 'xpath',
    },
    borrowercoborrower: {
      selector: '//span[text()="Borrower/Co-Borrower"]/following-sibling::span',
      locateStrategy: 'xpath',
    },
    investor: {
      selector: '//span[text()="Investor"]/following-sibling::span',
      locateStrategy: 'xpath',
    },
    upb: {
      selector: '//span[text()="UPB"]/following-sibling::span',
      locateStrategy: 'xpath',
    },
    nextpaymentduedate: {
      selector: '//span[text()="Next Payment Due Date"]/following-sibling::span',
      locateStrategy: 'xpath',
    },
    missingDocumentDisp: {
      selector: '//span[text()="Missing Documents"]',
      locateStrategy: 'xpath',
    },
    taxTranscriptOrderedDisp: {
      selector: '//span[text()="Tax Transcript Ordered"]',
      locateStrategy: 'xpath',
    },
    taxTranscriptPendingDisp: {
      selector: '//span[text()="Tax Transcript Pending"]',
      locateStrategy: 'xpath',
    },
    suspiciousActivityReviewDisp: {
      selector: '//span[text()="Suspicious Activity Review"]',
      locateStrategy: 'xpath',
    },
    suspiciousActivityReviewPendingDisp: {
      selector: '//span[text()="Suspicious Activity Review Pending"]',
      locateStrategy: 'xpath',
    },
    unemploymentApprovalDisp: {
      selector: '//span[text()="Unemployment Approval"]',
      locateStrategy: 'xpath',
    },
    rejectDisp: {
      selector: '//span[text()="Reject"]',
      locateStrategy: 'xpath',
    },
    waitDisp: {
      selector: '//span[text()="Wait"]',
      locateStrategy: 'xpath',
    },
    allTasksCompletedDisp: {
      selector: '//span[text()="All Tasks Completed"]',
      locateStrategy: 'xpath',
    },
    saveDisp: {
      selector: '//span[text()="Save"]',
      locateStrategy: 'xpath',
    },
    missingDocsErrorMessage: {
      selector: '//span[text()="\'EvalSubStatus\' should be \'Missing Docs\'"]',
      locateStrategy: 'xpath',
    },
    missingDocsErrorMessage2: {
      selector: '//span[text()="\'ResolutionSubstatus\' should be \'Missing Docs\'"]',
      locateStrategy: 'xpath',
    },
    retryDisp: {
      selector: '//span[text()="Retry"]',
      locateStrategy: 'xpath',
    },
  },
};
