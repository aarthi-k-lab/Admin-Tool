module.exports = {
  elements: {
    moveForward: 'a[href="/move-forward"]',
    pids: '#pids',
    moveForwardButton: {
      selector: '//span[text()="Move Forward"]',
      locateStrategy: 'xpath',
    },
    pidsProcessed: {
      selector: '//p[text()="0 pids have been processed."]',
      locateStrategy: 'xpath',
    },
    noPidsProcessed: {
      selector: '//p[text()="3 pids have been processed."]',
      locateStrategy: 'xpath',
    },
    pidsProcessError: {
      selector: '//div[text()="Error in updateInstanceStatus"]',
      locateStrategy: 'xpath',
    },
  },
};
