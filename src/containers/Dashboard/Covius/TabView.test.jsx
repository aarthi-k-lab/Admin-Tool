import React from 'react';
import { shallow, mount } from 'enzyme';
import { TestHooks } from './TabView';

describe('renders <TabView />', () => {
  it('renders Failed Tab', () => {
    const wrapper = shallow(
      <TestHooks.TabView />,
    );
    wrapper.setState({ value: 0 });
    expect(wrapper.find('TabPanel#failedTab')).toHaveLength(1);
  });
  it('renders Passed Tab', () => {
    const wrapper = shallow(
      <TestHooks.TabView />,
    );
    wrapper.setState({ value: 1 });
    expect(wrapper.find('TabPanel#passedTab')).toHaveLength(1);
  });
  it('renders Upload Tab', () => {
    const wrapper = shallow(
      <TestHooks.TabView />,
    );
    wrapper.setState({ value: 2 });
    expect(wrapper.find('TabPanel#uploadTab')).toHaveLength(1);
  });
  it('renders Upload Tab on UploadTab Selection', () => {
    const wrapper = shallow(
      <TestHooks.TabView />,
    );
    wrapper.setState({ value: 2 });
    expect(wrapper.find('WithStyles(ForwardRef(Grid))').at(2)).toHaveLength(1);
  });
  it('renders SubmitError when the file upload is non excel', () => {
    const wrapper = mount(
      <TestHooks.TabView />,
    );
    wrapper.setState({ isFailed: true, value: 2 });
    expect(wrapper.find('SubmitFileError')).toHaveLength(1);
  });
  it('renders SubmitToCovius page when the file upload is successful', () => {
    const isFileRemoved = false;
    const wrapper = shallow(
      <TestHooks.TabView isFileRemoved={isFileRemoved} />,
    );
    wrapper.setState({ buttonState: 'SUBMIT', value: 2 });
    expect(wrapper.find('#reupload')).toHaveLength(1);
  });
  it('Upload file when the upload button is clicked', () => {
    const checkButtonState = true;
    const onDeleteFile = jest.fn();
    const wrapper = shallow(
      <TestHooks.TabView checkButtonState={checkButtonState} onDeleteFile={onDeleteFile} />,
    );
    wrapper.setState({ value: 2 });
    wrapper.find('#upload').at(0).simulate('click');
    wrapper.instance().handleChange();
    expect(onDeleteFile.mock.calls).toHaveLength(1);
  });
});
