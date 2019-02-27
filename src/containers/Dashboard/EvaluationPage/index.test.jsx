import React from 'react';
import { shallow } from 'enzyme';
import EvaluationPage from '.';

describe('<EvaluationPage />', () => {
  const wrapper = shallow(<EvaluationPage />);

  it('<ContentHeader /> shows title', () => {
    const contentHeader = wrapper.find('ContentHeader');
    expect(contentHeader).toHaveLength(1);
    expect(contentHeader.at(0).prop('title')).toEqual('Income Calculation');
  });

  it('<Controls /> shows GetNext and EndShift', () => {
    const controls = wrapper.find('withRouter(Connect(Controls))');
    expect(controls).toHaveLength(1);
    expect(controls.at(0).prop('showEndShift')).toBe(true);
    expect(controls.at(0).prop('showGetNext')).toBe(true);
  });

  it('has <Disposition />', () => {
    const disposition = wrapper.find('Connect(Disposition)');
    expect(disposition).toHaveLength(1);
  });
});
