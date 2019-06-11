module.exports = {
  elements: {
    escrowToOrderTitleText: {
      selector: '//div[text()="To Order"]/following-sibling::div[1]//span[text()="ESCROW"]',
      locateStrategy: 'xpath',
    },
    escrowToOrderCount: {
      selector: '//div[text()="To Order"]/following-sibling::div[1]//span[text()="ESCROW"]/../..//span[contains(@class,"document-type-count")]',
      locateStrategy: 'xpath',
    },
    escrowToOrderSLA: {
      selector: '//div[text()="To Order"]/following-sibling::div[1]//span[text()="ESCROW"]/../..//span[contains(text(),"SLA BREACHED")]',
      locateStrategy: 'xpath',
    },
    escrowToOrderSLABreach: {
      selector: '//div[text()="To Order"]/following-sibling::div[1]//span[text()="ESCROW"]/../..//span[contains(text(),"SLA ABOUT TO BREACH")]',
      locateStrategy: 'xpath',
    },

    legalToOrderTitleText: {
      selector: '//div[text()="To Order"]/following-sibling::div[1]//span[text()="LEGAL FEE"]',
      locateStrategy: 'xpath',
    },
    legalToOrderCount: {
      selector: '//div[text()="To Order"]/following-sibling::div[1]//span[text()="LEGAL FEE"]/../..//span[contains(@class,"document-type-count")]',
      locateStrategy: 'xpath',
    },
    legalToOrderSLA: {
      selector: '//div[text()="To Order"]/following-sibling::div[1]//span[text()="LEGAL FEE"]/../..//span[contains(text(),"SLA BREACHED")]',
      locateStrategy: 'xpath',
    },
    legalToOrderSLABreach: {
      selector: '//div[text()="To Order"]/following-sibling::div[1]//span[text()="LEGAL FEE"]/../..//span[contains(text(),"SLA ABOUT TO BREACH")]',
      locateStrategy: 'xpath',
    },

    valueToOrderTitleText: {
      selector: '//div[text()="To Order"]/following-sibling::div[1]//span[text()="VALUE"]',
      locateStrategy: 'xpath',
    },
    valueToOrderCount: {
      selector: '//div[text()="To Order"]/following-sibling::div[1]//span[text()="VALUE"]/../..//span[contains(@class,"document-type-count")]',
      locateStrategy: 'xpath',
    },
    valueToOrderSLA: {
      selector: '//div[text()="To Order"]/following-sibling::div[1]//span[text()="VALUE"]/../..//span[contains(text(),"SLA BREACHED")]',
      locateStrategy: 'xpath',
    },
    valueToOrderSLABreach: {
      selector: '//div[text()="To Order"]/following-sibling::div[1]//span[text()="VALUE"]/../..//span[contains(text(),"SLA ABOUT TO BREACH")]',
      locateStrategy: 'xpath',
    },

    // Ordered

    escrowOrderedTitleText: {
      selector: '//div[text()="Ordered"]/following-sibling::div[1]//span[text()="ESCROW"]',
      locateStrategy: 'xpath',
    },
    escrowOrderedCount: {
      selector: '//div[text()="Ordered"]/following-sibling::div[1]//span[text()="ESCROW"]/../..//span[contains(@class,"document-type-count")]',
      locateStrategy: 'xpath',
    },
    escrowOrderedSLA: {
      selector: '//div[text()="Ordered"]/following-sibling::div[1]//span[text()="ESCROW"]/../..//span[contains(text(),"SLA BREACHED")]',
      locateStrategy: 'xpath',
    },
    escrowOrderedSLABreach: {
      selector: '//div[text()="Ordered"]/following-sibling::div[1]//span[text()="ESCROW"]/../..//span[contains(text(),"SLA ABOUT TO BREACH")]',
      locateStrategy: 'xpath',
    },

    legalOrderedTitleText: {
      selector: '//div[text()="Ordered"]/following-sibling::div[1]//span[text()="LEGAL FEE"]',
      locateStrategy: 'xpath',
    },
    legalOrderedCount: {
      selector: '//div[text()="Ordered"]/following-sibling::div[1]//span[text()="LEGAL FEE"]/../..//span[contains(@class,"document-type-count")]',
      locateStrategy: 'xpath',
    },
    legalOrderedSLA: {
      selector: '//div[text()="Ordered"]/following-sibling::div[1]//span[text()="LEGAL FEE"]/../..//span[contains(text(),"SLA BREACHED")]',
      locateStrategy: 'xpath',
    },
    legalOrderedSLABreach: {
      selector: '//div[text()="Ordered"]/following-sibling::div[1]//span[text()="LEGAL FEE"]/../..//span[contains(text(),"SLA ABOUT TO BREACH")]',
      locateStrategy: 'xpath',
    },

    valueOrderedTitleText: {
      selector: '//div[text()="Ordered"]/following-sibling::div[1]//span[text()="VALUE"]',
      locateStrategy: 'xpath',
    },
    valueOrderedCount: {
      selector: '//div[text()="Ordered"]/following-sibling::div[1]//span[text()="VALUE"]/../..//span[contains(@class,"document-type-count")]',
      locateStrategy: 'xpath',
    },
    valueOrderedSLA: {
      selector: '//div[text()="Ordered"]/following-sibling::div[1]//span[text()="VALUE"]/../..//span[contains(text(),"SLA BREACHED")]',
      locateStrategy: 'xpath',
    },
    valueOrderedSLABreach: {
      selector: '//div[text()="Ordered"]/following-sibling::div[1]//span[text()="VALUE"]/../..//span[contains(text(),"SLA ABOUT TO BREACH")]',
      locateStrategy: 'xpath',
    },

    // Completed

    escrowCompletedTitleText: {
      selector: '//div[text()="Completed"]/following-sibling::div[1]//span[text()="ESCROW"]',
      locateStrategy: 'xpath',
    },
    escrowCompletedCount: {
      selector: '//div[text()="Completed"]/following-sibling::div[1]//span[text()="ESCROW"]/../..//span[contains(@class,"document-type-count")]',
      locateStrategy: 'xpath',
    },

    legalCompletedTitleText: {
      selector: '//div[text()="Completed"]/following-sibling::div[1]//span[text()="LEGAL FEE"]',
      locateStrategy: 'xpath',
    },
    legalCompletedCount: {
      selector: '//div[text()="Completed"]/following-sibling::div[1]//span[text()="LEGAL FEE"]/../..//span[contains(@class,"document-type-count")]',
      locateStrategy: 'xpath',
    },

    valueCompletedTitleText: {
      selector: '//div[text()="Completed"]/following-sibling::div[1]//span[text()="VALUE"]',
      locateStrategy: 'xpath',
    },
    valueCompletedCount: {
      selector: '//div[text()="Completed"]/following-sibling::div[1]//span[text()="VALUE"]/../..//span[contains(@class,"document-type-count")]',
      locateStrategy: 'xpath',
    },

    // DatGrid Columns

    datagridNoDataPresent: {
      selector: '//span[text()="No Loans Present"]',
      locateStrategy: 'xpath',
    },
    datagridHeaderloan: {
      selector: '//div[text()="LOAN NUMBER"]',
      locateStrategy: 'xpath',
    },
    datagridHeadereval: {
      selector: '//div[text()="EVAL ID"]',
      locateStrategy: 'xpath',
    },
    datagridHeaderborrower: {
      selector: '//div[text()="BORROWER"]',
      locateStrategy: 'xpath',
    },
    datagridHeadercoborrower: {
      selector: '//div[text()="CO BORROWER"]',
      locateStrategy: 'xpath',
    },
    datagridHeaderInvestorName: {
      selector: '//div[text()="INVESTOR NAME"]',
      locateStrategy: 'xpath',
    },
    datagridHeaderdescription: {
      selector: '//div[text()="LOANTYPE DESCRIPTION"]',
      locateStrategy: 'xpath',
    },
    datagridHeaderInvestorCode: {
      selector: '//div[text()="INVESTOR CODE"]',
      locateStrategy: 'xpath',
    },
    datagridHeadersla: {
      selector: '//div[text()="DAYS UNTIL SLA"]',
      locateStrategy: 'xpath',
    },
    datagridHeadercfpb: {
      selector: '//div[text()="CFPB DAYS UNTIL SLA"]',
      locateStrategy: 'xpath',
    },
    datagridTitleText: {
      selector: '//span[contains(@class,"containers-StagerDashboard-StagerDetailsTable-StagerDetailsTable__details-table-document-type")]',
      locateStrategy: 'xpath',
    },
    datagridSubTitleText: {
      selector: '//span[contains(@class,"containers-StagerDashboard-StagerDetailsTable-StagerDetailsTable__details-table-document-status")]',
      locateStrategy: 'xpath',
    },
    datagridLoanNumberDropdown: '[class*= "components-CustomReactTable-CustomReactTable__filterDropDown"]',
    datagridCurrentPageNumber: '[type="number"]',
    datagridTotalPageNumber: '[class="-totalPages"]',

    // TitleText

    stager: 'a[href="/stager"]',
    underwriter: {
      selector: '//div[text()="UNDERWRITER STAGER"]',
      locateStrategy: 'xpath',
    },
    toOrder: {
      selector: '//div[text()="To Order"]',
      locateStrategy: 'xpath',
    },
    ordered: {
      selector: '//div[text()="Ordered"]',
      locateStrategy: 'xpath',
    },
    completed: {
      selector: '//div[text()="Completed"]',
      locateStrategy: 'xpath',
    },

    // DatGridButtons
    datagridDownload: {
      selector: '//span[text()=" DOWNLOAD"]',
      locateStrategy: 'xpath',
    },
    datagridToOrderValueOrder: {
      selector: '//span[text()="ORDER"]',
      locateStrategy: 'xpath',
    },
    ordertablevaluecheckbox: '[role="rowgroup"] [type="checkbox"]',
    dropdownselect: {
      selector: '//select[contains(@class,"components-CustomReactTable-CustomReactTable__filterDropDown")]/option[2]',
      locateStrategy: 'xpath',
    },
  },
};
