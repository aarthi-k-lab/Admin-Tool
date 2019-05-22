module.exports = {
  signIn: function signIn(browser) {
    const signInPage = browser.page.signInPage();
    browser
    // .url('https://cmoddev.int.mrcooper.io/reports')
      .url('https://cmodqa.int.mrcooper.io/reports')
      .waitForElementVisible('body');
    signInPage.assert.title('Sign in to your account');
    signInPage.waitForElementVisible('@signInAccount');
    signInPage.setValue('@signInAccount', 'rajesh.chidambaram@mrcooper.com');
    signInPage.waitForElementVisible('@signInAccountNext');
    signInPage.click('@signInAccountNext');
  },
  searchValidation: function searchValidation(browser) {
    const homePage = browser.page.homepage();
    homePage.waitForElementVisible('@search', browser.globals.waitForHeaderTimeout);
    homePage.verify.visible('@search');
  },
  cmodLogoValidation: function cmodLogoValidation(browser) {
    const homePage = browser.page.homepage();
    homePage.verify.visible('@cmodLogo');
  },
  profileValidation: function profileValidation(browser) {
    const homePage = browser.page.homepage();
    homePage.waitForElementVisible('@profile');
    homePage.verify.visible('@profile');
    homePage.click('@profile');
    homePage.waitForElementVisible('@profileName');
    // let resultValue = 'TEST';
    homePage.getText('@profileName', (result) => {
      // resultValue = result.value;
      browser.setCookie({
        name: 'username',
        value: result.value,
      });
      homePage.assert.deepStrictEqual(result.value, 'Rajesh Chidambaram', 'Verify Profile Name Successful');
    });
    homePage.getText('@profileEmail', (result) => {
      browser.getCookie('username', function callback(result1) {
        this.assert.equal(`${result1.value.replace(/ /g, '.')}@mrcooper.com`, result.value);
      });
      browser
        // .moveToElement('@profile', 10, 10)
        .mouseButtonClick('left')
        .pause(3000);
    });
  },
  getNextValidation: function getNextValidation(browser) {
    const homePage = browser.page.homepage();
    homePage.waitForElementVisible('@docProcessor');
    homePage.click('@docProcessor');
    homePage.waitForElementVisible('@agentHomePageText');
    homePage.verify.visible('@agentHomePageText');
    homePage.waitForElementVisible('@docProcessor');
    homePage.click('@docProcessor');
    homePage.waitForElementVisible('@getNext');
    homePage.verify.visible('@getNext');
    homePage.click('@getNext');
    browser.pause(5000);
    browser.element('xpath', '@loanLimitReached', (result) => {
      if (result.status !== -1) {
        homePage.waitForElementVisible('@frontendChecklist');
        homePage.click('@frontendChecklist');
        homePage.waitForElementVisible('@getNext');
        homePage.verify.visible('@getNext');
        homePage.click('@getNext');
        browser.pause(5000);
      } else {
        homePage.waitForElementPresent('@loanNbr');
        homePage.waitForElementPresent('@evalId');
      }
    });
  },
  loanTombstoneValidation: function loanTombstoneValidation(browser) {
    const homePage = browser.page.homepage();
    browser.pause(5000);
    homePage.waitForElementPresent('@loanNbr');
    homePage.waitForElementPresent('@evalId');
  // homePage.verify.visible('@investorloan');
    // homePage.verify.visible('@brandname');
    // homePage.verify.visible('@borrowercoborrower');
    // homePage.verify.visible('@investor');
    // homePage.verify.visible('@upb');
    // homePage.verify.visible('@upb');
    // homePage.verify.visible('@nextpaymentduedate');
  },
  dispositionCheck: function dispositionCheck(browser) {
    let date = new Date().getTime();
    date = new Date(date);
    date = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()} ${date.getHours() > 12 ? date.getHours() - 12 : date.getHours()}:${date.getMinutes()} ${date.getHours() >= 12 ? 'PM' : 'AM'}`;
    const homePage = browser.page.homepage();
    homePage.waitForElementPresent('@loanNbr');
    homePage.click('@DispositionGroupDecision');
    homePage.waitForElementPresent('@selectDispositionMissingDocuments');
    homePage.click('@selectDispositionMissingDocuments');
    browser.pause(3000);
    homePage.waitForElementPresent('@DispositionCommentsArea');
    homePage.click('@DispositionCommentsArea');
    browser.pause(3000);
    homePage.setValue('@DispositionCommentsArea', `Automation Testing -  ${date}`);
    homePage.waitForElementPresent('@Validate');
    homePage.verify.visible('@Validate');
    browser.pause(2000);
    homePage.click('@Validate');
    browser.pause(3000);
    // eslint-disable-next-line no-unused-expressions
    homePage.expect.element('@endshiftdisbaled').to.not.be.enabled;
    // eslint-disable-next-line no-unused-expressions
    homePage.expect.element('@getnextdisabled').to.not.be.enabled;
  },
  frontEndChecklistValidation: function frontEndChecklistValidation(browser) {
    const homePage = browser.page.homepage();
    homePage.waitForElementVisible('@frontendChecklist');
    homePage.click('@frontendChecklist');
    homePage.waitForElementVisible('@agentHomePageText');
    homePage.verify.visible('@agentHomePageText');
    homePage.waitForElementVisible('@getNext');
    homePage.verify.visible('@getNext');
    homePage.click('@getNext');
    browser.pause(3000);
  },
  backEndChecklistValidation: function frontEndChecklistValidation(browser) {
    const homePage = browser.page.homepage();
    homePage.waitForElementVisible('@backendUnderwriter');
    homePage.click('@backendUnderwriter');
    homePage.waitForElementVisible('@agentHomePageText');
    homePage.verify.visible('@agentHomePageText');
    homePage.waitForElementVisible('@getNext');
    homePage.verify.visible('@getNext');
    homePage.click('@getNext');
    browser.pause(3000);
  },
  moveForwardValidation: function moveForwardValidation(browser) {
    const moveForwardPage = browser.page.moveforwardPage();
    moveForwardPage.waitForElementVisible('@moveForward');
    moveForwardPage.click('@moveForward');
    moveForwardPage.waitForElementVisible('@pids');
    moveForwardPage.verify.visible('@moveForwardButton');
    browser.pause(3000);
  },
  stagerValidation: function stagerValidation(browser) {
    const stagerpage = browser.page.stagerPage();
    stagerpage.waitForElementVisible('@stager');
    stagerpage.verify.visible('@stager');
    stagerpage.click('@stager');
    stagerpage.waitForElementVisible('@underwriter');
    stagerpage.verify.visible('@underwriter');
    stagerpage.waitForElementVisible('@toOrder');
    stagerpage.verify.visible('@toOrder');
    stagerpage.waitForElementVisible('@ordered');
    stagerpage.verify.visible('@ordered');
    stagerpage.waitForElementVisible('@completed');
    stagerpage.verify.visible('@completed');
  },

  // To Order Validation for Escrow, Legal Fee and Value

  stagerToOrderEscrow: function stagerToOrderEscrow(browser) {
    const stagerpage = browser.page.stagerPage();
    stagerpage.waitForElementVisible('@escrowToOrderTitleText');
    stagerpage.verify.visible('@escrowToOrderTitleText');
    stagerpage.click('@escrowToOrderTitleText');
    browser.pause(3000);
    stagerpage.waitForElementVisible('@escrowToOrderCount');
    stagerpage.getText('@escrowToOrderCount', (result) => {
      console.log(`result ${result.value}`);
    });
    stagerpage.waitForElementVisible('@escrowToOrderSLA');
    stagerpage.verify.visible('@escrowToOrderSLA');
    // String buttonColor = driver.findElement(('@escrowsla')).getCssValue("background-color");
    stagerpage.waitForElementVisible('@escrowToOrderSLABreach');
    stagerpage.verify.visible('@escrowToOrderSLABreach');
    stagerpage.waitForElementVisible('@datagridTitleText');
    stagerpage.verify.visible('@datagridTitleText');
    stagerpage.waitForElementVisible('@datagridSubTitleText');
    stagerpage.verify.visible('@datagridSubTitleText');
    stagerpage.waitForElementVisible('@datagridDownload');
    stagerpage.verify.visible('@datagridDownload');
    browser.element('xpath', '@datagridNoDataPresent', (result) => {
      if (result.status !== -1) {
        stagerpage.click('@datagridDownload');
        stagerpage.waitForElementVisible('@datagridHeaderloan');
        stagerpage.verify.visible('@datagridHeaderloan');
        stagerpage.waitForElementVisible('@datagridHeadereval');
        stagerpage.verify.visible('@datagridHeadereval');
        stagerpage.waitForElementVisible('@datagridHeaderborrower');
        stagerpage.verify.visible('@datagridHeaderborrower');
        stagerpage.waitForElementVisible('@datagridHeadercoborrower');
        stagerpage.verify.visible('@datagridHeadercoborrower');
        stagerpage.waitForElementVisible('@datagridHeaderInvestorName');
        stagerpage.verify.visible('@datagridHeaderInvestorName');
        stagerpage.waitForElementVisible('@datagridHeaderdescription');
        stagerpage.verify.visible('@datagridHeaderdescription');
        stagerpage.waitForElementVisible('@datagridHeaderInvestorCode');
        stagerpage.verify.visible('@datagridHeaderInvestorCode');
        stagerpage.waitForElementVisible('@datagridHeadersla');
        stagerpage.verify.visible('@datagridHeadersla');
        stagerpage.waitForElementVisible('@datagridHeadercfpb');
        stagerpage.verify.visible('@datagridHeadercfpb');
        stagerpage.waitForElementVisible('@datagridLoanNumberDropdown');
        stagerpage.verify.visible('@datagridLoanNumberDropdown');
        stagerpage.click('@datagridLoanNumberDropdown');
        stagerpage.waitForElementVisible('@datagridCurrentPageNumber');
        stagerpage.waitForElementVisible('@datagridTotalPageNumber');
        stagerpage.getText('@datagridTotalPageNumber', (expectedText) => {
          console.log(`result ${expectedText.value}`);
        });
      } else {
        console.log('No Loans Available in Stager Table');
      }
    });
  },
  stagerToOrderLegalFee: function stagerToOrderLegalFee(browser) {
    const stagerpage = browser.page.stagerPage();
    stagerpage.waitForElementVisible('@legalToOrderTitleText');
    stagerpage.verify.visible('@legalToOrderTitleText');
    stagerpage.click('@legalToOrderTitleText');
    browser.pause(3000);
    stagerpage.waitForElementVisible('@legalToOrderCount');
    stagerpage.getText('@legalToOrderCount', (result) => {
      console.log(`result ${result.value}`);
    });
    stagerpage.waitForElementVisible('@legalToOrderSLA');
    stagerpage.verify.visible('@legalToOrderSLA');
    // String buttonColor = driver.findElement(('@escrowsla')).getCssValue("background-color");
    stagerpage.waitForElementVisible('@legalToOrderSLABreach');
    stagerpage.verify.visible('@legalToOrderSLABreach');
  },
  stagerToOrderValue: function stagerToOrderValue(browser) {
    const stagerpage = browser.page.stagerPage();
    stagerpage.waitForElementVisible('@valueToOrderTitleText');
    stagerpage.verify.visible('@valueToOrderTitleText');
    stagerpage.click('@valueToOrderTitleText');
    browser.pause(3000);
    stagerpage.waitForElementVisible('@valueToOrderSLA');
    stagerpage.verify.visible('@valueToOrderSLA');
    stagerpage.waitForElementVisible('@valueToOrderSLABreach');
    stagerpage.verify.visible('@valueToOrderSLABreach');
    stagerpage.getText('@valueToOrderCount', (result) => {
      console.log(`result ${result.value}`);
    });
    browser.element('xpath', '@datagridNoDataPresent', (result) => {
      if (result.status !== -1) {
        stagerpage.waitForElementVisible('@datagridLoanNumberDropdown');
        stagerpage.verify.visible('@datagridLoanNumberDropdown');
        stagerpage.click('@datagridLoanNumberDropdown');
        // stagerpage.waitForElementVisible('@dropdownselect');
        // stagerpage.verify.visible('@dropdownselect');
        // stagerpage.click('@dropdownselect');
        stagerpage.click('@ordertablevaluecheckbox');
        browser.pause(3000);
        stagerpage.waitForElementVisible('@datagridTotalPageNumber');
        stagerpage.getText('@datagridTotalPageNumber', (pageTotal) => {
          console.log(`result ${pageTotal.value}`);
        });
      } else {
        console.log('No Loans Available in Stager Table');
      }
    });
  },

  // Ordered Validation for Escrow, Legal Fee and Value

  stagerOrderedEscrow: function stagerOrderedEscrow(browser) {
    const stagerpage = browser.page.stagerPage();
    stagerpage.waitForElementVisible('@escrowOrderedTitleText');
    stagerpage.verify.visible('@escrowOrderedTitleText');
    stagerpage.click('@escrowOrderedTitleText');
    browser.pause(3000);
    stagerpage.waitForElementVisible('@escrowOrderedCount');
    stagerpage.getText('@escrowOrderedCount', (result) => {
      console.log(`result ${result.value}`);
    });
    stagerpage.waitForElementVisible('@escrowOrderedSLA');
    stagerpage.verify.visible('@escrowOrderedSLA');
    // String buttonColor = driver.findElement(('@escrowsla')).getCssValue("background-color");
    stagerpage.waitForElementVisible('@escrowOrderedSLABreach');
    stagerpage.verify.visible('@escrowOrderedSLABreach');
  },
  stagerOrderedLegalFee: function stagerToOrderLegalFee(browser) {
    const stagerpage = browser.page.stagerPage();
    stagerpage.waitForElementVisible('@legalOrderedTitleText');
    stagerpage.verify.visible('@legalOrderedTitleText');
    stagerpage.click('@legalOrderedTitleText');
    browser.pause(3000);
    stagerpage.waitForElementVisible('@legalOrderedCount');
    stagerpage.getText('@legalOrderedCount', (result) => {
      console.log(`result ${result.value}`);
    });
    stagerpage.waitForElementVisible('@legalOrderedSLA');
    stagerpage.verify.visible('@legalOrderedSLA');
    // String buttonColor = driver.findElement(('@escrowsla')).getCssValue("background-color");
    stagerpage.waitForElementVisible('@legalOrderedSLABreach');
    stagerpage.verify.visible('@legalOrderedSLABreach');
  },
  stagerOrderedValue: function stagerToOrderValue(browser) {
    const stagerpage = browser.page.stagerPage();
    stagerpage.waitForElementVisible('@valueOrderedTitleText');
    stagerpage.verify.visible('@valueOrderedTitleText');
    stagerpage.click('@valueOrderedTitleText');
    browser.pause(3000);
    stagerpage.waitForElementVisible('@valueOrderedCount');
    stagerpage.getText('@valueOrderedCount', (result) => {
      console.log(`result ${result.value}`);
    });
    stagerpage.waitForElementVisible('@valueOrderedSLA');
    stagerpage.verify.visible('@valueOrderedSLA');
    // String buttonColor = driver.findElement(('@escrowsla')).getCssValue("background-color");
    stagerpage.waitForElementVisible('@valueOrderedSLABreach');
    stagerpage.verify.visible('@valueOrderedSLABreach');
  },

  // Completed Validation for Escrow, Legal Fee and Value

  stagerCompleted: function stagerCompleted(browser) {
    const stagerpage = browser.page.stagerPage();
    stagerpage.waitForElementVisible('@escrowCompletedTitleText');
    stagerpage.verify.visible('@escrowCompletedTitleText');
    stagerpage.click('@escrowCompletedTitleText');
    browser.pause(3000);
    stagerpage.waitForElementVisible('@escrowCompletedCount');
    stagerpage.verify.visible('@escrowCompletedCount');
    stagerpage.getText('@escrowCompletedCount', (result) => {
      console.log(`result ${result.value}`);
    });
    browser.element('xpath', '@datagridNoDataPresent', (result) => {
      if (result.status !== -1) {
        stagerpage.waitForElementVisible('@datagridTitleText');
        stagerpage.verify.visible('@datagridTitleText');
        stagerpage.waitForElementVisible('@datagridSubTitleText');
        stagerpage.verify.visible('@datagridSubTitleText');
        stagerpage.waitForElementVisible('@datagridTotalPageNumber');
        stagerpage.getText('@datagridTotalPageNumber', (escrowPageTotal) => {
          console.log(`result ${escrowPageTotal.value}`);
        });
      } else {
        console.log('No Loans Available in Stager Table');
      }
    });

    stagerpage.waitForElementVisible('@legalCompletedTitleText');
    stagerpage.verify.visible('@legalCompletedTitleText');
    stagerpage.click('@legalCompletedTitleText');
    browser.pause(3000);
    browser.element('xpath', '@datagridNoDataPresent', (result) => {
      if (result.status !== -1) {
        stagerpage.waitForElementVisible('@legalCompletedCount');
        stagerpage.verify.visible('@legalCompletedCount');
        stagerpage.waitForElementVisible('@datagridTitleText');
        stagerpage.verify.visible('@datagridTitleText');
        stagerpage.waitForElementVisible('@datagridSubTitleText');
        stagerpage.verify.visible('@datagridSubTitleText');
        stagerpage.waitForElementVisible('@datagridTotalPageNumber');
        stagerpage.getText('@datagridTotalPageNumber', (legalPageTotal) => {
          console.log(`result ${legalPageTotal.value}`);
        });
      } else {
        console.log('No Loans Available in Stager Table');
      }
    });
    stagerpage.waitForElementVisible('@valueCompletedTitleText');
    stagerpage.verify.visible('@valueCompletedTitleText');
    stagerpage.click('@valueCompletedTitleText');
    browser.element('xpath', '@datagridNoDataPresent', (result) => {
      if (result.status !== -1) {
        stagerpage.waitForElementVisible('@valueCompletedCount');
        stagerpage.verify.visible('@valueCompletedCount');
        stagerpage.waitForElementVisible('@datagridTitleText');
        stagerpage.verify.visible('@datagridTitleText');
        stagerpage.waitForElementVisible('@datagridSubTitleText');
        stagerpage.verify.visible('@datagridSubTitleText');
        stagerpage.waitForElementVisible('@datagridTotalPageNumber');
        stagerpage.getText('@datagridTotalPageNumber', (completedPageTotal) => {
          console.log(`result ${completedPageTotal.value}`);
        });
      } else {
        console.log('No Loans Available in Stager Table');
      }
    });
  },
};
