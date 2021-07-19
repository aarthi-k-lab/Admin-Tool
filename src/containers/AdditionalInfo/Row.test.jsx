import React from 'react';
import renderer from 'react-test-renderer';
import Row from './Row';

const onClick = jest.fn();
describe('renders <Row /> when changeColor is true', () => {
  const props = {
    onClick,
    data: {
      evalId: 'evalId',
      resolutionId: 'resolutionId',
      statusDate: '2015-11-10 03:19:42.4',
      status: 'status',
      substatus: 'subStatus',
      loanNumber: 'loanNumber',
      substatusDate: '2015-11-10 03:19:42.4',
      evalHistory: [{
        EvalId: 'EvalId',
        ChangeType: 'ChangeType',
        ApprovalType: 'ApprovalType',
        UpdateDate: 'UpdateDate',
        UserName: 'UserName',
      }],
    },
    changeColor: true,
  };
  test('snapshot test', () => {
    const tree = renderer
      .create(<Row {...props} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});

describe('renders <Row /> when changeColor is false', () => {
  const props = {
    onClick,
    data: {
      evalId: 'evalId',
      resolutionId: 'resolutionId',
      statusDate: '2015-11-10 03:19:42.4',
      status: 'status',
      substatus: 'subStatus',
      loanNumber: 'loanNumber',
      substatusDate: '2015-11-10 03:19:42.4',
      evalHistory: [{
        EvalId: 'EvalId',
        ChangeType: 'ChangeType',
        ApprovalType: 'ApprovalType',
        UpdateDate: 'UpdateDate',
        UserName: 'UserName',
      }],
    },
    changeColor: false,
  };
  test('snapshot test', () => {
    const tree = renderer
      .create(<Row {...props} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
