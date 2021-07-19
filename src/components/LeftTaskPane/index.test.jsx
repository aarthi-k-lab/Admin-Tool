import React from 'react';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';
import LeftTaskPane from './LeftTaskPane';

const defaultProps = {
  disableModifyOptionalTasks: false,
  handleShowDeleteTaskConfirmation: jest.fn(),
  handleShowOptionalTasks: jest.fn(),
  onSubTaskClick: jest.fn(),
  pdfExportPayload: {},
  pdfGeneratorConstant: '',
  resetDeleteTaskConfirmation: jest.fn(),
  shouldDeleteTask: false,
  showExportChecklist: false,
  showOptionalTasks: false,
  storeTaskFilter: jest.fn(),
  updateChecklist: jest.fn(),
};
describe('<LeftTaskPane Components />', () => {
  it('LeftTaskPane renders correctly', () => {
    const tree = renderer
      .create(<LeftTaskPane {...defaultProps} historicalCheckListData={[]} optionalTasks={[]} tasks={[]} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
