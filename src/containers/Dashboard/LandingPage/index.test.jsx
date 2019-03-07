import React from 'react';
import { shallow } from 'enzyme';
import { TestHooks } from './LandingPage';

describe('<LandingPage />', () => {
  const location = {
    pathname: '/backend-evaluation',
  };
  const wrapper = shallow(<TestHooks.LandingPage location={location} />);

  it('<ContentHeader /> shows title', () => {
    const contentHeader = wrapper.find('ContentHeader');
    expect(contentHeader).toHaveLength(1);
    expect(contentHeader.at(0).prop('title')).toEqual('Underwritting');
  });

  it('<Connect /> with GetNext enabled and visible & EndShift not visible', () => {
    const controls = wrapper.find('Connect(Controls)');
    expect(controls).toHaveLength(1);
    expect(controls.at(0).prop('showGetNext')).toEqual(true);
    expect(controls.at(0).prop('showEndShift')).toEqual(undefined);
  });
});
