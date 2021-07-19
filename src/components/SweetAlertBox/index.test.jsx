import React from 'react';
import { shallow } from 'enzyme';
import SweetAlertBox from './SweetAlertBox';

describe('<SweetAlertBox />', () => {
  const onConfirm = jest.fn();
  it('should render the SweetAlertBox component', () => {
    const props = {
      message: 'mock',
      onConfirm,
      type: 'Success',
    };
    const wrapper = shallow(
      <SweetAlertBox {...props} />,
    );
    expect(wrapper.find('n')).toHaveLength(1);
    wrapper.find('n').simulate('confirm');
    expect(onConfirm).toBeCalled();
  });
  it('should render the warning gif', () => {
    const props = {
      message: 'mock',
      type: '',
      title: 'mock',
    };
    const wrapper = shallow(
      <SweetAlertBox {...props} />,
    );
    expect(wrapper.find('n')).toHaveLength(1);
    expect(wrapper.find('n').props().imageUrl).toBe('/static/img/warning.gif');
  });
});
