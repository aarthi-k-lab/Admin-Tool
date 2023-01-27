import React from 'react';
import { shallow } from 'enzyme';
import SweetAlertBox from 'components/SweetAlertBox';
import { TestHooks } from './SearchLoan';
import { ADDITIONAL_INFO } from '../../../constants/widgets';

const defaultProps = {
  evalId: '',
  isAssigned: false,
  onAdditionalInfo: jest.fn(),
  onAdditionalInfoSelect: jest.fn(),
  onAutoSave: jest.fn(),
  user: {},
  history: [],
  location: {
    search: '',
  },
  onEndShift: jest.fn(),
  onGetGroupName: jest.fn(),
  onSearchLoan: jest.fn(),
  onSelectEval: jest.fn(),
  onHistorySelect: jest.fn(),
  onWidgetToggle: jest.fn(),
  UserNotification: {
    level: '',
    message: '',
  },
  getRejectResponse: {
    level: 'success',
    message: 'successful',
  },
  searchLoanResult: {
    loanNumber: '123',
    valid: true,
    assigned: [{
      mock: 'mock',
    }],
  },
};
describe('Search Loan ', () => {
  const { SearchLoan } = TestHooks;
  const resultOperation = {
    status: 'Successful',
    level: 'success',
    isOpen: true,
  };
  const searchLoanResult = {
    loanNumber: '123',
    valid: true,
    assigned: [{
      mock: 'mock',
    }],
  };
  const closeSweetAlert = jest.fn();
  const onEndShift = jest.fn();
  const onGetGroupName = jest.fn();
  const onSearchLoan = jest.fn();
  const onSelectEval = jest.fn();
  const onClearStagerTaskName = jest.fn();
  const onHistorySelect = jest.fn();
  const checkTrialStagerButton = jest.fn();
  const history = [];
  const location = {
    search: 'mock',
  };
  const props = {
    closeSweetAlert,
    onClearStagerTaskName,
    onEndShift,
    onSelectEval,
    onGetGroupName,
    resultOperation,
    searchLoanResult,
    onSearchLoan,
    onHistorySelect,
    history,
    location,
    checkTrialStagerButton,
  };
  const getLoanActivityPath = jest.spyOn(SearchLoan.prototype, 'getLoanActivityPath');
  const wrapper = shallow(<SearchLoan
    {...defaultProps}
    {...props}
  />);
  const instance = wrapper.instance();
  it('should not call onSelectEval on ReactTable getTdProps onClick on ACTIONS Header', () => {
    wrapper.find('ReactTable').first().props().getTdProps({}, { original: [] }, { Header: 'ACTIONS' })
      .onClick();
    expect(onSelectEval).toBeCalledTimes(0);
    expect(instance.redirectPath).toBe('');
  });
  it('should call onSelectEval on ReactTable getTdProps onClick and default taskname', () => {
    wrapper.find('ReactTable').first().props().getTdProps({}, { original: [] }, { Header: 'mock' })
      .onClick();
    expect(onSelectEval).toBeCalledTimes(1);
    expect(instance.redirectPath).toBe('/frontend-checklist');
  });
  it('should call onSelectEval on ReactTable getTdProps onClick and taskName as Underwriting', () => {
    wrapper.find('ReactTable').first().props().getTdProps({}, { original: { taskName: 'Underwriting' } }, { Header: 'mock' })
      .onClick();
    expect(onSelectEval).toBeCalledTimes(2);
    expect(instance.redirectPath).toBe('/backend-checklist');
  });
  it('should call onSelectEval on ReactTable getTdProps onClick and taskName as Processing', () => {
    wrapper.find('ReactTable').first().props().getTdProps({}, { original: { taskName: 'Processing' } }, { Header: 'mock' })
      .onClick();
    expect(onSelectEval).toBeCalledTimes(3);
    expect(instance.redirectPath).toBe('/doc-processor');
  });
  it('should call onSelectEval on ReactTable getTdProps onClick and taskName as Document Generation', () => {
    wrapper.find('ReactTable').first().props().getTdProps({}, { original: { taskName: 'Document Generation' } }, { Header: 'mock' })
      .onClick();
    expect(onSelectEval).toBeCalledTimes(4);
    expect(instance.redirectPath).toBe('/doc-gen');
  });
  it('should call onSelectEval on ReactTable getTdProps onClick and taskName as Docs In', () => {
    wrapper.find('ReactTable').first().props().getTdProps({}, { original: { taskName: 'Docs In' } }, { Header: 'mock' })
      .onClick();
    expect(onSelectEval).toBeCalledTimes(5);
    expect(instance.redirectPath).toBe('/docs-in');
  });
  it('should call onSelectEval on ReactTable getTdProps onClick and taskName as Pending Booking', () => {
    wrapper.find('ReactTable').first().props().getTdProps({}, { original: { taskName: 'Pending Booking' } }, { Header: 'mock' })
      .onClick();
    expect(onSelectEval).toBeCalledTimes(6);
    expect(instance.redirectPath).toBe('/special-loan');
  });
  it('should call getLoanActivityPath on ReactTable getTdProps onClick and taskName as Forbearance', () => {
    wrapper.find('ReactTable').first().props().getTdProps({}, { original: { taskName: 'Forbearance', assignee: 'In Queue' } }, { Header: 'mock' })
      .onClick();
    expect(onSelectEval).toBeCalledTimes(7);
    expect(instance.redirectPath).toBe('/loan-activity');
    expect(getLoanActivityPath).toBeCalledTimes(1);
  });
  it('should call getLoanActivityPath on ReactTable getTdProps onClick and taskName as Trial Modification', () => {
    wrapper.find('ReactTable').first().props().getTdProps({}, { original: { taskName: 'Trial Modification' } }, { Header: 'mock' })
      .onClick();
    expect(onSelectEval).toBeCalledTimes(8);
    expect(instance.redirectPath).toBe('/loan-activity');
    expect(getLoanActivityPath).toBeCalledTimes(2);
  });
  it('should call onSelectEval on ReactTable getTdProps onClick and taskName as Docs Sent and tstatus active', () => {
    wrapper.find('ReactTable').first().props().getTdProps({}, { original: { taskName: 'Docs Sent', tstatus: 'Active' } }, { Header: 'mock' })
      .onClick();
    expect(onSelectEval).toBeCalledTimes(9);
    expect(instance.redirectPath).toBe('/doc-gen-back');
  });
  it('should call onSelectEval on ReactTable getTdProps onClick and taskName as Pending Buyout and tstatus as Active', () => {
    wrapper.find('ReactTable').first().props().getTdProps({}, { original: { taskName: 'Pending Buyout', tstatus: 'Active' } }, { Header: 'mock' })
      .onClick();
    expect(onSelectEval).toBeCalledTimes(10);
    expect(instance.redirectPath).toBe('/docs-in-back');
  });
  it('render userNotification for reject results', () => {
    expect(wrapper.find('UserNotification')).toHaveLength(1);
  });
  it('should call closeSweetAlert on sweetAlert close', () => {
    expect(wrapper.find('SweetAlertBox')).toHaveLength(2);
    wrapper.find('SweetAlertBox').at(0).simulate('confirm');
    expect(props.closeSweetAlert).toBeCalledTimes(1);
  });
  it('should call onEndShift on Link click', () => {
    wrapper.find('Link').simulate('click');
    expect(props.onEndShift).toBeCalledTimes(1);
  });
});

describe('When additionalInfo is displayed in Search Loan ', () => {
  const { SearchLoan } = TestHooks;
  const resultOperation = {
    status: 'Successful',
    level: 'success',
    isOpen: true,
  };
  const searchLoanResult = {
    loanNumber: '123',
    valid: true,
    assigned: [{
      mock: 'mock',
    }],
  };
  const closeSweetAlert = jest.fn();
  const onEndShift = jest.fn();
  const onGetGroupName = jest.fn();
  const onSearchLoan = jest.fn();
  const onSelectEval = jest.fn();
  const onClearStagerTaskName = jest.fn();
  const onWidgetToggle = jest.fn();
  const onHistorySelect = jest.fn();
  const stopPropagation = jest.fn();
  const history = [];
  const location = {
    search: 'mock',
  };
  const props = {
    closeSweetAlert,
    onClearStagerTaskName,
    onEndShift,
    onSelectEval,
    onGetGroupName,
    resultOperation,
    searchLoanResult,
    onSearchLoan,
    history,
    onWidgetToggle,
    onHistorySelect,
    location,
  };
  const wrapper = shallow(<SearchLoan
    {...defaultProps}
    {...props}
  />);
  it('should render Go back to search results when in additional info page', () => {
    wrapper.setProps({ openWidgetList: [ADDITIONAL_INFO] });
    expect(wrapper.find('Connect(WidgetBuilder)')).toHaveLength(1);
    expect(wrapper.find('withRouter(GoBackToSearch)')).toHaveLength(1);
    expect(wrapper.find('Connect(AdditionalInfo)')).toHaveLength(1);
    expect(wrapper.find('Link')).toHaveLength(0);
    expect(wrapper.find('ReactTable')).toHaveLength(0);
  });
  it('should render back button when in search loan page', () => {
    wrapper.setProps({ openWidgetList: [''], searchLoanResult });
    expect(wrapper.find('Connect(WidgetBuilder)')).toHaveLength(1);
    expect(wrapper.find('withRouter(GoBackToSearch)')).toHaveLength(0);
    expect(wrapper.find('Connect(AdditionalInfo)')).toHaveLength(0);
    expect(wrapper.find('Link')).toHaveLength(1);
    expect(wrapper.find('ReactTable')).toHaveLength(2);
  });
  it('  should call onWidgetToggle on go back to search results button click', () => {
    wrapper.setProps({ openWidgetList: [ADDITIONAL_INFO], searchLoanResult });
    wrapper.find('withRouter(GoBackToSearch)').props().onClick();
    expect(onWidgetToggle).toBeCalledTimes(1);
  });
  it('should call onWidgetToggle on additional Info widget click', () => {
    wrapper.find('Connect(WidgetBuilder)').simulate('click', 'xyz', 'Additional Info');
    expect(onWidgetToggle).toBeCalledTimes(1);
  });
  it('should call stop propogation in event when the source Label is remedy', () => {
    wrapper.setProps({ openWidgetList: [''], searchLoanResult });
    wrapper.find('ReactTable').first().props().getTdProps({}, { original: { sourceLabel: 'REMEDY' } }, { Header: 'mock' })
      .onClick({ stopPropagation });
    expect(onSelectEval).toBeCalledTimes(0);
    expect(stopPropagation).toBeCalled();
  });
});


describe('Search Loan sweetalert functionalities', () => {
  it('shows Sweet Alert when resultOperation is not empty', () => {
    const { SearchLoan } = TestHooks;
    const resultOperation = {
      status: 'Successful',
      level: 'success',
      isOpen: true,
    };
    const searchLoanResult = { loanNumber: '' };
    const closeSweetAlert = jest.fn();
    const onClearStagerTaskName = jest.fn();
    const props = {
      closeSweetAlert,
      onClearStagerTaskName,
      resultOperation,
      searchLoanResult,
    };
    const wrapper = shallow(<SearchLoan
      {...defaultProps}
      {...props}
    />);
    expect(wrapper.find(SweetAlertBox)).toHaveLength(2);
  });
  it('shows Sweet Alert when resultOperation is not empty', () => {
    const { SearchLoan } = TestHooks;
    const resultOperation = {
      status: 'Successful',
      level: 'success',
      isOpen: true,
    };
    const searchLoanResult = {
      loanNumber: '123',
      valid: true,
    };
    const closeSweetAlert = jest.fn();
    const onClearStagerTaskName = jest.fn();
    const wrapper = shallow(<SearchLoan
      {...defaultProps}
      closeSweetAlert={closeSweetAlert}
      onClearStagerTaskName={onClearStagerTaskName}
      resultOperation={resultOperation}
      searchLoanResult={searchLoanResult}
    />);
    expect(wrapper.find(SweetAlertBox)).toHaveLength(2);
  });

  it('does not show Sweet Alert when resultOperation is empty and render invalid loan page on invalid loan', () => {
    const { SearchLoan } = TestHooks;
    const resultOperation = {};
    const searchLoanResult = {
      loanNumber: '123',
      valid: false,
    };
    const closeSweetAlert = jest.fn();
    const onClearStagerTaskName = jest.fn();
    const wrapper = shallow(<SearchLoan
      {...defaultProps}
      closeSweetAlert={closeSweetAlert}
      onClearStagerTaskName={onClearStagerTaskName}
      resultOperation={resultOperation}
      searchLoanResult={searchLoanResult}
    />);
    expect(wrapper.find(SweetAlertBox)).toHaveLength(1);
    expect(wrapper.find('InvalidLoanPage')).toHaveLength(1);
  });

  it('does not show Sweet Alert when resultOperation is undefined and invalid loanpage when status code is not null', () => {
    const { SearchLoan } = TestHooks;
    const searchLoanResult = {
      loanNumber: '',
      statusCode: 'mock',
    };
    const closeSweetAlert = jest.fn();
    const onClearStagerTaskName = jest.fn();
    const wrapper = shallow(<SearchLoan
      {...defaultProps}
      closeSweetAlert={closeSweetAlert}
      onClearStagerTaskName={onClearStagerTaskName}
      searchLoanResult={searchLoanResult}
    />);
    expect(wrapper.find(SweetAlertBox)).toHaveLength(1);
    expect(wrapper.find('InvalidLoanPage')).toHaveLength(1);
  });
  it('should render Loader on InProgress', () => {
    const { SearchLoan } = TestHooks;
    const resultOperation = {
      status: 'Successful',
      level: 'success',
      isOpen: true,
    };
    const searchLoanResult = {
      loanNumber: '123',
      valid: true,
      unAssigned: [{
        mock: 'mock',
      }],
    };
    const closeSweetAlert = jest.fn();
    const onEndShift = jest.fn();
    const onGetGroupName = jest.fn();
    const onSearchLoan = jest.fn();
    const onSelectEval = jest.fn();
    const onClearStagerTaskName = jest.fn();
    const history = [];
    const location = {
      search: 'mock',
    };
    const inProgress = true;
    const props = {
      closeSweetAlert,
      onClearStagerTaskName,
      onEndShift,
      onSelectEval,
      onGetGroupName,
      resultOperation,
      inProgress,
      searchLoanResult,
      onSearchLoan,
      history,
      location,
    };
    const wrapper = shallow(<SearchLoan
      {...defaultProps}
      {...props}
    />);
    expect(wrapper.find('Loader')).toHaveLength(1);
  });
});
