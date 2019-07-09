import React from 'react';
import { shallow } from 'enzyme';
import { TestExports } from './CustomReactTable';

const data = {
  stagerTaskType: 'Value',
  stagerTaskStatus: 'To Order',
  isManualOrder: true,
  tableData: [
    {
      'Loan Number': '1800949230',
      TKIID: 2335257,
      'Eval ID': 1484821,
      Borrower: 'HERBERT DOE',
      'Co Borrower': '',
      'Investor Name': '',
      'LoanType Description': 'VA',
      'Investor Code': 'N04',
      'Days Until SLA': -5,
      'CFPB Days Until SLA': 16,
    },
  ],
};
describe('<CustomReactTable />', () => {
  it('shows CustomReactTable', () => {
    const wrapper = shallow(
      <TestExports.CustomReactTable
        data={data}
        onCheckBoxClick={() => {}}
        onSelectAll={() => {}}
        selectedData={[]}
      />,
    );
    wrapper.setProps({ data, selectedData: [] });
    expect(wrapper.find('ReactTable')).toHaveLength(1);
  });
});
