/* eslint-disable import/prefer-default-export */
import {
  select, takeEvery, all, call, put,
} from 'redux-saga/effects';
import * as R from 'ramda';
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
import { DOCS_IN } from 'constants/appGroupName';
import selectors from './selectors';
import {
  TOGGLE_WIDGET_SAGA,
  WIDGET_TOGGLE,
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


function* watchWidgetToggle() {
  yield takeEvery(TOGGLE_WIDGET_SAGA, widgetToggle);
}


export function* combinedSaga() {
  yield all([
    watchWidgetToggle(),
  ]);
}
