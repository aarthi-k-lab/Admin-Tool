import React from 'react';
import { shallow } from 'enzyme';
import Cards from './Cards';

describe('<Cards>', () => {
  const card = {
    ResolutionChoiceType: 'Government Trial',
    CaseOpenDate: '2015-01-24T08:09:01.757',
    Status: 'Rejected',
    StatusDate: '2015-04-08T07:16:39.750',
    LockedDate: '2015-04-08T07:16:39.763',
    SubStatus: 'Missing Docs',
    SubStatusDate: '2015-03-03T09:33:39.833',
  };
  const history = [
    {
      Values: [
        {
          CaseId: 2435630,
          ApprovalType: 'Rejected',
          ActionDate: '2015-04-08T07:16:39.767',
          UserName: ' Remedy',
          ChangeType: 'Status',
          ReasonCode: 13,
          Comment: '13 - Request Incomplete',
          SourceName: 'Remedy',
        },
        {
          CaseId: 2435630,
          ApprovalType: 'Missing Docs',
          ActionDate: '2015-03-03T09:33:40.210',
          UserName: 'Vaibhav Karanjalkar',
          ChangeType: 'SubStatus',
          ReasonCode: 0,
          SourceName: '',
        },
        {
          CaseId: 2435630,
          ApprovalType: 'In Review',
          ActionDate: '2015-03-02T12:18:02.377',
          UserName: 'Piyush Savaliya',
          ChangeType: 'SubStatus',
          ReasonCode: 0,
          SourceName: '',
        },
        {
          CaseId: 2435630,
          ApprovalType: 'FINS',
          ActionDate: '2015-01-24T08:10:33.437',
          UserName: 'Rhonda Linton',
          ChangeType: 'SubStatus',
          ReasonCode: 0,
          SourceName: '',
        },
        {
          CaseId: 2435630,
          ApprovalType: 'Open',
          ActionDate: '2015-01-24T08:09:01.880',
          UserName: 'Rhonda Linton',
          ChangeType: 'Status',
          SourceName: 'Rhonda Linton',
        },
      ],
    },
  ];

  const resolutionId = 2435630;
  const props = {
    card,
    history,
    resolutionId,
  };
  const wrapper = shallow(
    <Cards {...props} />,
  );
  it('should render the AdditionalInfo', () => {
    expect(wrapper.find('Fragment')).toHaveLength(1);
  });
  it('should display table data on SHOW HISTORY Click', () => {
    wrapper.find('WithStyles(ForwardRef(Grid))').at(17).simulate('click');
    expect(wrapper.find('WithStyles(ForwardRef(Grid))')).toHaveLength(65);
    console.log(wrapper.debug());
  });
});
