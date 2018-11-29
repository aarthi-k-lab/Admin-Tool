module.exports = {
  signIn: function signIn(browser) {
    const signInPage = browser.page.signInPage();
    browser
      .url('https://cmoddev.int.mrcooper.io/reports')
      .waitForElementVisible('body');
    signInPage.assert.title('Sign in to your account');
    signInPage.waitForElementVisible('@signInAccount');
    signInPage.setValue('@signInAccount', 'rajesh.chidambaram@mrcooper.com');
    signInPage.waitForElementVisible('@signInAccountNext');
    signInPage.click('@signInAccountNext');
  },
  headerValidation: function headerValidation(browser) {
    const homePage = browser.page.homepage();
    homePage.waitForElementVisible('@header', browser.globals.waitForHeaderTimeout);
    homePage.verify.visible('@header');
  },
  searchValidation: function searchValidation(browser) {
    const homePage = browser.page.homepage();
    homePage.verify.visible('@search');
  },
  cmodLogoValidation: function cmodLogoValidation(browser) {
    const homePage = browser.page.homepage();
    homePage.verify.visible('@cmodLogo');
    homePage.click('@cmodLogo');
  },
  profileValidation: function profileValidation(browser) {
    const homePage = browser.page.homepage();
    homePage.waitForElementVisible('@profile');
    homePage.verify.visible('@profile');
    homePage.click('@profile');
    homePage.waitForElementVisible('@profileName');
    homePage.getText('@profileName', (result) => {
      homePage.assert.deepStrictEqual(result.value, 'Rajesh Chidambaram', 'Verify Profile Name Successful');
      browser
        // .moveToElement('@profile', 10, 10)
        .mouseButtonClick('left')
        .pause(3000);
    });
  },

  getNextValidation: function getNextValidation(browser) {
    const homePage = browser.page.homepage();
    homePage.waitForElementVisible('@agentHomePageText');
    homePage.verify.visible('@agentHomePageText');
    homePage.waitForElementVisible('@agentPage');
    homePage.click('@agentPage');
    homePage.waitForElementVisible('@getNext');
    homePage.verify.visible('@getNext');
    homePage.click('@getNext');
    homePage.waitForElementVisible('@loanNbr');
    homePage.verify.visible('@loanNbr');
  },
  loanTombstoneValidation: function loanTombstoneValidation(browser) {
    const homePage = browser.page.homepage();
    homePage.waitForElementVisible('@loanNbr');
    homePage.verify.visible('@loanNbr');
    homePage.verify.visible('@evalId');
    // homePage.verify.visible('@investorloan');
    // homePage.verify.visible('@brandname');
    // homePage.verify.visible('@borrowercoborrower');
    // homePage.verify.visible('@investor');
    // homePage.verify.visible('@upb');
    // homePage.verify.visible('@upb');
    // homePage.verify.visible('@nextpaymentduedate');
  },
  dispositionCheck: function dispositionCheck(browser) {
    const homePage = browser.page.homepage();
    homePage.waitForElementVisible('@loanNbr');
    homePage.click('@missingDocumentDisp');
    homePage.click('@saveDisp');
    homePage.waitForElementVisible('@missingDocsErrorMessage');
    homePage.waitForElementVisible('@missingDocsErrorMessage2');
    homePage.waitForElementVisible('@retryDisp');
    homePage.verify.visible('@retryDisp');
    // eslint-disable-next-line no-unused-expressions
    homePage.expect.element('@endshiftdisbaled').to.not.be.enabled;
    // eslint-disable-next-line no-unused-expressions
    homePage.expect.element('@getnextdisabled').to.not.be.enabled;
  },
};
