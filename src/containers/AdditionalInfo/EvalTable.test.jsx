import React from 'react';
import renderer from 'react-test-renderer';
import EvalTable from './EvalTable';

const selectRow = jest.fn();
describe('renders <EvalTable /> when selected index is 0', () => {
  const props = {
    selectRow,
    rows: [{
      evalId: 'evalId',
      resolutionId: 'resolutionId',
      statusDate: '2021-05-05',
      status: 'status',
      substatus: 'subStatus',
      loanNumber: 'loanNumber',
      substatusDate: '2021-05-05',
      evalHistory: [{
        EvalId: 'EvalId',
        ChangeType: 'ChangeType',
        ApprovalType: 'ApprovalType',
        UpdateDate: '2021-05-05',
        UserName: 'UserName',
      }],
    },
    {
      evalId: 'evalId1',
      resolutionId: 'resolutionId1',
      statusDate: '2021-05-05',
      status: 'status1',
      substatus: 'subStatus1',
      loanNumber: 'loanNumber1',
      substatusDate: '2021-05-05',
      evalHistory: [{
        EvalId: 'EvalId1',
        ChangeType: 'ChangeType1',
        ApprovalType: 'ApprovalType1',
        UpdateDate: '2021-05-05',
        UserName: 'UserName1',
      }],
    }],
    selectedIndex: 1,
  };
  test('snapshot test', () => {
    const tree = renderer
      .create(<EvalTable {...props} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});

describe('renders <EvalTable /> when selected index is 1', () => {
  const props = {
    selectRow,
    rows: [{
      evalId: 'evalId',
      resolutionId: 'resolutionId',
      statusDate: '2021-05-05',
      status: 'status',
      substatus: 'subStatus',
      loanNumber: 'loanNumber',
      substatusDate: '2021-05-05',
      evalHistory: [{
        EvalId: 'EvalId',
        ChangeType: 'ChangeType',
        ApprovalType: 'ApprovalType',
        UpdateDate: '2021-05-05',
        UserName: 'UserName',
      }],
    },
    {
      evalId: 'evalId1',
      resolutionId: 'resolutionId1',
      statusDate: '2021-05-05',
      status: 'status1',
      substatus: 'subStatus1',
      loanNumber: 'loanNumber1',
      substatusDate: '2021-05-05',
      evalHistory: [{
        EvalId: 'EvalId1',
        ChangeType: 'ChangeType1',
        ApprovalType: 'ApprovalType1',
        UpdateDate: '2021-05-05',
        UserName: 'UserName1',
      }],
    }],
    selectedIndex: 1,
  };
  test('snapshot test', () => {
    const tree = renderer
      .create(<EvalTable {...props} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
