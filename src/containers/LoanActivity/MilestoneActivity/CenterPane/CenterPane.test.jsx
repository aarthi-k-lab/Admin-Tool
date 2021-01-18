import React from 'react';
import { shallow } from 'enzyme';
import { TestExports } from './CenterPane';

describe('<CenterPane />', () => {
  const mlstnName = 'mock';
  const taskDetails = [{
    taskId: 7806488,
    bpmStatus: 'Closed',
    taskName: 'Docs Sent',
    tskStsChg: 'Closed',
    tskStrDt: null,
    tskEnDt: null,
    tskAgnUsr: 'Gajalakshmi.B@mrcooper.com',
    taskSkill: '',
    tskHrdAgnInd: '0',
    tskStsChgRs: 'docsIn',
    tskNxtSchActDt: 1607482806277,
    tskNxtSchActTy: null,
    iteration: 1,
  },
  {
    taskId: 7806488,
    bpmStatus: 'Closed',
    taskName: 'Docs Sent',
    tskStsChg: 'Received',
    tskStrDt: 1607482806277,
    tskEnDt: 1607482806277,
    tskAgnUsr: 'cmod-docsent',
    taskSkill: '',
    tskHrdAgnInd: '0',
    tskStsChgRs: 'New',
    tskNxtSchActDt: null,
    tskNxtSchActTy: null,
    iteration: 1,
  },
  ];
  const props = {
    mlstnName,
    taskDetails,
  };
  const wrapper = shallow(
    <TestExports.CenterPane {...props} />,
  );
  it('render CenterPane Component', () => {
    expect(wrapper.find('Fragment')).toHaveLength(1);
  });
});
