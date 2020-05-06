import React from 'react';
import { shallow } from 'enzyme';
import SweetAlertBox from 'components/SweetAlertBox';
import { TestHooks } from './SearchLoan';


describe.only('Search Loan ', () => {
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
    const wrapper = shallow(<SearchLoan
      closeSweetAlert={closeSweetAlert}
      getRejectResponse={getRejectResponse}
      onClearStagerTaskName={onClearStagerTaskName}
      resultOperation={resultOperation}
      searchLoanResult={searchLoanResult}
    />);
    expect(wrapper.find(SweetAlertBox)).toHaveLength(1);
  });

  it('does not show Sweet Alert when resultOperation is empty', () => {
    const { SearchLoan } = TestHooks;
    const resultOperation = {};
    const getRejectResponse = {};
    const searchLoanResult = {};
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
  });

  it('does not show Sweet Alert when resultOperation is undefined', () => {
    const { SearchLoan } = TestHooks;
    const getRejectResponse = {};
    const searchLoanResult = {};
    const closeSweetAlert = jest.fn();
    const onClearStagerTaskName = jest.fn();
    const wrapper = shallow(<SearchLoan
      closeSweetAlert={closeSweetAlert}
      getRejectResponse={getRejectResponse}
      onClearStagerTaskName={onClearStagerTaskName}
      searchLoanResult={searchLoanResult}
    />);
    expect(wrapper.find(SweetAlertBox)).toHaveLength(0);
  });
});
