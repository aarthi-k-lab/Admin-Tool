import React from 'react';
import { shallow } from 'enzyme';
import LandingPage from '.';

describe('<LandingPage />', () => {
  it('<ContentHeader /> with empty title', () => {
    const wrapper = shallow(<LandingPage />);
    const contentHeader = wrapper.find('ContentHeader');
    expect(contentHeader).toHaveLength(1);
    expect(contentHeader.at(0).prop('title')).toEqual('');
  });

  it('<Connect /> with GetNext enabled and visible & EndShift not visible', () => {
    const wrapper = shallow(<LandingPage />);
    const controls = wrapper.find('Connect(Controls)');
    expect(controls).toHaveLength(1);
    expect(controls.at(0).prop('showGetNext')).toEqual(true);
    expect(controls.at(0).prop('showEndShift')).toEqual(undefined);
  });
});
