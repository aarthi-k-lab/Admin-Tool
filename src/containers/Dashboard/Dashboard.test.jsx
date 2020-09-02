import React from 'react';
import { shallow } from 'enzyme';
import { TestExports } from './Dashboard';

describe('<Dashboard />', () => {
  it('show EvaluationPage', () => {
    const userGroupList = ['booking'];
    const wrapper = shallow(
      <TestExports.Dashboard onGetGroupName={() => {}} userGroupList={userGroupList} />,
    );
    expect(wrapper.find('withRouter(Connect(EvaluationPage))')).toHaveLength(1);
  });
});
