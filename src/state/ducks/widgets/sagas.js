/* eslint-disable import/prefer-default-export */
import {
  select, takeEvery, all, call, put,
} from 'redux-saga/effects';
import * as R from 'ramda';
import * as Api from 'lib/Api';
import {
  assignBookingLoan,
  unassignBookingLoan,
  additionalInfo,
  onFhlmcCasesBulkSubmit,
  setRequestTypeDataAction,
  setSelectedCancellationReason,
} from 'ducks/dashboard/actions';
import { actions as tombStoneActions } from 'ducks/tombstone/index';
import { getIncomeCalcChecklist } from 'ducks/income-calculator/actions';
import {
  BOOKING, HISTORY, ADDITIONAL_INFO, FINANCIAL_CALCULATOR, FHLMC,
} from 'constants/widgets';
import dashboardSelectors from 'ducks/dashboard/selectors';
import loginSelectors from 'ducks/login/selectors';
import { DOCS_IN } from 'constants/appGroupName';
import {
  SET_POPUP_DATA,
} from 'ducks/dashboard/types';
import WestWingWidget from 'models/WestWing/WestWingWidget';
import WestWingRepay from 'models/WestWing/WestWingRepay';
import WestWingForb from 'models/WestWing/WestWingForb';
import selectors from './selectors';
import {
  TOGGLE_WIDGET_SAGA,
  WIDGET_TOGGLE,
  WEST_WING_POPUP,
  FETCH_WEST_WING_DATA,
  SET_WEST_WING_DATA,
  SAVE_WEST_WING_WIDGET,
  FETCH_WEST_WING_REPAY_FORB_DATA,
  SET_WEST_WING_REPAY_FORB_DATA,
  SAVE_WEST_WING_REPAY_FORB_DATA,
} from './types';


function* toggleBookingWidget(rightAppBarOpen) {
  const groupName = yield select(dashboardSelectors.groupName);
  if (rightAppBarOpen && R.equals(groupName, DOCS_IN)) {
    yield put(assignBookingLoan());
  } else {
    yield put(unassignBookingLoan());
  }
}

function* toggleAdditionalInfoWidget(rightAppBarOpen, data) {
  const loanNumber = yield select(dashboardSelectors.loanNumber);
  if (rightAppBarOpen) {
    yield put(additionalInfo(loanNumber));
  } if ((!data || data.length === 0) && !rightAppBarOpen) {
    yield put(tombStoneActions.fetchTombstoneData());
  }
}


function* getCaseDetails(rightAppBarOpen) {
  if (rightAppBarOpen) {
    const resolutionId = yield select(dashboardSelectors.resolutionId);
    yield put(setRequestTypeDataAction(''));
    yield put(setSelectedCancellationReason(''));
    const payload = {
      caseIds: [resolutionId],
      requestIdType: 'Case id(s)',
    };
    yield put(onFhlmcCasesBulkSubmit(payload));
  }
}

function* getRightAppBarAction(request) {
  const {
    isOpen,
    currentWidget,
    data,
  } = request;
  // const group = yield select(dashboardSelectors.groupName);
  switch (currentWidget) {
    case FINANCIAL_CALCULATOR:
      yield put(getIncomeCalcChecklist({ isOpen, calcType: 'incomeCalcData' }));
      break;
    case BOOKING:
      yield call(toggleBookingWidget, isOpen);
      break;
    case ADDITIONAL_INFO:
      yield call(toggleAdditionalInfoWidget, isOpen, data);
      break;
    case HISTORY:
      break;
    case FHLMC:
      yield call(getCaseDetails, isOpen);
      break;
    default: break;
  }
}

function* widgetToggle(action) {
  const {
    currentWidget,
    openWidgetList,
    page,
    data,
  } = action.payload;
  const currentSelection = {
    currentWidget,
    openWidgetList,
    isOpen: true,
    page,
    data,
  };
  const prevOpenWidgetList = yield select(selectors.getOpenWidgetList);
  const deSelectionWidgets = R.difference(prevOpenWidgetList, openWidgetList);
  yield put({ type: WIDGET_TOGGLE, payload: currentSelection });
  if (!R.isEmpty(deSelectionWidgets)) {
    yield all(R.map((widget) => {
      const deselection = {
        isOpen: false,
        currentWidget: widget,
        data,
      };
      return call(getRightAppBarAction, deselection);
    }, deSelectionWidgets));
  }
  if (!R.contains(currentWidget, prevOpenWidgetList)) {
    yield call(getRightAppBarAction, currentSelection);
  }
}

function* westWingPopup({ payload }) {
  const msg = payload;
  const lvl = msg !== '' ? 'Error' : 'Success';
  const ttl = msg !== '' ? 'Error' : 'Success!!!';
  yield put({
    type: SET_POPUP_DATA,
    payload: {
      message: msg,
      level: lvl,
      title: ttl,
    },
  });
}

function* fetchWestWingWidgetData() {
  const loanNumber = yield select(dashboardSelectors.loanNumber);
  const resolutionId = yield select(dashboardSelectors.resolutionId);
  const evalId = yield select(dashboardSelectors.evalId);
  const data = yield call(WestWingWidget.fetchWestWingWidgetData, loanNumber, evalId, resolutionId);
  yield put({
    type: SET_WEST_WING_DATA,
    payload: data,
  });
}

function* saveWestWingWidgetData(action) {
  const comments = action.payload;
  if (R.isEmpty(comments)) {
    yield put({
      type: SET_POPUP_DATA,
      payload: {
        message: 'Comment(s) are Mandatory',
        level: 'Error',
        title: 'Failed',
      },
    });
  } else {
    const westWingWidgetData = yield select(selectors.getWestWingWidgetData);
    const email = yield select(loginSelectors.getUserPrincipalName);
    const resolutionId = yield select(dashboardSelectors.resolutionId);
    const evalId = yield select(dashboardSelectors.evalId);
    const workoutType = yield select(dashboardSelectors.getWorkoutType);
    const { requestData } = westWingWidgetData;
    const {
      loanModificationSods,
      loanModificationTkams,
      customerFinance,
      documents,
    } = requestData;
    const { locked } = loanModificationTkams;
    if (locked === 0) {
      yield put({
        type: SET_POPUP_DATA,
        payload: {
          message: 'Case is not Locked in Remedy',
          level: 'Error',
          title: 'Failed',
        },
      });
    } else {
      const westWingData = { ...loanModificationSods, ...loanModificationTkams };
      westWingData.dealComment = comments;
      westWingData.workoutType = workoutType;
      westWingData.caseId = resolutionId;
      westWingData.evalId = evalId;
      const payload = {
        loanModification: westWingData,
        customerFinance,
        documents,
        userName: email,
      };
      const saveResponse = yield call(Api.callPost, '/api/dataservice/westwing/saveModTrial', payload);
      if (saveResponse) {
        yield put({
          type: SET_POPUP_DATA,
          payload: {
            message: 'Sent SuccessFully',
            level: 'Success',
            title: 'Success',
          },
        });
        yield call(fetchWestWingWidgetData);
      } else {
        yield put({
          type: SET_POPUP_DATA,
          payload: {
            message: 'Error while Saving west wing',
            level: 'Error',
            title: 'Failed',
          },
        });
      }
    }
  }
}


function* fetchWestWingFrobRepayData(action) {
  const { idType, loanNumber } = action.payload;
  let data = {};
  if (idType === 'Forbearance') {
    data = yield call(WestWingForb.fetchWestWingForb, loanNumber);
  } else {
    const type = R.equals('Repayment Plan', idType) ? 'repaymentPlan' : 'disasterRepayment';
    data = yield call(WestWingRepay.fetchWestWingRepay, loanNumber, type);
  }
  const { fetchStatus } = data;
  if (!fetchStatus) {
    yield put({
      type: SET_POPUP_DATA,
      payload: {
        message: 'Invalid Loan Number',
        level: 'Error',
        title: 'Failed',
      },
    });
  }
  yield put({
    type: SET_WEST_WING_REPAY_FORB_DATA,
    payload: data,
  });
}


function* saveWestWingForbRepayData(action) {
  const { idType, comments, loanNumber } = action.payload;
  if (R.isEmpty(comments)) {
    yield put({
      type: SET_POPUP_DATA,
      payload: {
        message: 'Comment(s) are Mandatory',
        level: 'Error',
        title: 'Failed',
      },
    });
  } else {
    const westWingForbRepay = yield select(selectors.getWestWingForbRepay);
    const email = yield select(loginSelectors.getUserPrincipalName);
    const { requestData } = westWingForbRepay;
    if (idType === 'Forbearance') {
      const {
        westWingForbearanceSods, westWingForbearanceTkams,
        customerFinance,
      } = requestData;
      const { locked } = westWingForbearanceTkams;
      if (locked === 0) {
        yield put({
          type: SET_POPUP_DATA,
          payload: {
            message: 'Case is not Locked in Remedy',
            level: 'Error',
            title: 'Failed',
          },
        });
      } else {
        const forbData = { ...westWingForbearanceSods, ...westWingForbearanceTkams };
        forbData.dealComment = comments;
        forbData.evalId = 0;
        const payload = {
          forbData,
          customerFinance,
          userName: email,
        };
        const saveResponse = yield call(Api.callPost, '/api/dataservice/westwing/saveWestWingForbearance', payload);
        if (saveResponse) {
          yield put({
            type: SET_POPUP_DATA,
            payload: {
              message: 'Sent SuccessFully',
              level: 'Success',
              title: 'Success',
            },
          });
          yield call(fetchWestWingFrobRepayData, { payload: { idType, loanNumber } });
        } else {
          yield put({
            type: SET_POPUP_DATA,
            payload: {
              message: 'Error while Saving west wing',
              level: 'Error',
              title: 'Failed',
            },
          });
        }
      }
    } else {
      const {
        wwRepaymentSODSRes, westWingRepaymentTkamsResponse,
        customerFinance,
      } = requestData;
      const { locked } = westWingRepaymentTkamsResponse;
      if (locked === 0) {
        yield put({
          type: SET_POPUP_DATA,
          payload: {
            message: 'Case is not Locked in Remedy',
            level: 'Error',
            title: 'Failed',
          },
        });
      } else {
        const repaymentData = { ...wwRepaymentSODSRes, ...westWingRepaymentTkamsResponse };
        repaymentData.dealComment = comments;
        const payload = {
          repaymentData,
          customerFinance,
          userName: email,
        };
        const saveResponse = yield call(Api.callPost, '/api/dataservice/westwing/saveWestWingRepayment', payload);
        if (saveResponse) {
          yield put({
            type: SET_POPUP_DATA,
            payload: {
              message: 'Sent SuccessFully',
              level: 'Success',
              title: 'Success',
            },
          });
          yield call(fetchWestWingFrobRepayData, { payload: { idType, loanNumber } });
        } else {
          yield put({
            type: SET_POPUP_DATA,
            payload: {
              message: 'Error while Saving west wing',
              level: 'Error',
              title: 'Failed',
            },
          });
        }
      }
    }
  }
}


function* watchWidgetToggle() {
  yield takeEvery(TOGGLE_WIDGET_SAGA, widgetToggle);
}

function* watchWestWingPopup() {
  yield takeEvery(WEST_WING_POPUP, westWingPopup);
}

function* watchFetchWestWingWidgetData() {
  yield takeEvery(FETCH_WEST_WING_DATA, fetchWestWingWidgetData);
}

function* watchSaveWestWingWidgetData() {
  yield takeEvery(SAVE_WEST_WING_WIDGET, saveWestWingWidgetData);
}

function* watchFetchWestWingFrobRepayData() {
  yield takeEvery(FETCH_WEST_WING_REPAY_FORB_DATA, fetchWestWingFrobRepayData);
}

function* watchSaveWestWingFrobRepayData() {
  yield takeEvery(SAVE_WEST_WING_REPAY_FORB_DATA, saveWestWingForbRepayData);
}

export function* combinedSaga() {
  yield all([
    watchWidgetToggle(),
    watchWestWingPopup(),
    watchFetchWestWingWidgetData(),
    watchSaveWestWingWidgetData(),
    watchFetchWestWingFrobRepayData(),
    watchSaveWestWingFrobRepayData(),
  ]);
}
