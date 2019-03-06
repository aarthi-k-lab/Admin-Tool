import React from 'react';
import { shallow } from 'enzyme';
import { TestExports } from './Dashboard';

describe('<Dashboard />', () => {
  it('shows LandingPage', () => {
    const wrapper = shallow(
      <TestExports.Dashboard isFirstVisit onGetGroupName={() => {}} />,
    );
    expect(wrapper.find('LandingPage')).toHaveLength(1);
  });
  it('show EvaluationPage', () => {
    const wrapper = shallow(
      <TestExports.Dashboard onGetGroupName={() => {}} />,
    );
    expect(wrapper.find('withRouter(EvaluationPage)')).toHaveLength(1);
  });
});
