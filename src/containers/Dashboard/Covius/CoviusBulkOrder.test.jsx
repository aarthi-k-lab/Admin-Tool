import React from 'react';
import { shallow } from 'enzyme';
import { TestHooks } from './CoviusBulkOrder';

describe('renders <CoviusBulkOrder />', () => {
  it('renders download button', () => {
    const wrapper = shallow(
      <TestHooks.CoviusBulkOrder />,
    );
    expect(wrapper.instance().state.isVisible).toBe(true);
    expect(wrapper.find('WithStyles(ForwardRef(Button))').at(2)).toHaveLength(1);
  });
  it('downloads the excel when download button is clicked', () => {
    const coviusSubmitData = {
      passed:
            [{
              caseId: 32,
              message: 'mock1',
            }],
      failed:
            [{
              caseId: 32,
              message: 'mock1',
            }],
    };
    const wrapper = shallow(
      <TestHooks.CoviusBulkOrder coviusSubmitData={coviusSubmitData} />,
    );
    expect(wrapper.instance().state.isVisible).toBe(true);
    wrapper.find('WithStyles(ForwardRef(Button))').at(2).simulate('Click');
    wrapper.instance().handleDownload();
  });
});
