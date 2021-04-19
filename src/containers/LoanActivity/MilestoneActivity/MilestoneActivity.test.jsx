import React from 'react';
import { shallow } from 'enzyme';
import { TestHooks } from './MilestoneActivity';

describe('<MilestoneActivity />', () => {
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
  const isHistoryOpen = true;
  const loadMlstn = jest.fn();
  const history = [];
  const tasks = [{
    creDttm: '123',
    currSts: '123',
    currStsDttm: '123',
    dueDt: '123',
    id: '1',
    taskNm: 'mock',
  }];
  const clearTasks = jest.fn();
  const props = {
    clearData,
    clearTasks,
    getTasksByTaskCategory,
    groupTask,
    history,
    inProgress,
    inSearchPage,
    isHistoryOpen,
    loadMlstn,
    tasks,
  };
  const wrapper = shallow(
    <TestHooks.MilestoneActivity {...props} />,
  );
  it('render MilestoneActivity Component', () => {
    expect(wrapper.find('Connect(MilestonePage)')).toHaveLength(1);
  });
  it('call clearTasks on milestone click', () => {
    wrapper.instance().onClickMilestone();
    expect(clearTasks).toBeCalled();
  });
  it('call getTasksByTaskCategory on stager task click', () => {
    wrapper.instance().onStagerTaskClick('123', 'mock', '123', '123');
    expect(getTasksByTaskCategory).toBeCalled();
  });
  it('not call loadMlstn on null prcsId', () => {
    expect(loadMlstn).toBeCalledTimes(0);
  });
  it('should call loadMlstn on valid prcsId', () => {
    shallow(
      <TestHooks.MilestoneActivity {...props} processId="123" />,
    );
    expect(loadMlstn).toBeCalled();
  });
  it('should call clearData on componentWillUnmount', () => {
    wrapper.instance().componentWillUnmount();
    expect(clearData).toBeCalled();
  });
});
