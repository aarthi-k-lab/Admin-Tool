/* eslint-disable import/prefer-default-export */
import {
  takeEvery, all, put,
  call,
  select,
} from 'redux-saga/effects';
import * as R from 'ramda';
import * as Api from 'lib/Api';
import { actions as tombStoneActions } from 'ducks/tombstone/index';
import { selectors as indexerSelectors } from 'ducks/indexer/index';
import {
  SAVE_EVAL_DETAILS,
  SHOW_LOADER,
  HIDE_LOADER, SET_RESULT_OPERATION,
} from 'ducks/dashboard/types';
import {
  SET_BORROWERS_DATA,
} from 'ducks/income-calculator/types';
import {
  SET_SELECTED_BORROWER,
} from 'ducks/document-checklist/types';
import {
  ERROR,
} from 'constants/common';
import DashboardModel from '../../../models/Dashboard';
import {
  FETCH_TOMBSTONE_DATA, UPDATE_EVAL_LSAMSDETAILS, FETCH_GRID_DATA,
  SET_INDEXER_GRID_DATA,
} from './types';

const {
  Messages:
  {
    LEVEL_FAILED,
  },
} = DashboardModel;

function* generateTombstoneData(action) {
  const indexerData = yield select(indexerSelectors.getIndexerGridData);

  const indexerGridResponse = R.propOr([], 'indexerDetailsList', indexerData);

  const loanNumber = action.payload;

  const constructPayload = val => ({
    loanNumber: val.loanId,
    taskId: val.taskId,
    evalId: val.evalId,
    selectedResolutionId: val.resolutionId,
    processId: val.processId,
  });

  const payload = R.head(indexerGridResponse.filter(val => val.loanId === +loanNumber)
    .map(constructPayload));

  yield put({
    type: SAVE_EVAL_DETAILS,
    payload,
  });

  yield put(tombStoneActions.fetchTombstoneData());

  yield put({ type: SHOW_LOADER });
  const borrowerDetails = yield call(Api.callGet,
    `/api/financial-aggregator/financecalc/getBorrowerDetails/${loanNumber}/${payload.processId}`);
  if (borrowerDetails.status === 200) {
    const borrowerData = R.pathOr([], ['response', 'processedBorrowerData'], borrowerDetails);

    yield put({ type: SET_BORROWERS_DATA, payload: borrowerData });

    const initialBorrowerDataByPstnNumber = R.find(R.propEq('borrowerPstnNumber', 1))(borrowerData);

    const firstName = R.propOr('', 'firstName', initialBorrowerDataByPstnNumber);
    const pstnNumber = R.propOr('', 'borrowerPstnNumber', initialBorrowerDataByPstnNumber);

    yield put({ type: SET_SELECTED_BORROWER, payload: { selectedBorrower: `${firstName}_${pstnNumber}` } });
  } else {
    yield put({ type: SET_BORROWERS_DATA, payload: [] });
  }
  yield put({ type: HIDE_LOADER });
}
function* updateEvalLSAMSDetails(action) {
  try {
    const response = yield call(Api.callPost, '/api/disposition/updateLSAMSDetails', action.payload);
    if (!response || (response && R.has(ERROR, response))) {
      yield put({
        type: SET_RESULT_OPERATION,
        payload: {
          status: 'Failed to save!',
          level: LEVEL_FAILED,
          saga: 'lsamsUpdate',
        },
      });
    } else {
      yield put({
        type: SET_RESULT_OPERATION,
        payload: {
          status: 'Successfully saved to LSAMS!',
          level: 'Success',
          saga: 'lsamsUpdate',
        },
      });
    }
  } catch (e) {
    yield put({
      type: SET_RESULT_OPERATION,
      payload: {
        status: 'Failed to save!',
        level: LEVEL_FAILED,
        saga: 'lsamsUpdate',
      },
    });
  }
}

function* gatherGridData(action) {
  const { pageNumber, pageSize } = action.payload;
  try {
    yield put({ type: SHOW_LOADER });
    console.log(pageNumber, pageSize);
    const response = yield call(Api.callGet, `/api/data-aggregator/indexer?pageNumber=${pageNumber}&pageSize=${pageSize}`);
    if (response) {
      yield put({
        type: SET_INDEXER_GRID_DATA,
        payload: response,
      });
    } else {
      yield put({
        type: SET_RESULT_OPERATION,
        payload: {
          status: 'Failed to fetch Data!',
          level: LEVEL_FAILED,
        },
      });
    }
    yield put({ type: HIDE_LOADER });
  } catch (e) {
    yield put({
      type: SET_RESULT_OPERATION,
      payload: {
        status: 'Something went wrong while fetching Data!',
        level: LEVEL_FAILED,
      },
    });
  }
}

function* watchGenerateTombstoneData() {
  yield takeEvery(FETCH_TOMBSTONE_DATA, generateTombstoneData);
}

function* watchUpdateLSAMSDetails() {
  yield takeEvery(UPDATE_EVAL_LSAMSDETAILS, updateEvalLSAMSDetails);
}

function* watchFetchGridDetails() {
  yield takeEvery(FETCH_GRID_DATA, gatherGridData);
}


export function* combinedSaga() {
  yield all([
    watchGenerateTombstoneData(), watchUpdateLSAMSDetails(),
    watchFetchGridDetails(),
  ]);
}
