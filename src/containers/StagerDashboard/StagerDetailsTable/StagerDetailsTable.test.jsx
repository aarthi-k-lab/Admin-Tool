import React from 'react';
import { shallow } from 'enzyme';
import { TestExports } from './StagerDetailsTable';

const defaultProps = {
  azureSearchToggle: false,
  docGenAction: jest.fn(),
  getActiveSearchTerm: '',
  getSearchStagerLoanNumber: '',
  getStagerSearchResponse: '',
  getStagerValue: '',
  loading: false,
  onCheckBoxClick: jest.fn(),
  onClearDocGenAction: jest.fn(),
  onDownloadData: jest.fn(),
  onOrderClick: jest.fn(),
  onSelectAll: jest.fn(),
  triggerDispositionOperationCall: jest.fn(),
  triggerStagerGroup: jest.fn(),
  downloadedData: [],
};
describe('<StagerDetailsTable />', () => {
  const data = {
    stagerTaskType: 'LegalFee',
    stagerTaskStatus: 'ToOrder',
    isManualOrder: true,
    tableData: [{
      displayName: 'LegalFee',
    }],
  };
  it('shows StagerDetailsTable ', () => {
    const onOrderClick = jest.fn();
    const wrapper = shallow(
      <TestExports.StagerDetailsTable
        {...defaultProps}
        data={data}
        onOrderClick={onOrderClick}
        selectedData={{}}
      />,
    );
    expect(wrapper.find('WithStyles(ForwardRef(Grid))')).toHaveLength(3);
    expect(wrapper.find('WithStyles(ForwardRef(Button))')).toHaveLength(2);
    wrapper.find('WithStyles(ForwardRef(Button))').at(0).simulate('Click');
    expect(onOrderClick.mock.calls).toHaveLength(1);
    expect(wrapper.find('CustomReactTable')).toHaveLength(0);
  });

  it('shows StagerDetailsTable - Tasktype - Current Review', () => {
    data.stagerTaskType = 'Current Review';
    data.isManualOrder = true;
    const triggerDispositionOperationCall = jest.fn();
    const triggerStagerGroup = jest.fn();
    const onClearDocGenAction = jest.fn();
    const wrapper = shallow(
      <TestExports.StagerDetailsTable
        {...defaultProps}
        data={data}
        onClearDocGenAction={onClearDocGenAction}
        selectedData={{}}
        triggerDispositionOperationCall={triggerDispositionOperationCall}
        triggerStagerGroup={triggerStagerGroup}
      />,
    );
    expect(wrapper.find('WithStyles(ForwardRef(Grid))')).toHaveLength(3);
    expect(wrapper.find('WithStyles(ForwardRef(Button))')).toHaveLength(4);
    wrapper.find('WithStyles(ForwardRef(Button))').at(1).simulate('Click');
    expect(triggerDispositionOperationCall.mock.calls).toHaveLength(1);
    expect(wrapper.find('CustomReactTable')).toHaveLength(0);
  });

  it('shows Unselected Message', () => {
    const onOrderClick = jest.fn();
    const wrapper = shallow(
      <TestExports.StagerDetailsTable
        {...defaultProps}
        data={{}}
        onOrderClick={onOrderClick}
        selectedData={{}}
      />,
    );
    expect(wrapper.find('WithStyles(ForwardRef(Grid))')).toHaveLength(2);
  });
});
