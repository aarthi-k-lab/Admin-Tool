module.exports = {
  mutipleAssertions: function mutipleAssertions(browser, elems) {
    const homePage = browser.page.homepage();
    elems.value.forEach((element) => {
      homePage.elementIdText(element.ELEMENT, (result) => {
        homePage.assert.equal(result.value, 'text');
      });
    });
  },
};
