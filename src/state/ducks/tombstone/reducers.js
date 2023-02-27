import * as R from 'ramda';
import {
  LOADING_TOMBSTONE_DATA,
  ERROR_LOADING_TOMBSTONE_DATA,
  SUCCESS_LOADING_TOMBSTONE_DATA,
  SET_RFDTABLE_DATA,
  SET_RFD_DROPDOWN_DATA,
  SAVE_RFD_REQUEST,
  SAVE_RFD_RESPONSE,
  TOGGLE_LOADER,
  CLEAR_TOMBSTONE_DATA,
  APPEND_RFD_SAVE_DATA,
  SET_CHECKLIST_CENTERPANE,
  TOGGLE_VIEW,
  SAVE_PROPERTY_PRIMARY_USE_DROPDOWN,
  POPULATE_COLLATERAL_DATA,
  SET_PANDEMIC_FLAG,
  UPDATE_RFD,
  POPULATE_LIEN_BALANCES,
  POPULATE_PROPERTY_VALUATIONS,
  UPDATE_OCCUPANCY,
  UPDATE_CONSOLIDATE_EXPENSE_DATA,
} from './types';

const loadingState = {
  loading: true,
  error: false,
  data: [],
  selectedView: 'loanView',
};

const errorState = {
  loading: false,
  error: true,
  data: [],
};

Object.freeze(loadingState);
Object.freeze(loadingState.data);
Object.freeze(errorState);
Object.freeze(errorState.data);

const reducer = (state = loadingState, action) => {
  switch (action.type) {
    case CLEAR_TOMBSTONE_DATA: {
      return loadingState;
    }
    case LOADING_TOMBSTONE_DATA: {
      return loadingState;
    }
    case ERROR_LOADING_TOMBSTONE_DATA: {
      return {
        ...state,
        loading: action.payload.loading,
        error: action.payload.error,
        data: action.payload.data,
      };
    }
    case SUCCESS_LOADING_TOMBSTONE_DATA: {
      return {
        ...state,
        loading: false,
        error: false,
        viewTypeData: action.payload,
        data: action.payload.loanViewData,
      };
    }

    case TOGGLE_VIEW: {
      const { selectedView, viewTypeData } = state;
      const viewType = selectedView === 'loanView' ? 'modView' : 'loanView';
      return {
        ...state,
        selectedView: viewType,
        data: viewType === 'loanView' ? [...viewTypeData.loanViewData] : [...viewTypeData.modViewData],
      };
    }
    case SET_RFDTABLE_DATA: {
      const rfdTableData = action.payload;
      return {
        ...state,
        rfdTableData,
      };
    }

    case SET_RFD_DROPDOWN_DATA: {
      const reasonDescriptionOptions = action.payload;
      return {
        ...state,
        reasonDescriptionOptions,
      };
    }

    case SAVE_RFD_REQUEST: {
      const saveResponseRFD = action.payload;
      return {
        ...state,
        saveResponseRFD,
      };
    }
    case SAVE_RFD_RESPONSE: {
      const response = action.payload;
      return {
        ...state,
        rfdResult: response,
      };
    }
    case TOGGLE_LOADER: {
      const toggle = action.payload;
      return {
        ...state,
        loader: toggle,
      };
    }
    case APPEND_RFD_SAVE_DATA: {
      const recentSavedRFD = action.payload;
      if (state.rfdTableData) {
        return {
          ...state,
          rfdTableData: R.insert(0, recentSavedRFD, state.rfdTableData),
        };
      }
      return {
        ...state,
        rfdTableData: [recentSavedRFD],
      };
    }
    case SET_CHECKLIST_CENTERPANE: {
      const checklistCenterPaneView = action.payload;
      return {
        ...state,
        checklistCenterPaneView,
      };
    }
    case SET_PANDEMIC_FLAG: {
      const pandemicFlag = action.payload;
      return {
        ...state,
        pandemicFlag,
      };
    }
    case SAVE_PROPERTY_PRIMARY_USE_DROPDOWN: {
      const { payload } = action;
      return {
        ...state,
        primaryUse: payload,
      };
    }


    case POPULATE_COLLATERAL_DATA: {
      const { payload } = action;
      return {
        ...state,
        collateralData: payload,
      };
    }

    case POPULATE_LIEN_BALANCES: {
      const { payload } = action;
      return {
        ...state,
        lienLoanBalance: payload,
      };
    }

    case POPULATE_PROPERTY_VALUATIONS: {
      const { payload } = action;
      return {
        ...state,
        propertyValuations: payload,
      };
    }

    case UPDATE_RFD: {
      const rfdValue = action.payload;
      const { viewTypeData, selectedView } = state;
      const viewType = selectedView === 'loanView' ? 'modView' : 'loanView';
      const rfdIndex = R.findIndex(R.propEq('title', 'Reason for Default'), viewTypeData.loanViewData);
      viewTypeData.loanViewData[rfdIndex].content = rfdValue;
      return {
        ...state,
        viewTypeData,
        selectedView: viewType,
        data: viewTypeData.loanViewData,
      };
    }

    case UPDATE_CONSOLIDATE_EXPENSE_DATA: {
      const expenseResult = action.payload;
      const {
        grossIncome, netIncome, monthlyDebt, disposableIncome, debtCoverageRatio,
      } = expenseResult;
      const { viewTypeData, selectedView } = state;
      const viewType = selectedView === 'loanView' ? 'modView' : 'loanView';
      const grossIncomeIndex = R.findIndex(R.propEq('title', 'Gross Income'), viewTypeData.modViewData);
      viewTypeData.modViewData[grossIncomeIndex].content = grossIncome || 0.00;
      const netIncomeIndex = R.findIndex(R.propEq('title', 'Net Income'), viewTypeData.modViewData);
      viewTypeData.modViewData[netIncomeIndex].content = netIncome || 0.00;
      const monthlyDebtIndex = R.findIndex(R.propEq('title', 'Monthly Debt'), viewTypeData.modViewData);
      viewTypeData.modViewData[monthlyDebtIndex].content = monthlyDebt || 0.00;
      const disposableIncomeIndex = R.findIndex(R.propEq('title', 'Disposable Income'), viewTypeData.modViewData);
      viewTypeData.modViewData[disposableIncomeIndex].content = disposableIncome || 0.00;
      const debtCoverageRatioIndex = R.findIndex(R.propEq('title', 'Debt Coverage Ratio'), viewTypeData.modViewData);
      viewTypeData.modViewData[
        debtCoverageRatioIndex].content = debtCoverageRatio ? `${(debtCoverageRatio).toFixed(2)}%` : '0.00%';

      return {
        ...state,
        viewTypeData,
        selectedView: viewType,
        data: viewTypeData.modViewData,
      };
    }

    case UPDATE_OCCUPANCY: {
      const occupancyValue = action.payload;
      const { viewTypeData, selectedView } = state;
      const viewType = selectedView === 'loanView' ? 'modView' : 'loanView';
      const occupancyIndex = R.findIndex(R.propEq('title', 'Occupancy Type'), viewTypeData.loanViewData);
      viewTypeData.loanViewData[occupancyIndex].content = occupancyValue;
      return {
        ...state,
        viewTypeData,
        selectedView: viewType,
        data: viewTypeData.loanViewData,
      };
    }


    default: {
      return state;
    }
  }
};

const TestHooks = {
  errorState,
  loadingState,
};

export default reducer;
export { TestHooks };
