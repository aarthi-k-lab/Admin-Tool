import React from 'react';
import { shallow } from 'enzyme';
import { TestExports } from './MilestonePage';

const defaultProps = {
  getTaskDetails: jest.fn(),
};
describe('<MilestoneActivity /> - not in searchPage', () => {
  const clearData = jest.fn();
  const getTasksByTaskCategory = jest.fn();
  const groupTask = [{
    asgnDttm: '123',
    asgnUsrNm: 'mock',
    creDttm: '123',
    currSts: 'received',
    currStsDttm: '123',
    dueDttm: '123',
    mlstnNm: 'mock',
    taskId: '112233',
    taskName: 'mock',
  }];
  const inProgress = false;
  const inSearchPage = false;
  const onClickMilestone = jest.fn();
  const onStagerTaskClick = jest.fn();
  const prcsId = '112233';
  const tasksGroupMlstnNm = [{
    creDttm: '123',
    lastAsgn: 'mock',
    mlstnNm: 'mock',
    ordered: 'mock',
    taskCategory: 'mock',
    taskId: '1122',
  }];
  const props = {
    clearData,
    getTasksByTaskCategory,
    groupTask,
    inProgress,
    inSearchPage,
    onClickMilestone,
    onStagerTaskClick,
    tasksGroupMlstnNm,
    prcsId,
  };
  const wrapper = shallow(
    <TestExports.MilestonePage {...defaultProps} {...props} />,
  );
  it('render Timeline Component', () => {
    expect(wrapper.find('Timeline')).toHaveLength(1);
  });
  it('not render ContentHeader  Component', () => {
    expect(wrapper.find('ContentHeader')).toHaveLength(0);
  });
  it('not render Tombstone  Component', () => {
    expect(wrapper.find('Tombstone')).toHaveLength(0);
  });
});
describe('<MilestoneActivity /> - in searchPage', () => {
  const clearData = jest.fn();
  const getTasksByTaskCategory = jest.fn();
  const groupTask = [];
  const inProgress = false;
  const inSearchPage = true;
  const onClickMilestone = jest.fn();
  const onStagerTaskClick = jest.fn();
  const prcsId = '112233';
  const tasksGroupMlstnNm = [{
    creDttm: '123',
    lastAsgn: 'mock',
    mlstnNm: 'mock',
    ordered: 'mock',
    taskCategory: 'mock',
    taskId: '1122',
  }];
  const props = {
    clearData,
    getTasksByTaskCategory,
    groupTask,
    inProgress,
    inSearchPage,
    onClickMilestone,
    onStagerTaskClick,
    tasksGroupMlstnNm,
    prcsId,
  };
  const wrapper = shallow(
    <TestExports.MilestonePage {...defaultProps} {...props} />,
  );
  it('render Timeline Component', () => {
    expect(wrapper.find('Timeline')).toHaveLength(1);
  });
  it('render ContentHeader  Component', () => {
    expect(wrapper.find('Connect(ContentHeader)')).toHaveLength(1);
  });
  it('render Tombstone  Component', () => {
    expect(wrapper.find('Connect(TombstoneWrapper)')).toHaveLength(1);
  });
});
