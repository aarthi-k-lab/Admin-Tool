import React from 'react';
import { shallow } from 'enzyme';
import { TestExports } from './TimelineItem';

describe('<TimelineItem />', () => {
  const active = false;
  const getStagerTasks = jest.fn();
  const getTaskDetails = jest.fn();
  const handleTimelineClick = jest.fn();
  const stagerTasks = [];
  const taskData = {
    mlstnNm: 'Document Received',
    taskId: '7806617',
    taskName: 'Docs In',
    creDttm: 1607491575564,
    currSts: 'Closed',
    currStsDttm: 1607492052787,
    asgnUsrNm: 'Gajalakshmi.B@mrcooper.com',
    asgnDttm: null,
    dueDttm: 1607664374000,
  };
  const prcsId = '123';
  const props = {
    getStagerTasks,
    getTaskDetails,
    handleTimelineClick,
    stagerTasks,
    active,
    taskData,
    prcsId,
  };
  const wrapper = shallow(
    <TestExports.TimelineItem {...props} />,
  );
  it('render TimelineItem Component', () => {
    expect(wrapper.find('Fragment')).toHaveLength(1);
  });
  wrapper.find('div').at(0).simulate('click');
  it('call handleTimelineClick on timeline click', () => {
    expect(handleTimelineClick).toBeCalled();
  });
  it('call getTaskDetails on timeline click', () => {
    expect(getTaskDetails).toBeCalled();
  });
  it('not call getStagerTasks on timeline click', () => {
    expect(getStagerTasks).toBeCalledTimes(0);
  });
});

describe('<TimelineItem /> - Stager Task', () => {
  const active = true;
  const getStagerTasks = jest.fn();
  const getTaskDetails = jest.fn();
  const handleTimelineClick = jest.fn();
  const stagerTasks = [{
    disCat: 'mockCat',
    disName: 'mockName',
    lastAsgn: 'mock',
    stsDttm: 3,
  }];
  const taskData = {
    mlstnNm: 'Backend Stager',
    taskId: '7806617',
    taskName: 'Docs In',
    creDttm: 1,
    currSts: 'Failed',
    currStsDttm: 5,
    asgnUsrNm: 'mock',
    asgnDttm: null,
    dueDttm: 1607664374000,
  };
  const prcsId = '123';
  const props = {
    getStagerTasks,
    getTaskDetails,
    handleTimelineClick,
    stagerTasks,
    active,
    taskData,
    prcsId,
  };
  const wrapper = shallow(
    <TestExports.TimelineItem {...props} />,
  );
  it('render TimelineItem Component', () => {
    expect(wrapper.find('Fragment')).toHaveLength(1);
  });
  wrapper.find('div').at(0).simulate('click');
  it('call handleTimelineClick on timeline click', () => {
    expect(handleTimelineClick).toBeCalled();
  });
  it('call getTaskDetails on timeline click', () => {
    expect(getTaskDetails).toBeCalled();
  });
  it('call getStagerTasks on timeline click', () => {
    expect(getStagerTasks).toBeCalled();
  });
});
