
import moment from 'moment-timezone';
import Validators from 'lib/Validators';

const { getOr } = Validators;

function generateReasonableEffortItem(title, content) {
  return {
    title,
    content,
  };
}

function getDate(date) {
  if (date !== '-') {
    return moment(date).format('MM/DD/YYYY');
  }
  return date;
}

function getReasonableEffortId(reaonsableEffortData) {
  const reasonableEffortId = getOr('reasonableEffortId', reaonsableEffortData, '-');
  return generateReasonableEffortItem('Reasonable Effort ID', reasonableEffortId);
}

function getFaciallyComplete(reaonsableEffortData) {
  let faciallyCompleteDate = getOr('faciallyCompleteDate', reaonsableEffortData, '-');
  faciallyCompleteDate = getDate(faciallyCompleteDate);
  return generateReasonableEffortItem('Facially Complete', faciallyCompleteDate);
}

function getLastDocumentReceivedDate(reaonsableEffortData) {
  let lastDocumentReceivedDate = getOr('lastDocumentReceivedDate', reaonsableEffortData, '-');
  lastDocumentReceivedDate = getDate(lastDocumentReceivedDate);
  return generateReasonableEffortItem('Last Doc Received', lastDocumentReceivedDate);
}

function getLastDocReceivedFaciallyComplete(reaonsableEffortData) {
  let lastDocReceivedFaciallyComplete = getOr('lastDocReceivedFaciallyComplete', reaonsableEffortData, '-');
  lastDocReceivedFaciallyComplete = getDate(lastDocReceivedFaciallyComplete);
  return generateReasonableEffortItem('Last Doc Received at Facially Complete', lastDocReceivedFaciallyComplete);
}

function getBcContactDate(reaonsableEffortData) {
  let bcContactDate = getOr('bcContactDate', reaonsableEffortData, '-');
  bcContactDate = getDate(bcContactDate);
  return generateReasonableEffortItem('Contact', bcContactDate);
}

function getBcContactCaseRejectDate(reaonsableEffortData) {
  let bcContactCaseRejectDate = getOr('bcContactCaseRejectDate', reaonsableEffortData, '-');
  bcContactCaseRejectDate = getDate(bcContactCaseRejectDate);
  return generateReasonableEffortItem('Case Reject', bcContactCaseRejectDate);
}

function getBcContactCaseRejectionReason(reaonsableEffortData) {
  const bcContactCaseRejectionReason = getOr('bcContactCaseRejectionReason', reaonsableEffortData, '-');
  return generateReasonableEffortItem('Case Reject Reason', bcContactCaseRejectionReason);
}

function getCreateBy(reaonsableEffortData) {
  const createBy = getOr('createBy', reaonsableEffortData, '-');
  return generateReasonableEffortItem('Case Opened By', createBy);
}

function getDaysDelinquent(reaonsableEffortData) {
  const daysDelinquent = getOr('daysDelinquent', reaonsableEffortData, '-');
  return generateReasonableEffortItem('Delinquent at Open', daysDelinquent);
}

function getReasonableEffortItems(reaonsableEffortData) {
  const reasonableEffortDataGenerator = [
    getReasonableEffortId,
    getFaciallyComplete,
    getLastDocumentReceivedDate,
    getLastDocReceivedFaciallyComplete,
    getBcContactDate,
    getBcContactCaseRejectDate,
    getBcContactCaseRejectionReason,
    getCreateBy,
    getDaysDelinquent,
  ];
  const data = reasonableEffortDataGenerator.map(fn => fn(reaonsableEffortData));
  return data;
}


const ReasonableEffort = {
  generateReasonableEffortItem,
  getReasonableEffortItems,
};


export default ReasonableEffort;
