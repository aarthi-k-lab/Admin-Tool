import React from 'react';
import { shallow } from 'enzyme';
import {
  actionBooking, actionUnreject, sendToFEUW, actionDefault, assignedTo, defaultMock, historyMock,
} from 'models/Testmock/evalTableRow';
import { TestHooks } from './EvalTableRow';

describe('EvalTableRow ::Action Booking', () => {
  const { EvalTableRow } = TestHooks;
  const value = 'Booking';
  const disableSendToFEUW = false;
  const { row, user, searchLoanResult } = actionBooking;
  const onSelectEval = jest.fn();
  const onSelectReject = jest.fn();
  const onGetGroupName = jest.fn();
  const onSendToFEUW = jest.fn();
  const setTombstoneDataForLoanView = jest.fn();
  const history = [];
  const wrapper = shallow(<EvalTableRow
    disableSendToFEUW={disableSendToFEUW}
    history={history}
    onGetGroupName={onGetGroupName}
    onSelectEval={onSelectEval}
    onSelectReject={onSelectReject}
    onSendToFEUW={onSendToFEUW}
    row={row}
    searchLoanResult={searchLoanResult}
    setTombstoneDataForLoanView={setTombstoneDataForLoanView}
    user={user}
    value="Booking"
  />);
  it('should render EvaltableRow component', () => {
    expect(wrapper).toHaveLength(1);
  });
  it('should call onGetGroupName and onSelectEval on cell click', () => {
    wrapper.find('Connect(EvalTableCell)').props().click();
    wrapper.instance().handleLinkClick(null, 'Booking');
    expect(onSelectEval).toBeCalledTimes(1);
    expect(onGetGroupName).toBeCalledTimes(1);
  });
});

describe('EvalTableRow :: Action Un-reject', () => {
  const { EvalTableRow } = TestHooks;
  const value = 'Booking';
  const disableSendToFEUW = false;
  const { row, user, searchLoanResult } = actionUnreject;
  const onSelectEval = jest.fn();
  const onSelectReject = jest.fn();
  const onGetGroupName = jest.fn();
  const onSendToFEUW = jest.fn();
  const setTombstoneDataForLoanView = jest.fn();
  const history = [];
  const props = {
    value,
    history,
    disableSendToFEUW,
    onSelectReject,
    onGetGroupName,
    onSendToFEUW,
    onSelectEval,
    row,
    user,
    setTombstoneDataForLoanView,
    searchLoanResult,
  };
  const wrapper = shallow(<EvalTableRow
    {...props}
  />);
  it('should render EvaltableRow component with value un-reject', () => {
    expect(wrapper).toHaveLength(1);
    expect(wrapper.find('Connect(EvalTableCell)').props().value).toBe('Un-reject');
  });
  it('should callonSelectReject on cell click', () => {
    wrapper.find('Connect(EvalTableCell)').props().click();
    expect(onSelectReject).toBeCalledTimes(1);
  });
});

describe('EvalTableRow :: Action SendToFEUW', () => {
  const { EvalTableRow } = TestHooks;
  const value = 'SendToFEUW';
  const disableSendToFEUW = false;
  const { row, user, searchLoanResult } = sendToFEUW;


  const onSelectEval = jest.fn();
  const onSelectReject = jest.fn();
  const onGetGroupName = jest.fn();
  const onSendToFEUW = jest.fn();
  const setTombstoneDataForLoanView = jest.fn();
  const history = [];
  const props = {
    value,
    history,
    disableSendToFEUW,
    setTombstoneDataForLoanView,
    onSelectReject,
    onGetGroupName,
    onSendToFEUW,
    onSelectEval,
    row,
    user,
    searchLoanResult,
  };
  const wrapper = shallow(<EvalTableRow
    {...props}
  />);
  it('should render EvaltableRow component with value SendToFEUW', () => {
    expect(wrapper).toHaveLength(1);
    expect(wrapper.find('Connect(EvalTableCell)').props().value).toBe('SendToFEUW');
  });
  it('should onSendToFEUW on cell click', () => {
    wrapper.find('Connect(EvalTableCell)').props().click();
    wrapper.instance().handleLinkClick(null, value);
    expect(onSendToFEUW).toBeCalledTimes(1);
  });
});

describe('EvalTableRow :: Action Default', () => {
  const { EvalTableRow } = TestHooks;
  const value = 'Booking';
  const disableSendToFEUW = false;
  const { row, user, searchLoanResult } = actionDefault;
  const onSelectEval = jest.fn();
  const onSelectReject = jest.fn();
  const onGetGroupName = jest.fn();
  const onSendToFEUW = jest.fn();
  const setTombstoneDataForLoanView = jest.fn();
  const history = [];
  const props = {
    value,
    history,
    disableSendToFEUW,
    onSelectReject,
    onGetGroupName,
    onSendToFEUW,
    setTombstoneDataForLoanView,
    onSelectEval,
    row,
    user,
    searchLoanResult,
  };
  const wrapper = shallow(<EvalTableRow
    {...props}
  />);
  it('should render EvaltableRow component with value default', () => {
    expect(wrapper).toHaveLength(1);
    expect(wrapper.find('Connect(EvalTableCell)').props().value).toBe('default');
  });
});

describe('EvalTableRow :: Assigned To', () => {
  const { EvalTableRow } = TestHooks;
  const value = 'Booking';
  const disableSendToFEUW = false;
  const { row, user, searchLoanResult } = assignedTo;
  const onSelectEval = jest.fn();
  const onSelectReject = jest.fn();
  const onGetGroupName = jest.fn();
  const onSendToFEUW = jest.fn();
  const setTombstoneDataForLoanView = jest.fn();
  const history = [];
  const props = {
    value,
    history,
    disableSendToFEUW,
    onSelectReject,
    onGetGroupName,
    onSendToFEUW,

    setTombstoneDataForLoanView,
    onSelectEval,
    row,
    user,
    searchLoanResult,
  };
  const wrapper = shallow(<EvalTableRow
    {...props}
  />);
  it('should render EvaltableRow component with value assigned', () => {
    expect(wrapper).toHaveLength(1);
    expect(wrapper.find('Connect(EvalTableCell)').props().value).toBe('assigned');
  });
});

describe('EvalTableRow :: History', () => {
  const { EvalTableRow } = TestHooks;
  const value = 'Loan Activity';
  const disableSendToFEUW = false;
  const { row, user, searchLoanResult } = historyMock;

  const onSelectEval = jest.fn();
  const onSelectReject = jest.fn();
  const onGetGroupName = jest.fn();
  const onSendToFEUW = jest.fn();
  const setTombstoneDataForLoanView = jest.fn();
  const onWidgetToggle = jest.fn();
  const history = [];
  const props = {
    value,
    history,
    disableSendToFEUW,
    onWidgetToggle,
    onSelectReject,
    onGetGroupName,
    onSendToFEUW,
    setTombstoneDataForLoanView,
    onSelectEval,
    row,
    user,
    searchLoanResult,
  };
  const wrapper = shallow(<EvalTableRow
    {...props}
  />);
  it('should render EvaltableRow component with value Loan Activity', () => {
    expect(wrapper).toHaveLength(1);
  });
  it('should call setTombstoneDataForLoanView and onHistorySelect on cell click', () => {
    const stopPropagation = jest.fn();
    wrapper.find('WithStyles(ForwardRef(IconButton))').simulate('click', { stopPropagation }, 'LoanHistory');
    expect(setTombstoneDataForLoanView).toBeCalled();
    expect(onWidgetToggle).toBeCalled();
  });
});

describe('EvalTableRow :: Default', () => {
  const { EvalTableRow } = TestHooks;
  const value = 'Booking';
  const disableSendToFEUW = false;
  const { row, user, searchLoanResult } = defaultMock;
  const onSelectEval = jest.fn();
  const onSelectReject = jest.fn();
  const onGetGroupName = jest.fn();
  const onSendToFEUW = jest.fn();
  const setTombstoneDataForLoanView = jest.fn();
  const history = [];
  const props = {
    value,
    history,
    disableSendToFEUW,
    onSelectReject,
    onGetGroupName,
    onSendToFEUW,
    setTombstoneDataForLoanView,
    onSelectEval,
    row,
    user,
    searchLoanResult,
  };
  const wrapper = shallow(<EvalTableRow
    {...props}
  />);
  it('should render EvaltableRow component with value default', () => {
    expect(wrapper).toHaveLength(1);
    expect(wrapper.find('Connect(EvalTableCell)').props().value).toBe('default');
  });
});
