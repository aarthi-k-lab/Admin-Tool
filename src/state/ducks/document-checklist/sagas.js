/* eslint-disable no-param-reassign */
import {
  select,
  takeEvery,
  all,
  put,
  call,
} from 'redux-saga/effects';
import * as Api from 'lib/Api';
import { selectors as dashboardSelectors } from 'ducks/dashboard';
import { selectors as taskAndChecklistSelectors } from 'ducks/tasks-and-checklist';
import { selectors as incomeCalcSelectors } from 'ducks/income-calculator';
import * as R from 'ramda';
import {
  getTasks,
  storeProcessDetails,
} from 'ducks/tasks-and-checklist/actions';
import ChecklistErrorMessageCodes from 'models/ChecklistErrorMessageCodes';
import moment from 'moment';
import {
  SET_RESULT_OPERATION, TOGGLE_BANNER, USER_NOTIF_MSG,
  SET_GET_NEXT_STATUS, CHECKLIST_NOT_FOUND,
} from '../dashboard/types';
import { ERROR } from '../../../constants/common';
import {
  DOC_REVIEW_STATUS_ERROR,
  DOC_CHECKLIST_FETCH_ERROR,
  DOC_CHECKLIST_SAVE_ERROR,
  DEFECT_REASON_ERROR,
  DOC_HIST_ERROR,
} from '../../../constants/loanInfoComponents';
import {
  LINK_DOCUMENTS_SAGA, LINK_DOCUMENTS, BORRORWERS_NAMES_SAGA, BORRORWERS_NAMES,
  UNLINK_DOCUMENTS_SAGA, UNLINK_DOCUMENTS, SET_TAG_SAGA, SET_TAG, DOC_REVIEW_STATUS_DROPDOWN,
  SAVE_DOC_REVIEW_STATUS_DROPDOWN,
  FETCH_FILENET_DATA, SAVE_FILENET_DOC_CAT, SET_FILENET_DATA, SAVE_FILENET_DOC_TYPE,
  DOCUMENT_DETAILS_CHANGE,
  DOCUMENT_DETAILS_CHANGE_SAGA, FETCH_DOC_TXNS, DOC_CHECKLIST_DATA, SAVE_DOC_CHECKLIST_DATA,
  TRIGGER_DOC_VALIDATION, SET_ERROR_FIELDS, SAVE_DEFECT_REASON_DROPDOWN, DEFECT_REASON_DROPDOWN,
  FETCH_DOC_HISTORY, SET_DOC_HISTORY,
  DOC_CHECKLIST_ADD_CONTRIBUTOR,
} from './types';
import {
  SET_BANNER_DATA, SET_BORROWERS_DATA, HIDE_LOADER, CLEAR_TASK_VALUE,
  SHOW_LOADER, STORE_CHECKLIST, SET_PROCESS_ID,
} from '../income-calculator/types';
import selectors from './selectors';
import { selectors as loginSelectors } from '../login';

function* linkDocuments(payload) {
  const docChecklistData = yield select(selectors.getDocChecklistData);
  const documentName = yield select(selectors.getRadioSelect);
  const { payload: { checkedBorrowers, checkedFilenetDocs } } = payload;
  const documentsChecked = checkedFilenetDocs;
  const user = yield select(loginSelectors.getUser);
  const userPrincipalName = R.path(['userDetails', 'email'], user);
  const requestData = [];
  const newData = docChecklistData ? docChecklistData.map((data) => {
    if (checkedBorrowers.includes(data.borrowerName)) {
      // eslint-disable-next-line no-unused-vars
      const newDocumentData = data.documents ? data.documents.map((document) => {
        if (documentName === document.documentName) {
          let dataForNewLinkDoc = {};
          if (document.linkedDocuments) {
            const pastDocuments = document.linkedDocuments.map(p => p.fileNetDocId);
            document.linkedDocuments = [...document.linkedDocuments, ...documentsChecked];
            const newLinkedDocument = [];
            const uniqueLinkedDocuments = document.linkedDocuments.filter((element) => {
              const isDuplicate = newLinkedDocument.includes(element.fileNetDocId);
              if (!isDuplicate) {
                newLinkedDocument.push(element.fileNetDocId);
                return true;
              }
              return false;
            });
            const newUniqueDocuments = document.linkedDocuments.filter(
              doc => !pastDocuments.includes(doc.fileNetDocId),
            );
            dataForNewLinkDoc = {
              docTxnId: document.docTxnId,
              documents: newUniqueDocuments,
            };
            document.linkedDocuments = uniqueLinkedDocuments;
            if (document.documentReviewStatus === 'Not Provided') {
              if (document.linkedDocuments.length > 0) {
                document.documentReviewStatus = 'Not reviewed';
              }
            }
          } else {
            document.linkedDocuments = [...documentsChecked];
            dataForNewLinkDoc = {
              docTxnId: document.docTxnId,
              documents: document.linkedDocuments,
            };
          }
          if (dataForNewLinkDoc.documents.length > 0) { document.agentName = userPrincipalName; }
          requestData.push(dataForNewLinkDoc);
        }
        return document;
      }) : [];
    }
    return data;
  }) : [];
  yield call(Api.callPost, `/api/dataservice/DocCheckList/linkDocksAndDocTxn/${userPrincipalName}}`, requestData);
  yield put({
    type: LINK_DOCUMENTS,
    payload: newData,
  });
}

function* unlinkDocuments(payload) {
  const docChecklistData = yield select(selectors.getDocChecklistData);
  const { payload: { checkedBorrowers, removalDocumentId, removalDocumentName } } = payload;
  const docTxnIds = [];
  const user = yield select(loginSelectors.getUser);
  const userPrincipalName = R.path(['userDetails', 'email'], user);
  const newData = docChecklistData ? docChecklistData.map((data) => {
    if (checkedBorrowers.includes(data.borrowerName)) {
      // eslint-disable-next-line no-unused-vars
      const newDocumentData = data.documents ? data.documents.map((document) => {
        if (removalDocumentName === document.documentName) {
          docTxnIds.push(document.docTxnId);
          document.agentName = userPrincipalName;
          document.linkedDocuments = document.linkedDocuments
            .filter(doc => doc.fileNetDocId !== removalDocumentId);
          if (document.linkedDocuments.length === 0) {
            if (document.documentReviewStatus === 'Not reviewed') {
              document.documentReviewStatus = 'Not Provided';
            }
          }
        }
        return document;
      }) : [];
    }
    return data;
  }) : [];
  const payLoad = {
    docTransactionId: docTxnIds,
    fileNetDocId: removalDocumentId,
  };
  yield call(Api.callPost, `/api/dataservice/DocCheckList/unlinkDocsAndDocTxn/${userPrincipalName}`, payLoad);
  yield put({
    type: UNLINK_DOCUMENTS,
    payload: newData,
  });
}

function* fetchBorrowersNames(payload) {
  const { payload: { type } } = payload;
  const docChecklistData = yield select(selectors.getDocChecklistData);
  const processedBorrower = yield select(incomeCalcSelectors.getBorrowers);
  if (type === 'link') {
    const data = {};
    if (docChecklistData) {
      docChecklistData.map((borrower) => {
        const positionNum = parseInt(borrower.borrowerName.split('_')[1], 10);
        const borrObj = R.find(R.propEq('borrowerPstnNumber', positionNum))(processedBorrower);
        data[borrower.borrowerName] = {
          displayName: borrower.displayName,
          description: borrObj.description,
        };
        return borrower;
      });
    }
    yield put({
      type: BORRORWERS_NAMES,
      payload: data,
    });
  }
  if (type === 'unlink') {
    const { payload: { removalDocumentId, removalDocumentName } } = payload;
    const borrowerNames = docChecklistData.reduce((acc, curr) => {
      if (curr.documents) {
        return curr.documents.reduce((acc1, curr1) => {
          if (curr1.documentName === removalDocumentName && curr1.linkedDocuments) {
            return curr1.linkedDocuments.reduce((acc2, curr2) => {
              if (curr2.fileNetDocId === removalDocumentId) {
                const { borrowerName, displayName } = curr;
                const positionNum = parseInt(borrowerName.split('_')[1], 10);
                const borrObj = R.find(R.propEq('borrowerPstnNumber', positionNum))(processedBorrower);
                return {
                  ...acc2,
                  [borrowerName]:
                  { displayName, description: borrObj.description },
                };
              }
              return acc2;
            }, { ...acc1 });
          }
          return acc1;
        }, { ...acc });
      }
      return acc;
    }, {});
    yield put({
      type: BORRORWERS_NAMES,
      payload: borrowerNames,
    });
  }
  if (type === 'tag') {
    const { payload: { taggedDocumentName, tagRequired } } = payload;
    const borrowerNames = docChecklistData.reduce((acc, curr) => {
      if (curr.documents) {
        return curr.documents.reduce((acc1, curr1) => {
          if (curr1.documentName === taggedDocumentName && curr1.required === tagRequired) {
            const { borrowerName, displayName } = curr;
            const positionNum = parseInt(borrowerName.split('_')[1], 10);
            const borrObj = R.find(R.propEq('borrowerPstnNumber', positionNum))(processedBorrower);
            return { ...acc1, [borrowerName]: { displayName, description: borrObj.description } };
          }
          return acc1;
        }, { ...acc });
      }
      return acc;
    }, {});
    yield put({
      type: BORRORWERS_NAMES,
      payload: borrowerNames,
    });
  }
}

function* setTagData(payload) {
  const docChecklistData = yield select(selectors.getDocChecklistData);
  const email = yield select(loginSelectors.getUserPrincipalName);
  const { payload: { checkedBorrowers, taggedDocumentName, required } } = payload;
  const newData = docChecklistData ? docChecklistData.map((data) => {
    if (checkedBorrowers.includes(data.borrowerName)) {
      // eslint-disable-next-line no-unused-vars
      const documentData = data.documents.map((document) => {
        if (document.documentName === taggedDocumentName) {
          document.agentName = email;
          document.required = required;
        }
        return document;
      });
    }
    return data;
  }) : [];
  yield put({
    type: SET_TAG,
    payload: newData,
  });
}

function* fetchdocReviewStatusDropdown(payload) {
  try {
    const responseMapper = item => ({
      portfolioCode: item.className,
      requestType: item.classCode,
      activeIndicator: item.activeIndicator,
      displayText: item.classCode,
    });
    let type = R.propOr('', 'payload', payload);
    // replacing / with !!! as / is not encoded
    type = type.replaceAll('/', '!!!');
    let response = yield call(Api.callGet, `/api/dataservice/api/classCodes/${type}`);
    if (type === 'Doc Review Status') {
      if (response && response.length > 0) {
        response = R.map(responseMapper, response);
      }
      yield put({
        type: SAVE_DOC_REVIEW_STATUS_DROPDOWN,
        payload: response,
      });
    } else if (type === 'FilenetDocCategory') {
      yield put({
        type: SAVE_FILENET_DOC_CAT,
        payload: response,
      });
    } else {
      yield put({
        type: SAVE_FILENET_DOC_TYPE,
        payload: response,
      });
    }
  } catch (e) {
    yield put({
      type: SET_RESULT_OPERATION,
      payload: {
        level: ERROR,
        status: DOC_REVIEW_STATUS_ERROR,
      },
    });
  }
}

function* fetchFileNetData() {
  try {
    const loanId = yield select(dashboardSelectors.loanNumber);
    const brand = yield select(dashboardSelectors.brand);
    const filterStartDate = yield select(selectors.getFilterStartDate);

    let filterEndDate = yield select(selectors.getFilterEndDate);
    filterEndDate = moment(filterEndDate).add(1, 'd').format('MM/DD/YYYY');
    filterEndDate = filterEndDate === 'Invalid date' ? null : filterEndDate;
    const filterDocCategory = yield select(selectors.getFilterDocCategory);
    const fileNetData = yield call(Api.callGet, `/api/document/api/FileNet/GetDocuments/${loanId}?${filterDocCategory !== '' ? `DocumentCategory=${filterDocCategory}` : ''}${filterStartDate ? `&CreatedDateFrom=${filterStartDate}` : ''}${filterEndDate ? `&CreatedDateTo=${filterEndDate}` : ''}`, { brand });
    yield put({ type: SET_FILENET_DATA, payload: fileNetData });
  } catch (e) {
    yield put({ type: SET_FILENET_DATA, payload: [] });
  }
}

function* updateAndSaveChecklist(validationSuccess) {
  try {
    const taskTree = yield select(taskAndChecklistSelectors.getTaskTree);
    const checklistId = yield select(taskAndChecklistSelectors.getProcessId);
    const task = R.find(R.propEq('taskBlueprintCode', 'EXT_CHG'))(taskTree.subTasks);
    const { _id, value } = task;
    yield call(Api.put, `/api/task-engine/task/${_id}`, { value: { ...value, validationSuccess } });
    const response = yield call(Api.callGet, `/api/task-engine/process/${checklistId}?shouldGetTaskTree=false&forceNoCache=${Math.random()}`);
    const didErrorOccur = response === null;
    if (didErrorOccur) {
      throw new Error('Api call failed');
    } else {
      yield put({
        type: USER_NOTIF_MSG,
        payload: {},
      });
      yield put({
        type: SET_GET_NEXT_STATUS,
        payload: false,
      });
    }
    const { rootId: rootTaskId } = response;
    yield put(storeProcessDetails(checklistId, rootTaskId));
    yield put(getTasks());
  } catch (e) {
    yield put({
      type: CHECKLIST_NOT_FOUND,
      payload: {
        messageCode: ChecklistErrorMessageCodes.CHECKLIST_FETCH_FAILED,
      },
    });
  }
}

function* changeDocDetails(payload) {
  const { payload: { key, value, docTxnId } } = payload;
  const docChecklistData = yield select(selectors.getDocChecklistData);
  const email = yield select(loginSelectors.getUserPrincipalName);
  const data = docChecklistData ? docChecklistData.map((borrData) => {
    if (borrData.documents) {
      borrData.documents.map((document) => {
        if (document.docTxnId === docTxnId) {
          if (Array.isArray(document[key])) {
            document[key] = [...value];
          } else {
            document[key] = value;
          }
          document.agentName = email;
        }
        return document;
      });
    }
    return borrData;
  }) : [];
  const taskTree = yield select(taskAndChecklistSelectors.getTaskTree);
  const task = R.find(R.propEq('taskBlueprintCode', 'EXT_CHG'))(taskTree.subTasks);
  const { validationSuccess } = task.value;
  if (!R.isNil(validationSuccess) && validationSuccess) {
    yield call(updateAndSaveChecklist, false);
  }

  yield put({
    type: DOCUMENT_DETAILS_CHANGE_SAGA,
    payload: data,
  });
}

function preprocessDocChecklistData(data) {
  const processedData = data.map((borrData) => {
    if (borrData.documents) {
      borrData.documents.map((document) => {
        if (R.isNil(document.documentReviewStatus)
        || R.isEmpty(document.documentReviewStatus)
         || R.isEmpty(document.linkedDocuments)) {
          document.documentReviewStatus = 'Not Provided';
        }
        return document;
      });
    }
    return borrData;
  });
  return processedData;
}

function* fetchDocChecklistData() {
  try {
    const evalId = yield select(dashboardSelectors.evalId);
    const loanNum = yield select(dashboardSelectors.loanNumber);
    const data = yield call(Api.callGet, `/api/dataservice/DocCheckList/getDocTypes/${loanNum}/${evalId}`);
    if (data) { preprocessDocChecklistData(data); }
    yield put({
      type: DOC_CHECKLIST_DATA,
      payload: data,
    });
  } catch (e) {
    yield put({
      type: SET_RESULT_OPERATION,
      payload: {
        level: ERROR,
        status: DOC_CHECKLIST_FETCH_ERROR,
      },
    });
  }
}

function* saveDocChecklistData() {
  try {
    const data = yield select(selectors.getDocChecklistData);
    const payload = data.reduce((acc, curr) => {
      if (curr.documents) {
        return curr.documents.reduce((acc1, doc) => {
          const obj = {
            docTxnId: doc.docTxnId,
            agentName: doc.agentName,
            comments: doc.comments,
            docReviewStatus: doc.documentReviewStatus,
            defectReasons: doc.docReasons,
            expirationDate: doc.expirationDate ? new Date(doc.expirationDate) : null,
            isRequired: doc.required ? 1 : 0,
          };
          return [...acc1, obj];
        }, [...acc]);
      }
      return acc;
    }, []);
    yield call(Api.callPost, '/api/dataservice/DocCheckList/saveDocDetails', payload);
  } catch (e) {
    yield put({
      type: SET_RESULT_OPERATION,
      payload: {
        level: ERROR,
        status: DOC_CHECKLIST_SAVE_ERROR,
      },
    });
  }
}

function* docValidation() {
  const docChecklistData = yield select(selectors.getDocChecklistData);
  const banner = { 1: [], 2: [] };
  const errorFields = { borrowerNames: [] };
  // eslint-disable-next-line no-unused-vars
  const data = docChecklistData ? docChecklistData.map((borrData) => {
    borrData.documents.map((document) => {
      const ed = [];
      if (document.documentReviewStatus === 'Defects' && document.docReasons.length === 0) {
        const d = {
          messages: ['Defect(s) reason need to be selected'],
          path: ['Doc Checklist', borrData.displayName, document.documentName, 'Doc Reason(s)'],
        };
        banner[1] = [...banner[1], d];
        ed.push('documentReviewStatus');
      }
      if (document.linkedDocuments.length !== 0 && !document.expirationDate) {
        const d = {
          messages: ['Expiration date need to be selected'],
          path: ['Doc Checklist', borrData.displayName, document.documentName, 'expiration'],
        };
        banner[1] = [...banner[1], d];
        ed.push('expirationDate');
      }
      if (ed.length > 0) {
        errorFields[document.docTxnId] = ed;
        if (!errorFields.borrowerNames.includes(borrData.borrowerName)) {
          errorFields.borrowerNames = [...errorFields.borrowerNames, borrData.borrowerName,
          ];
        }
      }
      return document;
    });
    return borrData;
  }) : [];
  if (R.isEmpty(R.propOr([], 1, banner)) && R.isEmpty(R.propOr([], 2, banner))) {
    yield call(updateAndSaveChecklist, true);
  }
  yield put({
    type: TOGGLE_BANNER,
    payload: !R.isEmpty(R.propOr([], 1, banner)) || !R.isEmpty(R.propOr([], 2, banner)),
  });
  yield put({
    type: SET_BANNER_DATA,
    payload: banner,
  });
  yield put({
    type: SET_ERROR_FIELDS,
    payload: errorFields,
  });
}

function* fetchDefectReasonDropdown(payload) {
  try {
    let docChecklistData = yield select(selectors.getDefectReasonDropdown);
    const type = R.propOr('', 'payload', payload);
    const response = yield call(Api.callPost, '/api/dataservice/api/getDefectReasonBydocType', { docName: type });
    docChecklistData = { ...docChecklistData, [type]: response };
    yield put({
      type: SAVE_DEFECT_REASON_DROPDOWN,
      payload: docChecklistData,
    });
  } catch (e) {
    yield put({
      type: SET_RESULT_OPERATION,
      payload: {
        level: ERROR,
        status: DEFECT_REASON_ERROR,
      },
    });
  }
}

function* fetchDocTransactionHistory(payload) {
  try {
    const { payload: { docTxnId } } = payload;
    const response = yield call(Api.callGet, `/api/dataservice/DocCheckList/getDocHistory/${docTxnId}`);
    yield put({
      type: SET_DOC_HISTORY,
      payload: response,
    });
  } catch (e) {
    yield put({
      type: SET_RESULT_OPERATION,
      payload: {
        level: ERROR,
        status: DOC_HIST_ERROR,
      },
    });
  }
}

const getTaskFromProcess = (taskObj, prop, value) => {
  if (R.propEq(prop, value)(taskObj)) {
    return taskObj;
  }
  const task = [];
  if (taskObj.subTasks && R.length(taskObj.subTasks) > 0) {
    taskObj.subTasks.forEach((subTask) => {
      task.push(getTaskFromProcess(subTask, prop, value));
    });
  }
  if (task) return task.flat();
  return null;
};

function* fetchChecklistDetails(action) {
  const processId = action.payload;
  try {
    const isChecklistIdInvalid = R.isNil(processId) || R.isEmpty(processId);
    if (isChecklistIdInvalid) {
      yield put({
        type: CHECKLIST_NOT_FOUND,
        payload: {
          messageCode: ChecklistErrorMessageCodes.NO_CHECKLIST_ID_PRESENT,
        },
      });
      return;
    }
    const response = yield call(Api.callGet, `/api/task-engine/process/${processId}?shouldGetTaskTree=true&visibility=true&aggregation=true&forceNoCache=${Math.random()}`);
    const didErrorOccur = response === null;
    if (didErrorOccur) {
      throw new Error('Api call failed');
    }
    const checklist = {
      lastUpdated: `${new Date()}`,
      response,
    };
    yield put({ type: SET_PROCESS_ID, payload: processId });
    yield put({ type: STORE_CHECKLIST, payload: checklist });
  } catch (e) {
    yield put({
      type: CHECKLIST_NOT_FOUND,
      payload: {
        messageCode: ChecklistErrorMessageCodes.CHECKLIST_FETCH_FAILED,
      },
    });
  }
}


function* addContributorDocChecklist(action) {
  try {
    yield put({ type: SHOW_LOADER });
    let newAddedBorrowerPsntNum = 0;
    const dataToFetch = R.pathOr([], ['payload', 'contributorFields'], action);
    const data = yield select(incomeCalcSelectors.getChecklist);
    const loanNumber = yield select(dashboardSelectors.loanNumber);
    const user = yield select(loginSelectors.getUser);
    const rootIdFEUW = yield select(taskAndChecklistSelectors.getRootTaskId);
    const dbRecCreatedByUser = R.path(['userDetails', 'email'], user);
    const taskData = R.flatten(dataToFetch.map(taskCode => getTaskFromProcess(data, 'taskBlueprintCode', taskCode)));
    const taskValues = yield select(incomeCalcSelectors.getTaskValues);
    let contributorData = {};
    taskData.forEach((task) => {
      contributorData = { ...contributorData, [R.path(['taskBlueprint', 'additionalInfo', 'fieldName'], task)]: task.value };
    });
    const borrowerData = yield select(incomeCalcSelectors.getBorrowers);
    const borrowerlist = R.pathOr(null, ['value', 'borrowers'], data);
    const maxPositionNum = R.compose(
      R.prop('borrowerPstnNumber'),
      R.last,
      R.sortBy(R.prop('borrowerPstnNumber')),
    )(borrowerData);
    newAddedBorrowerPsntNum = maxPositionNum + 1;
    const payload = {
      contributorData: {
        ...contributorData,
        taxpyrIdVal: R.propOr('', 'DOC_ADD_CHK3', taskValues),
        loanNumber,
        dbRecCreatedByUser,
        borrowerPstnNumber: maxPositionNum + 1,
      },
      borrowerData,
      borrowerlist,
      rootId: rootIdFEUW,
    };
    const borrowersResponse = yield call(Api.callPost, '/api/financial-aggregator/incomeCalc/addContributor', payload);
    if (borrowersResponse) {
      const processId = yield select(incomeCalcSelectors.getProcessId);
      yield call(fetchChecklistDetails, { payload: processId });
      yield put({ type: SET_BORROWERS_DATA, payload: R.propOr([], 'response', borrowersResponse) });
    }
    yield put({ type: CLEAR_TASK_VALUE });
    yield put({ type: HIDE_LOADER });
    const evalId = yield select(dashboardSelectors.evalId);
    const loanType = yield select(dashboardSelectors.getLoanType);
    const waterfallId = yield select(dashboardSelectors.getWaterfallId);
    const payloadForCreateDoc = {
      borrowerPstnNumber: newAddedBorrowerPsntNum,
      evalId,
      loanId: loanNumber,
      loanType,
      requestedBy: dbRecCreatedByUser,
      waterfallId,
    };
    const addDocTxnsResponse = yield call(Api.callPost, '/api/dataservice/DocCheckList/createDocChecklist', payloadForCreateDoc);
    if (addDocTxnsResponse.length > 0) {
      let newData = yield call(Api.callGet, `/api/dataservice/DocCheckList/getDocTxns/${loanNumber}/${newAddedBorrowerPsntNum}`);
      newData = [newData];
      newData = preprocessDocChecklistData(newData);
      let docChecklistData = yield select(selectors.getDocChecklistData);
      docChecklistData = [...docChecklistData, ...newData];
      yield put({
        type: DOCUMENT_DETAILS_CHANGE_SAGA,
        payload: docChecklistData,
      });
    }
  } catch (e) {
    yield put({});
  }
}

function* watchLinkDocuments() {
  yield takeEvery(LINK_DOCUMENTS_SAGA, linkDocuments);
}

function* watchFetchFileNetData() {
  yield takeEvery(FETCH_FILENET_DATA, fetchFileNetData);
}

function* watchUnLinkDocuments() {
  yield takeEvery(UNLINK_DOCUMENTS_SAGA, unlinkDocuments);
}

function* watchBorrowerNames() {
  yield takeEvery(BORRORWERS_NAMES_SAGA, fetchBorrowersNames);
}

function* watchSetTag() {
  yield takeEvery(SET_TAG_SAGA, setTagData);
}

function* watchDocumentReviewStatusDropdown() {
  yield takeEvery(DOC_REVIEW_STATUS_DROPDOWN, fetchdocReviewStatusDropdown);
}

function* watchChangeDocDetails() {
  yield takeEvery(DOCUMENT_DETAILS_CHANGE, changeDocDetails);
}

function* watchFetchDocChecklistData() {
  yield takeEvery(FETCH_DOC_TXNS, fetchDocChecklistData);
}

function* watchSaveDocChecklistData() {
  yield takeEvery(SAVE_DOC_CHECKLIST_DATA, saveDocChecklistData);
}

function* watchDocValidation() {
  yield takeEvery(TRIGGER_DOC_VALIDATION, docValidation);
}

function* watchDefectReasonDropdown() {
  yield takeEvery(DEFECT_REASON_DROPDOWN, fetchDefectReasonDropdown);
}

function* watchFetchDocTransactionHistory() {
  yield takeEvery(FETCH_DOC_HISTORY, fetchDocTransactionHistory);
}

function* watchAddContributor() {
  yield takeEvery(DOC_CHECKLIST_ADD_CONTRIBUTOR, addContributorDocChecklist);
}

export const TestExports = {
  watchLinkDocuments,
  watchBorrowerNames,
  watchUnLinkDocuments,
  watchSetTag,
  watchDocumentReviewStatusDropdown,
  watchFetchDocChecklistData,
  watchSaveDocChecklistData,
  watchDefectReasonDropdown,
  watchFetchDocTransactionHistory,
};

export const combinedSaga = function* combinedSaga() {
  yield all([
    watchFetchFileNetData(),
    watchLinkDocuments(),
    watchBorrowerNames(),
    watchUnLinkDocuments(),
    watchSetTag(),
    watchDocumentReviewStatusDropdown(),
    watchChangeDocDetails(),
    watchFetchDocChecklistData(),
    watchSaveDocChecklistData(),
    watchDocValidation(),
    watchDefectReasonDropdown(),
    watchFetchDocTransactionHistory(),
    watchAddContributor(),
  ]);
};
