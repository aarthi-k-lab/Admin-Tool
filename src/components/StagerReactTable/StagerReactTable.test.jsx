import React from 'react';
import { shallow } from 'enzyme';
import { TestExports } from './StagerReactTable';

const data = {
  stagerTaskType: 'Value',
  stagerTaskStatus: 'To Order',
  isManualOrder: true,
  facets: {
    'Loan Number': ['1800949230'],
    TKIID: [2335257],
    'Eval ID': [1484821],
    Borrower: ['HERBERT DOE'],
    'Co Borrower': [''],
    'Investor Name': [''],
    'LoanType Description': ['VA'],
    'Investor Code': ['N04'],
    'Days Until SLA': [-5],
    'CFPB Days Until SLA': [16],
  },
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
describe('<StagerReactTable />', () => {
  it('shows StagerReactTable', () => {
    const wrapper = shallow(
      <TestExports.StagerReactTable
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
