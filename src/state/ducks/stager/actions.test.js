import {
  triggerDashboardCounts, triggerDashboardDataFetch,
  triggerCheckboxSelect,
  triggerOrderCallAction,
} from './actions';
import {
  GET_DASHBOARD_COUNTS_SAGA, GET_DASHBOARD_DATA_SAGA,
  TABLE_CHECKBOX_SELECT_TRIGGER, TRIGGER_ORDER_SAGA,
} from './types';

describe('Ducks :: Stager -> actions', () => {
  it('triggerDashboardCounts', () => {
    const loanNumber = 596401265;
    const expectedAction = {
      type: GET_DASHBOARD_COUNTS_SAGA,
    };
    const action = triggerDashboardCounts(loanNumber);
    expect(action).toEqual(expectedAction);
  });

  it('triggerDashboardDataFetch', () => {
    const searchTerm = 'LegalFeeToOrder';
    const expectedAction = {
      type: GET_DASHBOARD_DATA_SAGA,
      payload: searchTerm,
    };
    const action = triggerDashboardDataFetch(searchTerm);
    expect(action).toEqual(expectedAction);
  });

  it('triggerCheckboxSelect', () => {
    const selectedData = [];
    const expectedAction = {
      type: TABLE_CHECKBOX_SELECT_TRIGGER,
      payload: selectedData,
    };
    const action = triggerCheckboxSelect(selectedData);
    expect(action).toEqual(expectedAction);
  });

  it('triggerOrderCallAction', () => {
    const selectedData = [];
    const expectedAction = {
      type: TRIGGER_ORDER_SAGA,
      payload: selectedData,
    };
    const action = triggerOrderCallAction(selectedData);
    expect(action).toEqual(expectedAction);
  });
});
