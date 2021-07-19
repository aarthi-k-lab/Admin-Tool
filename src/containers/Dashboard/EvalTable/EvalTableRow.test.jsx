import React from 'react';
import { shallow } from 'enzyme';
import {
  actionBooking, actionUnreject, sendToFEUW, actionDefault, assignedTo, defaultMock, historyMock,
} from 'models/Testmock/evalTableRow';
import { TestHooks } from './EvalTableRow';

const defaultProps = {
  onSelectEval: jest.fn(),
  onSelectReject: jest.fn(),
  onGetGroupName: jest.fn(),
  onSendToFEUW: jest.fn(),
  setTombstoneDataForLoanView: jest.fn(),
  onWidgetToggle: jest.fn(),
  onHistorySelect: jest.fn(),
};
describe('EvalTableRow ::Action Booking', () => {
  const { EvalTableRow } = TestHooks;
  const disableSendToFEUW = false;
  const { row, user, searchLoanResult } = actionBooking;
  const onHistorySelect = jest.fn();
  const history = [];
  const wrapper = shallow(<EvalTableRow
    {...defaultProps}
    disableSendToFEUW={disableSendToFEUW}
    history={history}
    onHistorySelect={onHistorySelect}
    row={row}
    searchLoanResult={searchLoanResult}
    user={user}
    value="Booking"
  />);
  it('should render EvaltableRow component', () => {
    expect(wrapper).toHaveLength(1);
  });
  it('should call onGetGroupName and onSelectEval on cell click', () => {
    wrapper.find('Connect(EvalTableCell)').props().click();
    wrapper.instance().handleLinkClick(null, 'Booking');
    expect(defaultProps.onSelectEval).toBeCalledTimes(1);
    expect(defaultProps.onGetGroupName).toBeCalledTimes(1);
  });
});

describe('EvalTableRow :: Action Un-reject', () => {
  const { EvalTableRow } = TestHooks;
  const value = 'Booking';
  const disableSendToFEUW = false;
  const { row, user, searchLoanResult } = actionUnreject;
  const history = [];
  const props = {
    value,
    history,
    disableSendToFEUW,
    row,
    user,
    searchLoanResult,
  };
  const wrapper = shallow(<EvalTableRow
    {...defaultProps}
    {...props}
  />);
  it('should render EvaltableRow component with value un-reject', () => {
    expect(wrapper).toHaveLength(1);
    expect(wrapper.find('Connect(EvalTableCell)').props().value).toBe('Un-reject');
  });
  it('should callonSelectReject on cell click', () => {
    wrapper.find('Connect(EvalTableCell)').props().click();
    expect(defaultProps.onSelectReject).toBeCalledTimes(1);
  });
});

describe('EvalTableRow :: Action SendToFEUW', () => {
  const { EvalTableRow } = TestHooks;
  const value = 'SendToFEUW';
  const disableSendToFEUW = false;
  const { row, user, searchLoanResult } = sendToFEUW;
  const history = [];
  const props = {
    value,
    history,
    disableSendToFEUW,
    row,
    user,
    searchLoanResult,
  };
  const wrapper = shallow(<EvalTableRow
    {...defaultProps}
    {...props}
  />);
  it('should render EvaltableRow component with value SendToFEUW', () => {
    expect(wrapper).toHaveLength(1);
    expect(wrapper.find('Connect(EvalTableCell)').props().value).toBe('SendToFEUW');
  });
  it('should onSendToFEUW on cell click', () => {
    wrapper.find('Connect(EvalTableCell)').props().click();
    wrapper.instance().handleLinkClick(null, value);
    expect(defaultProps.onSendToFEUW).toBeCalledTimes(1);
  });
});

describe('EvalTableRow :: Action Default', () => {
  const { EvalTableRow } = TestHooks;
  const value = 'Booking';
  const disableSendToFEUW = false;
  const { row, user, searchLoanResult } = actionDefault;
  const history = [];
  const props = {
    value,
    history,
    disableSendToFEUW,
    row,
    user,
    searchLoanResult,
  };
  const wrapper = shallow(<EvalTableRow
    {...defaultProps}
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
  const history = [];
  const props = {
    value,
    history,
    disableSendToFEUW,
    row,
    user,
    searchLoanResult,
  };
  const wrapper = shallow(<EvalTableRow
    {...defaultProps}
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
  const history = [];
  const props = {
    value,
    history,
    disableSendToFEUW,
    row,
    user,
    searchLoanResult,
  };
  const wrapper = shallow(<EvalTableRow
    {...defaultProps}
    {...props}
  />);
  it('should render EvaltableRow component with value Loan Activity', () => {
    expect(wrapper).toHaveLength(1);
  });
  it('should call setTombstoneDataForLoanView and onHistorySelect on cell click', () => {
    const stopPropagation = jest.fn();
    wrapper.find('WithStyles(ForwardRef(IconButton))').simulate('click', { stopPropagation }, 'LoanHistory');
    expect(defaultProps.setTombstoneDataForLoanView).toBeCalled();
    expect(defaultProps.onWidgetToggle).toBeCalled();
  });
});

describe('EvalTableRow :: Default', () => {
  const { EvalTableRow } = TestHooks;
  const value = 'Booking';
  const disableSendToFEUW = false;
  const { row, user, searchLoanResult } = defaultMock;
  const history = [];
  const props = {
    value,
    history,
    disableSendToFEUW,
    row,
    user,
    searchLoanResult,
  };
  const wrapper = shallow(<EvalTableRow
    {...defaultProps}
    {...props}
  />);
  it('should render EvaltableRow component with value default', () => {
    expect(wrapper).toHaveLength(1);
    expect(wrapper.find('Connect(EvalTableCell)').props().value).toBe('default');
  });
});
