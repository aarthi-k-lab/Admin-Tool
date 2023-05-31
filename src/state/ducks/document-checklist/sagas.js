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
  DOC_HIST_ERROR, FILENET_TYPES_ERROR,
  DOC_UNLINK_ERROR,
} from '../../../constants/loanInfoComponents';
import {
  DECEASED_BORROWER, UNCLASSIFIED_DOC_TYPE, NOT_PROVIDED_STS,
  NOT_REVIEWED_STS,
  DEFECTS_STS,
} from '../../../constants/incomeCalc/DocumentList';
import {
  LINK_DOCUMENTS_SAGA, LINK_DOCUMENTS, BORRORWERS_NAMES_SAGA, BORRORWERS_NAMES,
  UNLINK_DOCUMENTS_SAGA, UNLINK_DOCUMENTS, SET_TAG_SAGA, SET_TAG, DOC_REVIEW_STATUS_DROPDOWN,
  SAVE_DOC_REVIEW_STATUS_DROPDOWN,
  FETCH_FILENET_DATA, SAVE_FILENET_DOC_CAT, SET_FILENET_DATA, SAVE_FILENET_DOC_TYPE,
  DOCUMENT_DETAILS_CHANGE,
  DOCUMENT_DETAILS_CHANGE_SAGA, FETCH_DOC_TXNS, DOC_CHECKLIST_DATA, SAVE_DOC_CHECKLIST_DATA,
  TRIGGER_DOC_VALIDATION, SET_ERROR_FIELDS, SAVE_DEFECT_REASON_DROPDOWN, DEFECT_REASON_DROPDOWN,
  FETCH_DOC_HISTORY, SET_DOC_HISTORY,
  DOC_CHECKLIST_ADD_CONTRIBUTOR, SET_LINK_DOC_STATUS, SET_INITIAL_DOC_CHK_DATA,
  FETCH_FILENET_CAT_TYPES, SET_FILENET_CAT_TYPES, FETCH_FILENET_TYPES, LOADER, DOC_CHK_SAVE_SUCCESS,
} from './types';
import {
  SET_BANNER_DATA, SET_BORROWERS_DATA, HIDE_LOADER, CLEAR_TASK_VALUE,
  SHOW_LOADER,
} from '../income-calculator/types';
import selectors from './selectors';
import { selectors as loginSelectors } from '../login';
import {
  SET_UPDATED_ASSUMPTORS, TOGGLE_VIEW,
} from '../tombstone/types';


function isRequiredSort(data) {
  data.sort((a, b) => b.required - a.required);
}

function* linkDocuments(payload) {
  const docChecklistData = yield select(selectors.getDocChecklistData);
  const documentName = yield select(selectors.getRadioSelect);
  const evalId = yield select(dashboardSelectors.evalId);
  const { payload: { checkedBorrowers, checkedFilenetDocs } } = payload;
  const documentsChecked = checkedFilenetDocs;
  const user = yield select(loginSelectors.getUser);
  const userPrincipalName = R.path(['userDetails', 'email'], user);
  const requestData = [];
  const requestDataTKAMS = [];
  const newData = docChecklistData ? docChecklistData.map((data) => {
    if (checkedBorrowers.includes(data.borrowerName)) {
      // eslint-disable-next-line no-unused-vars
      const newDocumentData = data.documents ? data.documents.map((document) => {
        if (documentName === document.documentName) {
          let dataForNewLinkDoc = {};
          let dataForNewLinkDocTKAMS = {};
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
            dataForNewLinkDocTKAMS = {
              docName: document.documentName,
              evalId,
              documents: newUniqueDocuments,
            };
            document.linkedDocuments = uniqueLinkedDocuments;
            if (document.documentReviewStatus === NOT_PROVIDED_STS) {
              if (document.linkedDocuments.length > 0) {
                document.documentReviewStatus = NOT_REVIEWED_STS;
              }
            }
          } else {
            document.linkedDocuments = [...documentsChecked];
            dataForNewLinkDoc = {
              docTxnId: document.docTxnId,
              documents: document.linkedDocuments,
            };
            dataForNewLinkDocTKAMS = {
              docName: document.documentName,
              evalId,
              documents: document.linkedDocuments,
            };
          }
          if (dataForNewLinkDoc.documents.length > 0) { document.agentName = userPrincipalName; }
          requestData.push(dataForNewLinkDoc);
          requestDataTKAMS.push(dataForNewLinkDocTKAMS);
        }
        return document;
      }) : [];
    }
    return data;
  }) : [];
  const response = yield call(Api.callPost, `/api/dataservice/DocCheckList/linkDocksAndDocTxn/${userPrincipalName}`, requestData);
  const tkamsResponse = yield call(Api.callPost, `/api/tkams/DocChecklist/linkDocuments/${userPrincipalName}`, requestDataTKAMS);
  if (response && tkamsResponse.status === 'Success') {
    let isSuccess = true;
    yield put({
      type: SET_LINK_DOC_STATUS,
      payload: isSuccess,
    });
    yield put({
      type: LINK_DOCUMENTS,
      payload: newData,
    });
    yield new Promise(resolve => setTimeout(() => {
      isSuccess = false;
      resolve();
    }, 5000));
    yield put({
      type: SET_LINK_DOC_STATUS,
      payload: isSuccess,
    });
  } else {
    yield put({
      type: LINK_DOCUMENTS,
      payload: newData,
    });
  }
}

function* unlinkDocuments(payload) {
  try {
    const docChecklistData = yield select(selectors.getDocChecklistData);
    const { payload: { checkedBorrowers, removalDocumentId, removalDocumentName } } = payload;
    const docTxnIds = [];
    const docNames = [];
    const evalId = yield select(dashboardSelectors.evalId);
    const user = yield select(loginSelectors.getUser);
    const userPrincipalName = R.path(['userDetails', 'email'], user);
    const newData = docChecklistData ? docChecklistData.map((data) => {
      if (checkedBorrowers.includes(data.borrowerName)) {
      // eslint-disable-next-line no-unused-vars
        const newDocumentData = data.documents ? data.documents.map((document) => {
          if (removalDocumentName === document.documentName) {
            docTxnIds.push(document.docTxnId);
            docNames.push(document.documentName);
            document.agentName = userPrincipalName;
            document.linkedDocuments = document.linkedDocuments
              .filter(doc => doc.fileNetDocId !== removalDocumentId);
            if (document.linkedDocuments.length === 0) {
              document.documentReviewStatus = NOT_PROVIDED_STS;
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
    const payloadTKAMS = {
      docNames,
      evalId,
      fileNetDocId: removalDocumentId,
    };
    const response = yield call(Api.callPost, `/api/dataservice/DocCheckList/unlinkDocsAndDocTxn/${userPrincipalName}`, payLoad);
    const responseTKAMS = yield call(Api.callPost, '/api/tkams/DocChecklist/unlinkDocuments', payloadTKAMS);
    if (response.status && responseTKAMS.status === 'Success') {
      yield put({
        type: UNLINK_DOCUMENTS,
        payload: newData,
      });
    } else {
      yield put({
        type: SET_RESULT_OPERATION,
        payload: {
          level: ERROR,
          status: DOC_UNLINK_ERROR,
        },
      });
    }
  } catch (e) {
    yield put({
      type: SET_RESULT_OPERATION,
      payload: {
        level: ERROR,
        status: DOC_UNLINK_ERROR,
      },
    });
  }
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
      isRequiredSort(data.documents);
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
    const type = R.propOr('', 'payload', payload);
    let response = yield call(Api.callGet, `/api/dataservice/api/classCodes/${type}`);
    if (type === 'Doc Review Status') {
      if (response && response.length > 0) {
        response = R.map(responseMapper, response);
      }
      yield put({
        type: SAVE_DOC_REVIEW_STATUS_DROPDOWN,
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
      isRequiredSort(borrData.documents);
      borrData.documents.map((document) => {
        if ((R.isNil(document.documentReviewStatus)
        || R.isEmpty(document.documentReviewStatus))
        || (R.isEmpty(document.linkedDocuments)
        && (document.documentReviewStatus === NOT_REVIEWED_STS
          || document.documentReviewStatus === DEFECTS_STS))) {
          document.documentReviewStatus = NOT_PROVIDED_STS;
        }
        if ((!R.isEmpty(document.linkedDocuments)
        && document.documentReviewStatus === NOT_PROVIDED_STS)) {
          document.documentReviewStatus = NOT_REVIEWED_STS;
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
    const initialData = JSON.parse(JSON.stringify(data));
    if (data) { preprocessDocChecklistData(data); }
    yield put({
      type: DOC_CHECKLIST_DATA,
      payload: data,
    });
    yield put({
      type: SET_INITIAL_DOC_CHK_DATA,
      payload: initialData,
    });
    yield put({
      type: LOADER,
      payload: false,
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
function processUpdatedData(oldData, newData) {
  const request = [];
  for (let i = 0; i < newData.length; i += 1) {
    const oldDocuments = R.propOr([], 'documents', R.find(R.propEq('borrowerName', newData[i].borrowerName))(oldData));
    const newDocuments = R.propOr([], 'documents', R.find(R.propEq('borrowerName', newData[i].borrowerName))(newData));
    for (let j = 0; j < oldDocuments.length; j += 1) {
      const oldDoc = oldDocuments[j];
      const newDoc = R.find(R.propEq('docTxnId', oldDoc.docTxnId))(newDocuments);
      const isTrue = R.eqProps('documentReviewStatus', oldDoc, newDoc)
      && R.eqProps('comments', oldDoc, newDoc)
      && R.eqProps('expirationDate', oldDoc, newDoc)
      && R.eqProps('docReasons', oldDoc, newDoc)
      && R.eqProps('required', oldDoc, newDoc);
      if (!isTrue) {
        const obj = newDoc;
        obj.toDeleteDefectReasons = [];
        obj.toAddDefectReasons = [];
        if (!R.eqProps('docReasons', oldDoc, newDoc)) {
          const toDeleteDefectReasons = R.difference(oldDoc.docReasons, newDoc.docReasons);
          const toAddDefectReasons = R.difference(newDoc.docReasons, oldDoc.docReasons);
          obj.toDeleteDefectReasons = toDeleteDefectReasons;
          obj.toAddDefectReasons = toAddDefectReasons;
        }
        request.push(obj);
      }
    }
  }
  return request;
}

function* saveDocChecklistData() {
  try {
    const user = yield select(loginSelectors.getUser);
    const userPrincipalName = R.path(['userDetails', 'email'], user);
    const initialData = yield select(selectors.getInitialDocChecklistData);
    const updatedData = yield select(selectors.getDocChecklistData);
    const processedBorrower = yield select(incomeCalcSelectors.getBorrowers);
    const data = processUpdatedData(initialData, updatedData);
    const evalId = yield select(dashboardSelectors.evalId);
    const doxTxnIdList = data.map(d => d.docTxnId);
    const borrowerTxnArr = [];
    doxTxnIdList.map((val) => {
      updatedData.map((docObj) => {
        const docTxnId = R.find(R.propEq('docTxnId', val))(docObj.documents);
        if (docTxnId) {
          borrowerTxnArr.push({ docTxnId: val, borrowerName: docObj.borrowerName });
        }
        return docTxnId;
      });
      return val;
    });
    const borrDescList = processedBorrower.map(b => ({ borrowerName: `${b.firstName}_${b.borrowerPstnNumber}`, description: b.description }));
    const payload = data.map((doc) => {
      const borrTxnObj = R.find(R.propEq('docTxnId', doc.docTxnId))(borrowerTxnArr);
      const borrDescObj = R.find(R.propEq('borrowerName', borrTxnObj.borrowerName))(borrDescList);
      const obj = {
        docTxnId: doc.docTxnId,
        agentName: userPrincipalName,
        comments: doc.comments,
        docReviewStatus: doc.documentReviewStatus,
        toAddDefectReasons: doc.toAddDefectReasons,
        toDeleteDefectReasons: doc.toDeleteDefectReasons,
        expirationDate: doc.expirationDate ? moment(doc.expirationDate).format('YYYY-MM-DD') : null,
        isRequired: doc.required ? 1 : 0,
        description: borrDescObj.description,
        docName: doc.documentName,
        evalId,
      };
      return obj;
    });
    const response = yield call(Api.callPost, '/api/dataservice/DocCheckList/saveDocDetails', payload);
    const responseTkams = yield call(Api.callPost, '/api/tkams/DocChecklist/saveDocDetails', payload);
    if (response.updateStatus && responseTkams.status === 'Success') {
      yield put({
        type: DOC_CHK_SAVE_SUCCESS,
      });
      yield put({
        type: DOC_CHECKLIST_DATA,
        payload: [],
      });
      yield put({
        type: SET_INITIAL_DOC_CHK_DATA,
        payload: [],
      });
      yield call(fetchDocChecklistData);
    }
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
    if (!borrData.borrowerName.includes(DECEASED_BORROWER)) {
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
    }
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
    let defectReasons = yield select(selectors.getDefectReasonDropdown);
    const type = R.propOr('', 'payload', payload);
    const response = yield call(Api.callPost, '/api/dataservice/api/getDefectReasonBydocType', { docName: type });
    defectReasons = { ...defectReasons, [type]: response };
    yield put({
      type: SAVE_DEFECT_REASON_DROPDOWN,
      payload: defectReasons,
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


function* addContributorDocChecklist(action) {
  try {
    yield put({ type: SHOW_LOADER });
    let newAddedBorrowerPsntNum = 0;
    const loanNumber = yield select(dashboardSelectors.loanNumber);
    const groupName = yield select(dashboardSelectors.groupName);
    const user = yield select(loginSelectors.getUser);
    const dbRecCreatedByUser = R.path(['userDetails', 'email'], user);
    const borrowerData = yield select(incomeCalcSelectors.getBorrowers);
    const maxPositionNum = R.compose(
      R.prop('borrowerPstnNumber'),
      R.last,
      R.sortBy(R.prop('borrowerPstnNumber')),
    )(borrowerData);
    newAddedBorrowerPsntNum = maxPositionNum + 1;
    const payload = {
      contributorData: {
        ...action.payload,
        loanNumber,
        dbRecCreatedByUser,
        borrowerPstnNumber: maxPositionNum + 1,
      },
      borrowerData,
      borrowerlist: null,
      rootId: null,
      groupName,
    };
    const borrowersResponse = yield call(Api.callPost, '/api/financial-aggregator/incomeCalc/addContributor', payload);
    if (borrowersResponse) {
      const borrowersData = R.propOr([], 'response', borrowersResponse);
      const assumptors = borrowersData.filter(borrower => borrower.description.includes('Assumptor')).map(({ firstName, lastName }) => `${firstName} ${lastName}`).join('\n');
      yield put({ type: SET_BORROWERS_DATA, payload: borrowersData });
      yield put({ type: SET_UPDATED_ASSUMPTORS, payload: assumptors });
      yield put({
        type: TOGGLE_VIEW,
      });
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
      let initialDocChecklistData = yield select(selectors.getInitialDocChecklistData);
      docChecklistData = [...docChecklistData, ...newData];
      initialDocChecklistData = [...initialDocChecklistData,
        ...JSON.parse(JSON.stringify(newData))];
      yield put({
        type: DOCUMENT_DETAILS_CHANGE_SAGA,
        payload: docChecklistData,
      });
      yield put({
        type: SET_INITIAL_DOC_CHK_DATA,
        payload: initialDocChecklistData,
      });
    }
  } catch (e) {
    yield put({});
  }
}

function* fetchFilenetCategoryType() {
  try {
    const Brand = yield select(dashboardSelectors.brand);
    let response = yield call(Api.callGet, '/api/document/api/FileNet/GetFileNetDocumentTypes', { Brand });
    if (response) {
      response = [...response, UNCLASSIFIED_DOC_TYPE];
      const categories = response.map(category => (category.docTypeCategory));
      yield put({
        type: SET_FILENET_CAT_TYPES,
        payload: response,
      });
      yield put({
        type: SAVE_FILENET_DOC_CAT,
        payload: categories,
      });
    }
  } catch (e) {
    yield put({
      type: SET_RESULT_OPERATION,
      payload: {
        level: ERROR,
        status: FILENET_TYPES_ERROR,
      },
    });
  }
}

function* fetchFilenetType(payload) {
  try {
    const filenetCatTypes = yield select(selectors.getFilenetCatTypes);
    const category = R.propOr('', 'payload', payload);
    const types = R.propOr([], 'docTypes', R.find(R.propEq('docTypeCategory',
      category))(filenetCatTypes));
    yield put({
      type: SAVE_FILENET_DOC_TYPE,
      payload: types,
    });
  } catch (e) {
    yield put({
      type: SET_RESULT_OPERATION,
      payload: {
        level: ERROR,
        status: FILENET_TYPES_ERROR,
      },
    });
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

function* watchFetchFilenetCatTypes() {
  yield takeEvery(FETCH_FILENET_CAT_TYPES, fetchFilenetCategoryType);
}

function* watchFetchFilenetTypes() {
  yield takeEvery(FETCH_FILENET_TYPES, fetchFilenetType);
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
  watchFetchFilenetCatTypes,
  watchFetchFilenetTypes,
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
    watchFetchFilenetCatTypes(),
    watchFetchFilenetTypes(),
  ]);
};
