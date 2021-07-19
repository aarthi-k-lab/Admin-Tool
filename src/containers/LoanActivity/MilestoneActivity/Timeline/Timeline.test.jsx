import React from 'react';
import { shallow } from 'enzyme';
import { TestExports } from './Timeline';

describe('<Timeline />', () => {
  const tasksGroupMlstnNm = [];
  const groupTaskData = [{
    maxCreDttm: '1607482806055',
    mlstnNm: 'Document Sent to Homeowner',
    taskId: '7806488',
    taskName: 'Docs Sent',
    creDttm: '1607482806055',
    currSts: 'Closed',
    currStsDttm: '1607491574234',
    asgnUsrNm: 'Gajalakshmi.B@mrcooper.com',
    asgnDttm: null,
    dueDttm: '1607655605000',
  },
  {
    maxCreDttm: '1607482806056',
    mlstnNm: 'Document Received',
    taskId: '7806617',
    taskName: 'Docs In',
    creDttm: '1607491575564',
    currSts: 'Closed',
    currStsDttm: '1607492052787',
    asgnUsrNm: 'Gajalakshmi.B@mrcooper.com',
    asgnDttm: null,
    dueDttm: '1607664374000',
  },
  ];
  const prcsId = '123';
  const props = {
    tasksGroupMlstnNm,
    groupTaskData,
    prcsId,
  };
  const wrapper = shallow(
    <TestExports.Timeline {...props} />,
  );
  it('render TimelineItem Component', () => {
    expect(wrapper.find('Connect(TimelineItem)')).toHaveLength(2);
  });
  it('should change the taskId state on handleTimelineClick ', () => {
    wrapper.instance().handleTimelineClick('123');
    expect(wrapper.instance().state.taskId).toBe('123');
  });
});
