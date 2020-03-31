import React from 'react';
import { shallow } from 'enzyme';
import { TestHooks } from './CoviusBulkOrder';

describe('renders <CoviusBulkOrder />', () => {
  const wrapper = shallow(
    <TestHooks.CoviusBulkOrder />,
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
  const mockData = {
    DocumentRequests: [],
    invalidCases:
      [{
        caseId: 32,
        message: 'mock1',
      }],
  };

  const wrapper = shallow(
    <TestHooks.CoviusBulkOrder resultData={mockData} />,
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

describe('Reset Button Enabling', () => {
  const wrapper = shallow(
    <TestHooks.CoviusBulkOrder />,
  );
  const resetButton = wrapper.find('WithStyles(WithFormControlContext(ForwardRef(FormLabel)))');
  it('enables reset button when any event category is selected', () => {
    wrapper.find('WithStyles(WithFormControlContext(ForwardRef(Select)))#eventCategoryDropdown').simulate('change', { target: { value: 'X Request' } });
    expect(wrapper.instance().state.isResetDisabled).toBe(false);
  });
  it('disables reset button when fields are reset', () => {
    resetButton.simulate('Click');
    expect(wrapper.instance().state.isResetDisabled).toBe(true);
  });
  it('enables reset button when any case id is entered', () => {
    wrapper.find('ForwardRef(TextareaAutosize)#caseIds').simulate('change', { target: { value: '123' } });
    expect(wrapper.instance().state.isResetDisabled).toBe(false);
  });
  resetButton.simulate('Click');
});

describe('Submit Button Enabling', () => {
  const wrapper = shallow(
    <TestHooks.CoviusBulkOrder />,
  );
  it('enables submit button only when all the input values are entered', () => {
    wrapper.find('WithStyles(WithFormControlContext(ForwardRef(Select)))#eventCategoryDropdown').simulate('change', { target: { value: 'X Request' } });
    expect(wrapper.instance().state.isSubmitDisabled).toBe('disabled');

    wrapper.find('WithStyles(WithFormControlContext(ForwardRef(Select)))#eventNamesDropdown').simulate('change', { target: { value: 'Post Data' } });
    expect(wrapper.instance().state.isSubmitDisabled).toBe('disabled');

    wrapper.find('ForwardRef(TextareaAutosize)#caseIds').simulate('change', { target: { value: '123' } });
    expect(wrapper.instance().state.isSubmitDisabled).toBe('');
  });

  it('disables submit button when any input value is cleared', () => {
    wrapper.find('ForwardRef(TextareaAutosize)#caseIds').simulate('change', { target: { value: '' } });
    expect(wrapper.instance().state.isSubmitDisabled).toBe('disabled');
  });
});


// it('downloads the excel when download button is clicked', () => {
//   const coviusSubmitData = {
//     passed:
//       [{
//         caseId: 32,
//         message: 'mock1',
//       }],
//     failed:
//       [{
//         caseId: 32,
//         message: 'mock1',
//       }],
//   };
//   const wrapper = shallow(
//     <TestHooks.CoviusBulkOrder coviusSubmitData={coviusSubmitData} />,
//   );
//   console.log(wrapper.debug());
//   expect(wrapper.instance().state.isVisible).toBe(true);
//   wrapper.find('WithStyles(ForwardRef(Button))').at(2).simulate('Click');
//   wrapper.instance().handleDownload();
// });
