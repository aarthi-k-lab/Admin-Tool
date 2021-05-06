/* eslint-disable import/prefer-default-export */
import {
  select, takeEvery, all, call, put,
} from 'redux-saga/effects';
import * as R from 'ramda';
import { assignBookingLoan, unassignBookingLoan, additionalInfo } from 'ducks/dashboard/actions';
import { getIncomeCalcChecklist } from 'ducks/income-calculator/actions';
import {
  BOOKING, HISTORY, ADDITIONAL_INFO, INCOME_CALCULATOR,
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

function* toggleAdditionalInfoWidget(rightAppBarOpen) {
  const loanNumber = yield select(dashboardSelectors.loanNumber);
  if (rightAppBarOpen) {
    yield put(additionalInfo(loanNumber));
  }
}

function* getRightAppBarAction(request) {
  const {
    isOpen,
    currentWidget,
  } = request;
  switch (currentWidget) {
    case INCOME_CALCULATOR:
      yield put(getIncomeCalcChecklist(isOpen));
      break;
    case BOOKING:
      yield call(toggleBookingWidget, isOpen);
      break;
    case ADDITIONAL_INFO:
      yield call(toggleAdditionalInfoWidget, isOpen);
      break;
    case HISTORY:
      break;
    default: break;
  }
}

function* widgetToggle(action) {
  const {
    currentWidget,
    openWidgetList,
    page,
  } = action.payload;
  const currentSelection = {
    currentWidget,
    openWidgetList,
    isOpen: true,
    page,
  };
  const prevOpenWidgetList = yield select(selectors.getOpenWidgetList);
  const deSelectionWidgets = R.difference(prevOpenWidgetList, openWidgetList);
  if (!R.isEmpty(deSelectionWidgets)) {
    yield all(R.map((widget) => {
      const deselection = {
        isOpen: false,
        currentWidget: widget,
      };
      return call(getRightAppBarAction, deselection);
    }, deSelectionWidgets));
  }
  if (!R.contains(currentWidget, prevOpenWidgetList)) {
    yield call(getRightAppBarAction, currentSelection);
  }
  yield put({ type: WIDGET_TOGGLE, payload: currentSelection });
}


function* watchWidgetToggle() {
  yield takeEvery(TOGGLE_WIDGET_SAGA, widgetToggle);
}


export function* combinedSaga() {
  yield all([
    watchWidgetToggle(),
  ]);
}
