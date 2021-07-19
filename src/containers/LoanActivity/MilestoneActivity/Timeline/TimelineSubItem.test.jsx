import React from 'react';
import { shallow } from 'enzyme';
import { TestExports } from './TimelineSubItem';

describe('<TimelineSubItem />', () => {
  const grpData = {
    disCat: 'mockCat',
    disName: 'mockName',
    lastAsgn: 'mock',
    stsDttm: '2021-05-05',
  };
  const props = {
    grpData,
  };
  const wrapper = shallow(
    <TestExports.TimelineSubItem {...props} />,
  );
  it('render TimelineSubItem Component', () => {
    expect(wrapper.find('Fragment')).toHaveLength(1);
  });
});
