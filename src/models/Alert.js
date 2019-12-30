const SOMETHING_WENT_WRONG = 'Something went wrong. Please try again';

const ALERT_PROPS = {
  SOMETHING_WENT_WRONG: {
    imageUrl: '/static/img/notfound.gif',
    text: 'Oops.. Something went wrong. Please try again',
    title: 'Something went Wrong',
    show: true,
  },
  INVALID_RESOLUTION_ID: {
    imageUrl: '/static/img/notfound.gif',
    text: 'Invalid Resolution ID. Please enter a valid Resolution ID',
    title: 'Invalid Resolution ID',
    show: true,
  },
  ALL_RULES_PASSED: {
    imageUrl: '/static/img/success.gif',
    text: 'Success...!!!',
    title: 'All rules passed',
    show: true,
  },
  ALL_RULES_FAILED: {
    imageUrl: '/static/img/failure.gif',
    text: 'Oops...!!!',
    title: 'All rules failed',
    show: true,
  },
};

module.exports = {
  ALERT_PROPS,
  SOMETHING_WENT_WRONG,
};
