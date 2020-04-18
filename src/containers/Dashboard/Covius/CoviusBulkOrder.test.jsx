import React from 'react';
import { shallow } from 'enzyme';
import { TestHooks } from './CoviusBulkOrder';

describe('renders <CoviusBulkOrder />', () => {
  const getDownloadResponse = {
    message: 'mock',
    level: 'level',
  };
  const clearSubmitDataResponse = jest.fn();
  const wrapper = shallow(
    <TestHooks.CoviusBulkOrder
      clearSubmitDataResponse={clearSubmitDataResponse}
      getDownloadResponse={getDownloadResponse}
    />,
  );
  const wrapperState = wrapper.instance().state;
  it('renders download button', () => {
    expect(wrapperState.isVisible).toBe(true);
    const element = wrapper.find('WithStyles(ForwardRef(Button))#download');
    expect(element.text()).toBe('DOWNLOAD EXCEL TO VERIFY');
    expect(wrapperState.isDownloadDisabled).toBe('disabled');
  });

  it('renders reset button', () => {
    const element = wrapper.find('WithStyles(WithFormControlContext(ForwardRef(FormLabel)))');
    expect(element.text()).toBe('RESET');
    expect(wrapperState.isResetDisabled).toBe(true);
  });

  it('renders submit button', () => {
    const element = wrapper.find('WithStyles(ForwardRef(Button))#submitButton');
    expect(element.text()).toBe('SUBMIT');
    expect(wrapperState.isSubmitDisabled).toBe('disabled');
  });
});

describe('Download Button Enabling', () => {
  const getDownloadResponse = {
    message: 'mock',
    level: 'level',
  };
  const mockData = {
    DocumentRequests: [],
    invalidCases:
      [{
        caseId: 32,
        message: 'mock1',
      }],
  };
  const clearSubmitDataResponse = jest.fn();

  const wrapper = shallow(
    <TestHooks.CoviusBulkOrder
      clearSubmitDataResponse={clearSubmitDataResponse}
      getDownloadResponse={getDownloadResponse}
      resultData={mockData}
    />,
  );

  it('disables download button in the passed tab when there are no passed caseid(s)', () => {
    wrapper.find('Connect(TabView)').simulate('change', false, 1);
    expect(wrapper.instance().state.isDownloadDisabled).toBe('disabled');
  });

  it('enables download button in the failed tab only when there is at least 1 failed caseid', () => {
    wrapper.find('Connect(TabView)').simulate('change', false, 0);
    expect(wrapper.instance().state.isDownloadDisabled).toBe('');
  });


  it('enables download button in the passed tab only when there is at least 1 passed caseid', () => {
    wrapper.setProps({
      resultData: {
        DocumentRequests:
          [{
            RequestId: '50063C7C-AC12-4035-9F96-9F4FCADEEC1E',
            UserFields: {
              EVAL_ID: '3468435146',
              CASEID: '3516543',
              LOAN_NUMBER: '3468435146',
            },
          }],
        invalidCases: [],
      },
    });

    wrapper.find('Connect(TabView)').simulate('change', false, 1);
    expect(wrapper.instance().state.isDownloadDisabled).toBe('');
  });

  it('disables download button in the failed tab when there are no failed caseid(s)', () => {
    wrapper.find('Connect(TabView)').simulate('change', false, 0);
    expect(wrapper.instance().state.isDownloadDisabled).toBe('disabled');
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
  expect(wrapper.instance().state.isVisible).toBe(true);
  wrapper.find('#download').simulate('Click');
  wrapper.instance().handleDownload();
  expect(downloadFile.mock.calls).toHaveLength(2);
});
