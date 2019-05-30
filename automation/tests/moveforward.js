module.exports = {
  signIn: function signIn(browser) {
    const signInPage = browser.page.signInPage();
    const homePage = browser.page.homepage();
    browser
      .url('https://cmodqa.int.mrcooper.io/reports')
      .waitForElementVisible('body');
    signInPage.assert.title('Sign in to your account');
    signInPage.waitForElementVisible('@signInAccount');
    signInPage.setValue('@signInAccount', 'rajesh.chidambaram@mrcooper.com');
    signInPage.waitForElementVisible('@signInAccountNext');
    signInPage.click('@signInAccountNext');
    homePage.waitForElementVisible('@header', browser.globals.waitForHeaderTimeout);
  },
  moveforwardValidation: function moveforwardValidation(browser) {
    const moveforward = browser.page.moveforwardPage();
    moveforward.waitForElementVisible('@moveForward');
    moveforward.verify.visible('@moveForward');
    moveforward.click('@moveForward');
    moveforward.waitForElementVisible('@moveForwardButton');
    moveforward.waitForElementVisible('@pidsProcessed');
    moveforward.waitForElementVisible('@pids');
    moveforward.setValue('@pids', '12312,21343214,2152135');
    moveforward.click('@moveForwardButton');
    moveforward.waitForElementVisible('@noPidsProcessed');
    moveforward.verify.visible('@pidsProcessError');
  },
};
