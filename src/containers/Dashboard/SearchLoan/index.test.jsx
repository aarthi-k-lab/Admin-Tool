import React from 'react';
import { shallow } from 'enzyme';
import SweetAlertBox from 'components/SweetAlertBox';
import { TestHooks } from './SearchLoan';


describe('Search Loan ', () => {
  const { SearchLoan } = TestHooks;
  const resultOperation = {
    status: 'Successful',
    level: 'success',
    isOpen: true,
  };
  const getRejectResponse = {
    level: 'mock',
    message: 'mock',
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
  const history = [];
  const location = {
    search: 'mock',
  };
  const props = {
    closeSweetAlert,
    getRejectResponse,
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
  };
  const getLoanActivityPath = jest.spyOn(SearchLoan.prototype, 'getLoanActivityPath');
  const wrapper = shallow(<SearchLoan
    {...props}
  />);
  const instance = wrapper.instance();
  it('should not call onSelectEval on ReactTable getTdProps onClick on ACTIONS Header', () => {
    wrapper.find('ReactTable').props().getTdProps({}, { original: [] }, { Header: 'ACTIONS' }).onClick();
    expect(onSelectEval).toBeCalledTimes(0);
    expect(instance.redirectPath).toBe('');
  });
  it('should call onSelectEval on ReactTable getTdProps onClick and default taskname', () => {
    wrapper.find('ReactTable').props().getTdProps({}, { original: [] }, { Header: 'mock' }).onClick();
    expect(onSelectEval).toBeCalledTimes(1);
    expect(instance.redirectPath).toBe('/frontend-checklist');
  });
  it('should call onSelectEval on ReactTable getTdProps onClick and taskName as Underwriting', () => {
    wrapper.find('ReactTable').props().getTdProps({}, { original: { taskName: 'Underwriting' } }, { Header: 'mock' }).onClick();
    expect(onSelectEval).toBeCalledTimes(2);
    expect(instance.redirectPath).toBe('/backend-checklist');
  });
  it('should call onSelectEval on ReactTable getTdProps onClick and taskName as Processing', () => {
    wrapper.find('ReactTable').props().getTdProps({}, { original: { taskName: 'Processing' } }, { Header: 'mock' }).onClick();
    expect(onSelectEval).toBeCalledTimes(3);
    expect(instance.redirectPath).toBe('/doc-processor');
  });
  it('should call onSelectEval on ReactTable getTdProps onClick and taskName as Document Generation', () => {
    wrapper.find('ReactTable').props().getTdProps({}, { original: { taskName: 'Document Generation' } }, { Header: 'mock' }).onClick();
    expect(onSelectEval).toBeCalledTimes(4);
    expect(instance.redirectPath).toBe('/doc-gen');
  });
  it('should call onSelectEval on ReactTable getTdProps onClick and taskName as Docs In', () => {
    wrapper.find('ReactTable').props().getTdProps({}, { original: { taskName: 'Docs In' } }, { Header: 'mock' }).onClick();
    expect(onSelectEval).toBeCalledTimes(5);
    expect(instance.redirectPath).toBe('/docs-in');
  });
  it('should call onSelectEval on ReactTable getTdProps onClick and taskName as Pending Booking', () => {
    wrapper.find('ReactTable').props().getTdProps({}, { original: { taskName: 'Pending Booking' } }, { Header: 'mock' }).onClick();
    expect(onSelectEval).toBeCalledTimes(6);
    expect(instance.redirectPath).toBe('/special-loan');
  });
  it('should call getLoanActivityPath on ReactTable getTdProps onClick and taskName as Forbearance', () => {
    wrapper.find('ReactTable').props().getTdProps({}, { original: { taskName: 'Forbearance', assignee: 'In Queue' } }, { Header: 'mock' }).onClick();
    expect(onSelectEval).toBeCalledTimes(7);
    expect(instance.redirectPath).toBe('/loan-activity');
    expect(getLoanActivityPath).toBeCalledTimes(1);
  });
  it('should call getLoanActivityPath on ReactTable getTdProps onClick and taskName as Trial Modification', () => {
    wrapper.find('ReactTable').props().getTdProps({}, { original: { taskName: 'Trial Modification' } }, { Header: 'mock' }).onClick();
    expect(onSelectEval).toBeCalledTimes(8);
    expect(instance.redirectPath).toBe('/loan-activity');
    expect(getLoanActivityPath).toBeCalledTimes(2);
  });
  it('should call onSelectEval on ReactTable getTdProps onClick and taskName as Docs Sent and tstatus active', () => {
    wrapper.find('ReactTable').props().getTdProps({}, { original: { taskName: 'Docs Sent', tstatus: 'Active' } }, { Header: 'mock' }).onClick();
    expect(onSelectEval).toBeCalledTimes(9);
    expect(instance.redirectPath).toBe('/doc-gen-back');
  });
  it('should call onSelectEval on ReactTable getTdProps onClick and taskName as Pending Buyout and tstatus as Active', () => {
    wrapper.find('ReactTable').props().getTdProps({}, { original: { taskName: 'Pending Buyout', tstatus: 'Active' } }, { Header: 'mock' }).onClick();
    expect(onSelectEval).toBeCalledTimes(10);
    expect(instance.redirectPath).toBe('/docs-in-back');
  });
  it('render userNotification for reject results', () => {
    expect(wrapper.find('UserNotification')).toHaveLength(1);
  });
  it('should call closeSweetAlert on sweetAlert close', () => {
    wrapper.find('SweetAlertBox').simulate('confirm');
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
  const getRejectResponse = {
    level: 'mock',
    message: 'mock',
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
  const onAdditionalInfoSelect = jest.fn();
  const onHistorySelect = jest.fn();
  const stopPropagation = jest.fn();
  const history = [];
  const location = {
    search: 'mock',
  };
  const props = {
    closeSweetAlert,
    getRejectResponse,
    onClearStagerTaskName,
    onEndShift,
    onSelectEval,
    onGetGroupName,
    resultOperation,
    searchLoanResult,
    onSearchLoan,
    history,
    onAdditionalInfoSelect,
    onHistorySelect,
    location,
  };
  const wrapper = shallow(<SearchLoan
    {...props}
  />);
  it('should render Go back to search results when in additional info page', () => {
    wrapper.setProps({ isAdditionalInfoOpen: true });
    expect(wrapper.find('Connect(WidgetBuilder)')).toHaveLength(1);
    expect(wrapper.find('withRouter(GoBackToSearch)')).toHaveLength(1);
    expect(wrapper.find('Connect(AdditionalInfo)')).toHaveLength(1);
    expect(wrapper.find('Link')).toHaveLength(0);
    expect(wrapper.find('ReactTable')).toHaveLength(0);
  });
  it('should render back button when in search loan page', () => {
    wrapper.setProps({ isAdditionalInfoOpen: false, searchLoanResult });
    expect(wrapper.find('Connect(WidgetBuilder)')).toHaveLength(1);
    expect(wrapper.find('withRouter(GoBackToSearch)')).toHaveLength(0);
    expect(wrapper.find('Connect(AdditionalInfo)')).toHaveLength(0);
    expect(wrapper.find('Link')).toHaveLength(1);
    expect(wrapper.find('ReactTable')).toHaveLength(1);
  });
  it('  should call onAdditionalInfoSelect on go back to search results button click', () => {
    wrapper.setProps({ isAdditionalInfoOpen: true, searchLoanResult });
    wrapper.find('withRouter(GoBackToSearch)').props().onClick();
    expect(onAdditionalInfoSelect).toBeCalledTimes(1);
  });
  it('should call onAdditionalInfoSelect on additional Info widget click', () => {
    wrapper.find('Connect(WidgetBuilder)').simulate('click', 'xyz', 'Additional Info');
    expect(onAdditionalInfoSelect).toBeCalledTimes(1);
  });
  it('should call stop propogation in event when the source Label is remedy', () => {
    wrapper.setProps({ isAdditionalInfoOpen: false, searchLoanResult });
    wrapper.find('ReactTable').props().getTdProps({}, { original: { sourceLabel: 'REMEDY' } }, { Header: 'mock' }).onClick({ stopPropagation });
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
    const getRejectResponse = {};
    const searchLoanResult = {};
    const closeSweetAlert = jest.fn();
    const onClearStagerTaskName = jest.fn();
    const props = {
      closeSweetAlert,
      getRejectResponse,
      onClearStagerTaskName,
      resultOperation,
      searchLoanResult,
    };
    const wrapper = shallow(<SearchLoan
      {...props}
    />);
    expect(wrapper.find(SweetAlertBox)).toHaveLength(1);
  });
  it('shows Sweet Alert when resultOperation is not empty', () => {
    const { SearchLoan } = TestHooks;
    const resultOperation = {
      status: 'Successful',
      level: 'success',
      isOpen: true,
    };
    const getRejectResponse = {};
    const searchLoanResult = {
      loanNumber: '123',
      valid: true,
    };
    const closeSweetAlert = jest.fn();
    const onClearStagerTaskName = jest.fn();
    const wrapper = shallow(<SearchLoan
      closeSweetAlert={closeSweetAlert}
      getRejectResponse={getRejectResponse}
      onClearStagerTaskName={onClearStagerTaskName}
      resultOperation={resultOperation}
      searchLoanResult={searchLoanResult}
    />);
    expect(wrapper.find(SweetAlertBox)).toHaveLength(1);
  });

  it('does not show Sweet Alert when resultOperation is empty and render invalid loan page on invalid loan', () => {
    const { SearchLoan } = TestHooks;
    const resultOperation = {};
    const getRejectResponse = {};
    const searchLoanResult = {
      loanNumber: '123',
      valid: false,
    };
    const closeSweetAlert = jest.fn();
    const onClearStagerTaskName = jest.fn();
    const wrapper = shallow(<SearchLoan
      closeSweetAlert={closeSweetAlert}
      getRejectResponse={getRejectResponse}
      onClearStagerTaskName={onClearStagerTaskName}
      resultOperation={resultOperation}
      searchLoanResult={searchLoanResult}
    />);
    expect(wrapper.find(SweetAlertBox)).toHaveLength(0);
    expect(wrapper.find('InvalidLoanPage')).toHaveLength(1);
  });

  it('does not show Sweet Alert when resultOperation is undefined and invalid loanpage when status code is not null', () => {
    const { SearchLoan } = TestHooks;
    const getRejectResponse = {};
    const searchLoanResult = {
      statusCode: 'mock',
    };
    const closeSweetAlert = jest.fn();
    const onClearStagerTaskName = jest.fn();
    const wrapper = shallow(<SearchLoan
      closeSweetAlert={closeSweetAlert}
      getRejectResponse={getRejectResponse}
      onClearStagerTaskName={onClearStagerTaskName}
      searchLoanResult={searchLoanResult}
    />);
    expect(wrapper.find(SweetAlertBox)).toHaveLength(0);
    expect(wrapper.find('InvalidLoanPage')).toHaveLength(1);
  });
  it('should render Loader on InProgress', () => {
    const { SearchLoan } = TestHooks;
    const resultOperation = {
      status: 'Successful',
      level: 'success',
      isOpen: true,
    };
    const getRejectResponse = {
      level: 'mock',
      message: 'mock',
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
      getRejectResponse,
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
      {...props}
    />);
    expect(wrapper.find('Loader')).toHaveLength(1);
  });
});
