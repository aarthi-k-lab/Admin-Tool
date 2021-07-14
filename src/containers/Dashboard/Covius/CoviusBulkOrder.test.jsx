import React from 'react';
import { shallow } from 'enzyme';
import {
  select,
} from 'redux-saga/effects';
import DashboardModel from 'models/Dashboard';
import { selectors } from '../../../state/ducks/dashboard';
import { TestHooks } from './CoviusBulkOrder';

describe('renders <CoviusBulkOrder />', () => {
  const getDownloadResponse = {
    message: 'mock',
    level: 'level',
  };
  const clearSubmitDataResponse = jest.fn();
  const onCoviusBulkSubmit = jest.fn();
  const onResetData = jest.fn();
  const coviusEventOptions = [{
    eventCategory: 'mock',
    eventCode: 123,
  }];
  const wrapper = shallow(
    <TestHooks.CoviusBulkOrder
      clearSubmitDataResponse={clearSubmitDataResponse}
      coviusEventOptions={coviusEventOptions}
      getDownloadResponse={getDownloadResponse}
      onCoviusBulkSubmit={onCoviusBulkSubmit}
      onResetData={onResetData}
    />,
  );
  const wrapperState = wrapper.instance().state;
  it('renders download button', () => {
    expect(select(selectors.getCoviusTabIndex)).not.toBe(2);
    const element = wrapper.find('WithStyles(ForwardRef(Button))#download');
    expect(element.text()).toBe('DOWNLOAD EXCEL TO VERIFY');
    expect(wrapper.instance().isDownloadDisabled()).toBe(true);
  });

  it('renders reset button', () => {
    const element = wrapper.find('WithStyles(ForwardRef(FormLabel))');
    expect(element.text()).toBe('RESET');
    expect(wrapperState.isResetDisabled).toBe(true);
  });

  it('renders submit button', () => {
    const element = wrapper.find('WithStyles(ForwardRef(Button))#submitButton');
    expect(element.text()).toBe('SUBMIT');
    expect(wrapperState.isSubmitDisabled).toBe('disabled');
  });

  it('should call onCoviusBulkSubmit on Submit click', () => {
    wrapper.find('WithStyles(ForwardRef(Button))#submitButton').simulate('click');
    expect(onCoviusBulkSubmit).toBeCalled();
  });

  it('should call onResetData on eventCategoryChange', () => {
    wrapper.find('WithStyles(ForwardRef(Select))').at(0).simulate('change', { target: { value: 'mock' } });
    expect(onResetData).toBeCalled();
  });
  it('should call handleCaseChange on TextField Change', () => {
    wrapper.find('ForwardRef(TextareaAutosize)').at(0).simulate('change', { target: { value: '123' } });
    expect(wrapper.instance().state.ids).toBe('123');
  });
});

describe('Download Button Enabling', () => {
  const getDownloadResponse = {
    message: 'mock',
    level: 'level',
  };
  const mockData = {
    request: [],
    invalidCases:
      [{
        caseId: 32,
        reason: 'mock1',
      }],
  };
  const clearSubmitDataResponse = jest.fn();
  const submitToCovius = jest.fn();

  const wrapper = shallow(
    <TestHooks.CoviusBulkOrder
      clearSubmitDataResponse={clearSubmitDataResponse}
      getDownloadResponse={getDownloadResponse}
      resultData={mockData}
      submitToCovius={submitToCovius}
    />,
  );

  it('disables download button in the failed tab when there are no failed caseid(s)', () => {
    wrapper.setProps({
      coviusTabIndex: 0,
      resultData: {},
    });
    expect(wrapper.instance().isDownloadDisabled()).toBe(true);
  });

  it('disables download button in the passed tab when there are no passed caseid(s)', () => {
    wrapper.setProps({
      coviusTabIndex: 1,
      resultData: {
      },
    });
    expect(wrapper.instance().isDownloadDisabled()).toBe(true);
  });

  it('enables download button in the passed tab only when there is at least 1 passed caseid', () => {
    wrapper.setProps({
      eventCategory: DashboardModel.EVENT_CATEGORY_FILTER,
      resultData: {
        request:
          [{
            RequestId: '50063C7C-AC12-4035-9F96-9F4FCADEEC1E',
            UserFields: {
              EvalId: '3468435146',
              CaseId: '3516543',
              LoanNumber: '3468435146',
            },
          }],
      },
      coviusTabIndex: 1,
    });
    expect(wrapper.instance().isDownloadDisabled()).toBe(false);
  });

  it('enables download button in the failed tab only when there is at least 1 failed caseid', () => {
    wrapper.setProps({
      coviusTabIndex: 0,
      resultData: {
        invalidCases: [
          {
            caseId: '354654',
            reason: "CaseId doesn't exist",
          },
        ],
      },
    });
    expect(wrapper.instance().isDownloadDisabled()).toBe(false);
  });
  it('renders SUBMIT TO COVIUS Button', () => {
    wrapper.setProps({
      eventCategory: DashboardModel.EVENT_CATEGORY_FILTER,
      resultData: {
        request:
          [{
            RequestId: '50063C7C-AC12-4035-9F96-9F4FCADEEC1E',
            UserFields: {
              EvalId: '3468435146',
              CaseId: '3516543',
              LoanNumber: '3468435146',
            },
          }],
      },
      coviusTabIndex: 1,
    });
    expect(wrapper.find('WithStyles(ForwardRef(Button))').at(1).text()).toBe('SUBMIT TO COVIUS');
    wrapper.find('WithStyles(ForwardRef(Button))').at(1).simulate('click');
    expect(submitToCovius).toBeCalled();
    wrapper.find('Connect(TabView)').simulate('reset');
    expect(wrapper.instance().state.selectedEventCategory).toBe(' ');
  });
});


it('downloads the excel when download button is clicked', () => {
  const getDownloadResponse = {
    message: 'mock',
    level: 'level',
  };
  const downloadFile = jest.fn();
  const clearSubmitDataResponse = jest.fn();
  const wrapper = shallow(
    <TestHooks.CoviusBulkOrder
      clearSubmitDataResponse={clearSubmitDataResponse}
      downloadFile={downloadFile}
      getDownloadResponse={getDownloadResponse}
    />,
  );
  expect(select(selectors.getCoviusTabIndex)).not.toBe(2);
  wrapper.find('#download').simulate('Click');
  wrapper.instance().handleDownload();
  expect(downloadFile.mock.calls).toHaveLength(2);
});

describe('SweetAlert functionality', () => {
  const getDownloadResponse = {
    message: 'mock',
    level: 'level',
  };
  const clearSubmitDataResponse = jest.fn();
  const closeSweetAlert = jest.fn();
  const onResetData = jest.fn();
  const resultOperation = {
    clearData: 'mock',
  };
  const props = {
    resultOperation,
    closeSweetAlert,
    onResetData,
    clearSubmitDataResponse,
    getDownloadResponse,
  };

  const wrapper = shallow(
    <TestHooks.CoviusBulkOrder
      {...props}
    />,
  );
  it('should close the sweet alert', () => {
    expect(wrapper.find('SweetAlertBox')).toHaveLength(1);
    wrapper.find('SweetAlertBox').simulate('confirm');
    expect(onResetData).toBeCalled();
    expect(closeSweetAlert).toBeCalled();
  });
});
