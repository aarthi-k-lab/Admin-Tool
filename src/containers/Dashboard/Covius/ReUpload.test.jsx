import React from 'react';
import { shallow } from 'enzyme';
import { TestHooks } from './ReUploadFile';

describe('renders <ReUploadFile />', () => {
  const fileName = 'hello.xls';
  const onChange = jest.fn();
  const refreshPage = jest.fn();
  const onDeleteFile = jest.fn();
  const switchToUploadFailedTab = jest.fn();
  const getSubmitFileResponse = {
    message: 'mock msg',
    level: 'success',
  };
  const onSubmitFile = jest.fn();

  it('renders textField successfully', () => {
    const wrapper = shallow(
      <TestHooks.ReUploadFile
        fileName={fileName}
        getSubmitFileResponse={getSubmitFileResponse}
        onChange={onChange}
        onDeleteFile={onDeleteFile}
        onSubmitFile={onSubmitFile}
        refreshPage={refreshPage}
        switchToUploadFailedTab={switchToUploadFailedTab}
      />,
    );
    expect(wrapper.find('WithStyles(ForwardRef(Grid))')).toHaveLength(8);
  });
  it('renders icon and success message, submit and delete button successfully', () => {
    const wrapper = shallow(
      <TestHooks.ReUploadFile
        fileName={fileName}
        getSubmitFileResponse={getSubmitFileResponse}
        onChange={onChange}
        onDeleteFile={onDeleteFile}
        onSubmitFile={onSubmitFile}
        refreshPage={refreshPage}
        switchToUploadFailedTab={switchToUploadFailedTab}
      />,
    );
    expect(wrapper.find('WithStyles(ForwardRef(TextField))')).toHaveLength(1);
  });
  it('doesnt renders notification when the no file been uploded', () => {
    const response = {};
    const wrapper = shallow(
      <TestHooks.ReUploadFile
        fileName={fileName}
        getSubmitFileResponse={response}
        onChange={onChange}
        onSubmitFile={onSubmitFile}
        refreshPage={refreshPage}
        switchToUploadFailedTab={switchToUploadFailedTab}
      />,
    );
    wrapper.find('#submit').at(0).simulate('click');
    expect(wrapper.find('WithStyles(ForwardRef(SweetAlert))')).toHaveLength(0);
  });
  it('renders notification after submit button action', () => {
    const response = {
      message: '',
      level: '',
    };
    const wrapper = shallow(
      <TestHooks.ReUploadFile
        fileName={fileName}
        getSubmitFileResponse={response}
        onChange={onChange}
        onDeleteFile={onDeleteFile}
        onSubmitFile={onSubmitFile}
        refreshPage={refreshPage}
        switchToUploadFailedTab={switchToUploadFailedTab}
      />,
    );
    wrapper.find('#submit').at(0).simulate('click');
    expect(onSubmitFile).toBeCalled();
    expect(wrapper.find('WithStyles(ForwardRef(SweetAlert))')).toHaveLength(0);
  });
  it('redirects to upload page when delete button is clicked', () => {
    const wrapper = shallow(
      <TestHooks.ReUploadFile
        fileName={fileName}
        getSubmitFileResponse={getSubmitFileResponse}
        onChange={onChange}
        onDeleteFile={onDeleteFile}
        onSubmitFile={onSubmitFile}
        refreshPage={refreshPage}
        switchToUploadFailedTab={switchToUploadFailedTab}
      />,
    );
    wrapper.find('#delete').at(0).simulate('click');
    expect(onChange.mock.calls).toHaveLength(1);
  });
});
