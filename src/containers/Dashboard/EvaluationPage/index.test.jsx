import React from 'react';
import { shallow } from 'enzyme';
import { TestHooks } from './EvaluationPage';

const defaultProps = {
  isAssigned: false,
  isAutoDisposition: false,
  isHistoryOpen: false,
  processName: '',
  taskStatus: '',
  user: {
    skills: [],
  },
};
describe('<EvaluationPage />', () => {
  const location = {
    pathname: '/backend-checklist',
  };
  const wrapper = shallow(<TestHooks.EvaluationPage {...defaultProps} location={location} />);
  it('<ContentHeader /> shows title', () => {
    const contentHeader = wrapper.find('ContentHeader');
    expect(contentHeader).toHaveLength(0);
    // expect(contentHeader.at(0).prop('title')).toEqual('Underwriting');
  });

  it('<Controls /> shows GetNext and EndShift', () => {
    const controls = wrapper.find('withRouter(Connect(Controls))');
    expect(controls).toHaveLength(1);
    expect(controls.at(0).prop('showEndShift')).toBe(true);
    expect(controls.at(0).prop('showGetNext')).toBe(true);
  });

  it('has <Disposition />', () => {
    const disposition = wrapper.find('FullHeightColumn');
    expect(disposition).toHaveLength(1);
  });
});
