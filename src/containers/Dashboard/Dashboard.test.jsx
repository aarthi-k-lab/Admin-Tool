import React from 'react';
import { shallow } from 'enzyme';
import { TestExports } from './Dashboard';

describe('<Dashboard />', () => {
  it('show EvaluationPage', () => {
    const wrapper = shallow(
      <TestExports.Dashboard onGetGroupName={() => {}} />,
    );
    expect(wrapper.find('withRouter(Connect(EvaluationPage))')).toHaveLength(1);
  });
});
