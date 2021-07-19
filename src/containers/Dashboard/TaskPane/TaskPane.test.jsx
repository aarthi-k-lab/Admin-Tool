import React from 'react';
import { shallow } from 'enzyme';
import { TestHooks } from './TaskPane';

const defaultProps = {
  dataLoadStatus: '',
  fetchPdfGeneratorUrl: jest.fn(),
  group: '',
  handleShowDeleteTaskConfirmation: jest.fn(),
  handleShowOptionalTasks: jest.fn(),
  historicalCheckListData: [],
  isAssigned: false,
  onSubTaskClick: jest.fn(),
  pdfExportPayload: {},
  pdfGeneratorConstant: '',
  resetDeleteTaskConfirmation: jest.fn(),
  selectedTaskId: '',
  shouldDeleteTask: false,
  showOptionalTasks: false,
  storeTaskFilter: jest.fn(),
  updateChecklist: jest.fn(),
};
describe('<TombstoneWrapper />', () => {
  it('shows TaskPane', () => {
    const handleClick = jest.fn();
    const wrapper = shallow(
      <TestHooks.TaskPane {...defaultProps} fetchPdfGeneratorUrl={handleClick} getTasks={() => {}} isAccessible />,
    );
    expect(wrapper.find('LeftTaskPane')).toHaveLength(1);
  });
});
