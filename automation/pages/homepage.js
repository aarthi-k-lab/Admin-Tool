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
    loanNbr: {
      selector: '//span[text()="Loan #"]',
      locateStrategy: 'xpath',
    },
    evalId: {
      selector: '//span[text()="EvalId"]',
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
