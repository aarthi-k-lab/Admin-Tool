import React from 'react';
import { shallow } from 'enzyme';
import { TestHooks } from './AdditionalInfo';

describe('<AdditionalInfo>', () => {
  const { AdditionalInfo } = TestHooks;
  const evalCaseDetails = [
    {
      cardHistoryDetails: [],
      cardDetails: [{
        LoanId: '',
        UserName: '',
      }],
      status: 'Rejected',
      resolutionId: '2493005',
      evalHistory: [],
      loanNumber: '623503778',
      evalId: '0',
      statusDate: '2015-03-23 03:30:35.797',
      substatusDate: null,
      substatus: null,
    },
    {
      cardHistoryDetails: [],
      cardDetails: [{
        LoanId: '',
        UserName: '',
      }],
      status: 'Rejected',
      resolutionId: '2756082',
      evalHistory: [
        {
          EvalId: '411405',
          ApprovalType: 'Rejected',
          UpdateDate: '2015-11-10T03:19:42.400',
          UserName: 'Rohan Khot',
          ChangeType: 'Status',
        },
        {
          EvalId: '411405',
          ApprovalType: 'Sent for Reject',
          UpdateDate: '2015-11-01T13:36:07.950',
          UserName: ' Remedy',
          ChangeType: 'SubStatus',
        },
        {
          EvalId: '411405',
          ApprovalType: 'Referral KB',
          UpdateDate: '2015-10-07T10:29:38.833',
          UserName: 'Ajinkya Kshirsagar',
          ChangeType: 'SubStatus',
        },
        {
          EvalId: '411405',
          ApprovalType: 'Sent for Reject',
          UpdateDate: '2015-10-01T03:42:13.603',
          UserName: ' Remedy',
          ChangeType: 'SubStatus',
        },
        {
          EvalId: '411405',
          ApprovalType: 'Approved',
          UpdateDate: '2015-08-07T11:47:32',
          UserName: ' Remedy',
          ChangeType: 'Status',
        },
      ],
      loanNumber: '623503778',
      evalId: '411405',
      statusDate: '2015-11-10 03:19:42.4',
      substatusDate: '2015-11-01 13:36:07.95',
      substatus: 'Sent for Reject',
    },
  ];
  const caseDetails = [
    {
      cardHistoryDetails: [
        {
          Values: [
            {
              CaseId: 2493005,
              ApprovalType: 'Rejected',
              ActionDate: '2015-03-23T03:30:35.847',
              UserName: ' Remedy',
              ChangeType: 'Status',
              ReasonCode: 14,
              Comment: '14 - Trial Plan Default',
              SourceName: 'Remedy',
            },
            {
              CaseId: 2493005,
              ApprovalType: 'UnRejected',
              ActionDate: '2015-03-05T14:33:38.940',
              UserName: 'Aaron Albert',
              ChangeType: 'Status',
              SourceName: 'Aaron Albert',
            },
          ],
        },
      ],
      resolutionId: '2493005',
      cardDetails: [
        {
          ResolutionChoiceType: 'Repayment Plan',
          CaseOpenDate: '2015-03-05T10:29:53.797',
          Status: 'Rejected',
          StatusDate: '2015-03-23T03:30:35.797',
          LockedDate: '2015-03-05T10:29:53.797',
          ApprovedDate: '2015-03-05T10:29:53.797',
        },
      ],
      loanId: '623503778',
      evalId: '0',
    },
  ];
  const evalRowSelect = jest.fn();
  it('should render the AdditionalInfo', () => {
    const props = {
      evalCaseDetails,
      caseDetails,
      evalRowSelect,
      index: 0,
      value: 0,
    };
    const wrapper = shallow(
      <AdditionalInfo {...props} />,
    );
    expect(wrapper.find('Fragment')).toHaveLength(1);
    wrapper.find('WithStyles(ForwardRef(Tabs))').simulate('change');
    wrapper.find('EvalTable').props().selectRow(0, 0);
    expect(evalRowSelect).toBeCalledTimes(1);
  });
  it('should not render the EvalTable on empty evalCaseDetails', () => {
    const props = {
      evalCaseDetails: [],
      caseDetails: [],
      evalRowSelect,
      index: 0,
      value: 0,
    };
    const wrapper = shallow(
      <AdditionalInfo {...props} />,
    );
    expect(wrapper.find('EvalTable')).toHaveLength(0);
  });
  it('should not render the Cards on empty caseDetails', () => {
    const props = {
      evalCaseDetails,
      caseDetails: [],
      evalRowSelect,
      index: 0,
      value: 0,
    };
    const wrapper = shallow(
      <AdditionalInfo {...props} />,
    );
    expect(wrapper.find('Cards')).toHaveLength(0);
  });
});

describe('<TabPanel>', () => {
  const { TabPanel } = TestHooks;
  it('should render the AdditionalInfo', () => {
    const props = {
      children: [<span key={1} />],
      value: 0,
      index: 0,
      other: {},
    };
    const wrapper = shallow(
      <TabPanel {...props} />,
    );
    expect(wrapper.find('span')).toHaveLength(1);
  });
});
