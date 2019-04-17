import React from 'react';
import { shallow } from 'enzyme';
import { TestExports } from './Dashboard';

describe('<Dashboard />', () => {
  it('shows LandingPage', () => {
    const wrapper = shallow(
      <TestExports.Dashboard isFirstVisit onGetGroupName={() => {}} />,
    );
    expect(wrapper.find('withRouter(LandingPage)')).toHaveLength(1);
  });
  it('show EvaluationPage', () => {
    const wrapper = shallow(
      <TestExports.Dashboard onGetGroupName={() => {}} />,
    );
    expect(wrapper.find('withRouter(Connect(EvaluationPage))')).toHaveLength(1);
  });
});
