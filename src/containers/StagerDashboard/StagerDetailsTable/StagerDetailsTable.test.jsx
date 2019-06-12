import React from 'react';
import { shallow } from 'enzyme';
import { TestExports } from './StagerDetailsTable';

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
      <TestExports.StagerDetailsTable data={data} onOrderClick={onOrderClick} selectedData={[]} />,
    );
    expect(wrapper.find('WithStyles(Grid)')).toHaveLength(3);
    expect(wrapper.find('WithStyles(Button)')).toHaveLength(2);
    wrapper.find('WithStyles(Button)').at(0).simulate('Click');
    expect(onOrderClick.mock.calls).toHaveLength(1);
    expect(wrapper.find('Connect(CustomReactTable)')).toHaveLength(1);
  });

  it('shows StagerDetailsTable - Tasktype - Current Review', () => {
    data.stagerTaskType = 'CurrentReview';
    data.isManualOrder = true;
    const triggerDispositionOperationCall = jest.fn();
    const onClearDocGenAction = jest.fn();
    const wrapper = shallow(
      <TestExports.StagerDetailsTable
        data={data}
        onClearDocGenAction={onClearDocGenAction}
        selectedData={[]}
        triggerDispositionOperationCall={triggerDispositionOperationCall}
      />,
    );
    expect(wrapper.find('WithStyles(Grid)')).toHaveLength(3);
    expect(wrapper.find('WithStyles(Button)')).toHaveLength(4);
    wrapper.find('WithStyles(Button)').at(1).simulate('Click');
    expect(triggerDispositionOperationCall.mock.calls).toHaveLength(1);
    expect(wrapper.find('Connect(CustomReactTable)')).toHaveLength(1);
  });

  it('shows Unselected Message', () => {
    const onOrderClick = jest.fn();
    const wrapper = shallow(
      <TestExports.StagerDetailsTable data={{}} onOrderClick={onOrderClick} selectedData={[]} />,
    );
    expect(wrapper.find('WithStyles(Grid)')).toHaveLength(2);
  });
});
