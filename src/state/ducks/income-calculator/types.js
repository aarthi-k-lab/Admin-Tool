const FETCH_INCOMECALC_CHECKLIST = 'app/incomecal/FETCH_INCOMECALC_CHECKLIST';
const TOGGLE_HISTORY_VIEW = 'app/incomecal/TOGGLE_HISTORY_VIEW';
const SET_BORROWERS_DATA = 'app/incomecal/SET_BORROWERS_DATA';
const FETCH_HISTORY_INFO = 'app/incomecal/FETCH_HISTORY_INFO';
const SET_INCOMECALC_DATA = 'app/incomecal/SET_INCOMECALC_DATA';
const SET_EXPENSECALC_DATA = 'app/expensecalc/SET_EXPENSECALC_DATA';
const FETCH_CHECKLIST = 'app/incomecal/FETCH_CHECKLIST';
const STORE_PROCESS_DETAILS = 'app/incomecal/STORE_PROCESS_DETAILS';
const LOADING_TASKS = 'app/incomecal/LOADING_TASKS';
const SET_SELECTED_CHECKLIST = 'app/incomecal/SET_SELECTED_CHECKLIST';
const LOADING_CHECKLIST = 'app/incomecal/LOADING_CHECKLIST';
const STORE_CHECKLIST = 'app/incomecal/STORE_CHECKLIST';
const ERROR_LOADING_CHECKLIST = 'app/incomecal/ERROR_LOADING_CHECKLIST';
const STORE_TASKS = 'app/incomecal/STORE_TASKS';
const ERROR_LOADING_TASKS = 'app/incomecal/ERROR_LOADING_TASKS';
const RESET_DATA = 'app/incomecal/RESET_DATA';
const HANDLE_CHECKLIST_ITEM_CHANGE = 'app/incomecal/HANDLE_CHECKLIST_ITEM_CHANGE';
const STORE_CHECKLIST_ITEM_CHANGE = 'app/incomecal/STORE_CHECKLIST_ITEM_CHANGE';
const REMOVE_DIRTY_CHECKLIST = 'app/incomecal/REMOVE_DIRTY_CHECKLIST';
const SET_CHECKLIST_ID = 'app/incomecal/SET_CHECKLIST_ID';
const SAVE_DROPDOWN_OPTIONS = 'app/incomecal/SAVE_DROPDOWN_OPTIONS';
const SET_INCOMECALC_TOGGLE = 'app/incomecal/SET_INCOMECALC_TOGGLE';
const SET_PROCESS_ID = 'app/incomecal/SET_PROCESS_ID';
const SET_AUTOCOMPLETE_OPTIONS = 'app/incomecal/SET_AUTOCOMPLETE_OPTIONS';
const STORE_INCOMECALC_HISTORY = 'app/incomecal/STORE_INCOMECALC_HISTORY';
const SET_HISTORY_ITEM = 'app/incomecal/SET_HISTORY_ITEM';
const LOCK_INCOME_CALCULATION = 'app/incomecal/LOCK_INCOME_CALCULATION';

const PROCESS_VALIDATIONS = 'app/incomecal/PROCESS_VALIDATIONS';
const SET_BANNER_DATA = 'app/incomecal/SET_BANNER_DATA';
const CLOSE_INC_HISTORY = 'app/incomecal/CLOSE_INC_HISTORY';
const SET_MAIN_CHECKLISTID = 'app/incomecal/SET_MAIN_CHECKLISTID';
const SET_HISTORICAL_BORROWERS = 'app/incomecal/SET_HISTORICAL_BORROWERS';
const STORE_TASK_VALUE = 'app/incomecal/STORE_TASK_VALUE';
const CLEAR_TASK_VALUE = 'app/incomecal/CLEAR_TASK_VALUE';
const SET_BORROWER_DATA = 'app/dashboard/SET_BORROWER_DATA';

// Pre process actions
const PROCESS_BORROWER_DATA = 'app/incomecal/PROCESS_BORROWER_DATA';
const GET_COMPANY_LIST = 'app/incomecal/GET_COMPANY_LIST';


// Post process actions
const PUT_COMPANY_NAME = 'app/incomecal/PUT_COMPANY_NAME';
const ADD_CONTRIBUTOR = 'app/incomecal/ADD_CONTRIBUTOR';
const DUPLICATE_INCOME = 'app/incomecal/DUPLICATE_INCOME';

const SHOW_LOADER = 'app/incomecal/SHOW_LOADER';
const HIDE_LOADER = 'app/incomecal/HIDE_LOADER';

const FETCH_SELECTED_BORROWER_DATA = 'app/incomecal/FETCH_SELECTED_BORROWER_DATA';
const SET_SELECTED_BORROWER_DATA = 'app/incomecal/SET_SELECTED_BORROWER_DATA';
const SET_SELECTED_CHECKLIST_DATA = 'app/incomecal/SET_SELECTED_CHECKLIST_DATA';
const FETCH_SELECTED_CHECKLIST_DATA = 'app/incomecal/FETCH_SELECTED_CHECKLIST_DATA';
const FICO_LOCK_CALCULATION = 'app/incomecal/FICO_LOCK_CALCULATION';
const FETCH_FICO_TABLE_DATA = 'app/incomecal/FETCH_FICO_TABLE_DATA';
const SET_FICO_TABLE_DATA = 'app/incomecal/SET_FICO_TABLE_DATA';
const UPDATE_CHECKLIST_TASKS = 'app/incomecal/UPDATE_CHECKLIST_TASKS';
const SET_LOCK_AV = 'app/incomecal/SET_LOCK_AV';
const SET_SELECTED_BORROWER = 'app/incomecal/SET_SELECTED_BORROWER';

export {
  SET_BORROWER_DATA,
  LOCK_INCOME_CALCULATION,
  SET_HISTORICAL_BORROWERS,
  SET_MAIN_CHECKLISTID,
  CLOSE_INC_HISTORY,
  SHOW_LOADER,
  HIDE_LOADER,
  TOGGLE_HISTORY_VIEW,
  SET_INCOMECALC_DATA,
  SET_BANNER_DATA,
  PROCESS_VALIDATIONS,
  ADD_CONTRIBUTOR,
  SET_AUTOCOMPLETE_OPTIONS,
  GET_COMPANY_LIST,
  PUT_COMPANY_NAME,
  PROCESS_BORROWER_DATA,
  SET_PROCESS_ID,
  SET_INCOMECALC_TOGGLE,
  SAVE_DROPDOWN_OPTIONS,
  SET_CHECKLIST_ID,
  RESET_DATA,
  FETCH_CHECKLIST,
  STORE_PROCESS_DETAILS,
  HANDLE_CHECKLIST_ITEM_CHANGE,
  LOADING_TASKS,
  SET_BORROWERS_DATA,
  SET_SELECTED_CHECKLIST,
  LOADING_CHECKLIST,
  STORE_CHECKLIST,
  ERROR_LOADING_CHECKLIST,
  STORE_TASKS,
  ERROR_LOADING_TASKS,
  STORE_CHECKLIST_ITEM_CHANGE,
  REMOVE_DIRTY_CHECKLIST,
  DUPLICATE_INCOME,
  STORE_INCOMECALC_HISTORY,
  FETCH_INCOMECALC_CHECKLIST,
  SET_HISTORY_ITEM,
  FETCH_HISTORY_INFO,
  STORE_TASK_VALUE,
  CLEAR_TASK_VALUE,
  SET_EXPENSECALC_DATA,
  FETCH_SELECTED_BORROWER_DATA,
  SET_SELECTED_BORROWER_DATA,
  SET_SELECTED_CHECKLIST_DATA,
  FETCH_SELECTED_CHECKLIST_DATA,
  FICO_LOCK_CALCULATION,
  FETCH_FICO_TABLE_DATA,
  SET_FICO_TABLE_DATA,
  UPDATE_CHECKLIST_TASKS,
  SET_LOCK_AV,
  SET_SELECTED_BORROWER,
};
