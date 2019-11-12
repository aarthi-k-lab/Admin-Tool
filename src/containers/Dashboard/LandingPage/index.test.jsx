import React from 'react';
import { shallow } from 'enzyme';
import { TestHooks } from './LandingPage';

describe('<LandingPage />', () => {
  const location = {
    pathname: '/backend-checklist',
  };
  const wrapper = shallow(<TestHooks.LandingPage location={location} />);

  it('<ContentHeader /> shows title', () => {
    const contentHeader = wrapper.find('ContentHeader');
    expect(contentHeader).toHaveLength(1);
    expect(contentHeader.at(0).prop('title')).toEqual('Underwriting');
  });

  it('<Connect /> with GetNext enabled and visible & EndShift not visible', () => {
    const controls = wrapper.find('withRouter(Connect(Controls))');
    expect(controls).toHaveLength(1);
    expect(controls.at(0).prop('showGetNext')).toEqual(true);
    expect(controls.at(0).prop('showEndShift')).toEqual(undefined);
  });
});
