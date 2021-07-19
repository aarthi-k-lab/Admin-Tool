import React from 'react';
import { shallow } from 'enzyme';
import { TestExports } from './Dashboard';

let defaultProps ={
  isFirstVisit :false,
}
describe('<Dashboard />', () => {
  it('show EvaluationPage', () => {
    const userGroupList = ['booking'];
    const wrapper = shallow(
      <TestExports.Dashboard {...defaultProps}onGetGroupName={() => {}} userGroupList={userGroupList} />,
    );
    expect(wrapper.find('withRouter(Connect(EvaluationPage))')).toHaveLength(1);
  });
});
