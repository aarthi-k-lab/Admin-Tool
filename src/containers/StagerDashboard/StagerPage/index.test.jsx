import React from 'react';
import { shallow } from 'enzyme';
import { TestExports } from './StagerPage';

const groups = ['post-mod-stager', 'post-mod-stager-mgr', 'stager-mgr', 'stager'];
const defaultProps = {
  activeTile: '',
  bulkOrderPageType: '',
  counts: [],
  dispositionCode: '',
  getStagerSearchResponse: { loanNumber: '', titleType: '', titleValue: '' },
  group: '',
  history: [],
  isFirstVisit: false,
  loading: false,
  onCheckBoxClick: jest.fn(),
  onCleanResult: jest.fn(),
  onClearBulkUploadDataAction: jest.fn(),
  onClearDocGenAction: jest.fn(),
  onClearStagerResponse: jest.fn(),
  onDocGenClick: jest.fn(),
  onGetGroupName: jest.fn(),
  onGetNext: jest.fn(),
  onOrderClick: jest.fn(),
  onSelectAll: jest.fn(),
  onStagerChange: jest.fn(),
  onStatusCardClick: jest.fn(),
  refreshDashboard: jest.fn(),
  selectedData: [
    {
      TKIID: '',
    },
  ],
  setPageType: jest.fn(),
  setStagerTaskName: jest.fn(),
  stager: '',
  stagerTaskName: {},
  tableData: [],
  triggerStagerSearchLoan: jest.fn(),
  triggerStagerValue: jest.fn(),
  popupData: {
    hitLoans: [],
    missedLoans: [],
  },
};
describe('<StagerPage />', () => {
  it('shows StagerPage', () => {
    const triggerStagerValue = jest.fn();
    const wrapper = shallow(
      <TestExports.StagerPage {...defaultProps} groups={groups} stager="ALL_STAGER" triggerStagerValue={triggerStagerValue} />,
    );
    expect(wrapper.find('ContentHeader')).toHaveLength(0);
    expect(wrapper.find('WithStyles(ForwardRef(Grid))')).toHaveLength(3);
    expect(wrapper.find('Connect(StagerDetailsTable)')).toHaveLength(1);
    expect(wrapper.find('StagerTiles')).toHaveLength(1);
  });
});
