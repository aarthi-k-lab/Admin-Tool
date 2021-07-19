import React from 'react';
import { shallow } from 'enzyme';
import { TestExports } from './TimelineItem';

describe('<TimelineItem />', () => {
  const taskData = {
    mlstnNm: 'Document Received',
    taskId: '7806617',
    taskName: 'Docs In',
    creDttm: '2021-05-05',
    currSts: 'Closed',
    currStsDttm: '2021-05-05',
    asgnUsrNm: 'Gajalakshmi.B@mrcooper.com',
    asgnDttm: null,
    dueDttm: '2021-05-05',
  };
  const props = {
    stagerTasks: {},
    taskData,
    prcsId: '123',
    mlstnName: '',
    active: false,
    getStagerTasks: jest.fn(),
    getTaskDetails: jest.fn(),
    handleTimelineClick: jest.fn(),
  };
  const wrapper = shallow(
    <TestExports.TimelineItem {...props} />,
  );
  it('render TimelineItem Component', () => {
    expect(wrapper.find('Fragment')).toHaveLength(1);
  });
  wrapper.find('div').at(0).simulate('click');
  it('call handleTimelineClick on timeline click', () => {
    expect(props.handleTimelineClick).toBeCalled();
  });
  it('call getTaskDetails on timeline click', () => {
    expect(props.getTaskDetails).toBeCalled();
  });
  it('not call getStagerTasks on timeline click', () => {
    expect(props.getStagerTasks).toBeCalledTimes(0);
  });
});

describe('<TimelineItem /> - Stager Task', () => {
  const stagerTasks = {
    disCat: 'mockCat',
    disName: 'mockName',
    lastAsgn: 'mock',
    stsDttm: 3,
  };
  const taskData = {
    mlstnNm: 'Backend Stager',
    taskId: '7806617',
    taskName: 'Docs In',
    creDttm: '2021-05-05',
    currSts: 'Failed',
    currStsDttm: '2021-05-05',
    asgnUsrNm: 'mock',
    asgnDttm: null,
    dueDttm: '2021-05-05',
  };
  const props = {
    stagerTasks,
    taskData,
    prcsId: '123',
    mlstnName: '',
    active: true,
    getStagerTasks: jest.fn(),
    getTaskDetails: jest.fn(),
    handleTimelineClick: jest.fn(),
  };
  const wrapper = shallow(
    <TestExports.TimelineItem {...props} />,
  );
  it('render TimelineItem Component', () => {
    expect(wrapper.find('Fragment')).toHaveLength(1);
  });
  wrapper.find('div').at(0).simulate('click');
  it('call handleTimelineClick on timeline click', () => {
    expect(props.handleTimelineClick).toBeCalled();
  });
  it('call getTaskDetails on timeline click', () => {
    expect(props.getTaskDetails).toBeCalled();
  });
  it('call getStagerTasks on timeline click', () => {
    expect(props.getStagerTasks).toBeCalled();
  });
});
