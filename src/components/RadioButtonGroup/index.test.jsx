import React from 'react';
import { shallow } from 'enzyme';
import RadioButtonGroup from '.';

describe('<RadioButtonGroup />', () => {
  let wrapper;
  const items = [
    {
      additionalInfo: 'tooltip1',
      key: 'C1',
      value: 'T1',
    },
    {
      additionalInfo: 'tooltip2',
      key: 'C2',
      value: 'T2',
    },
  ];
  const handleChange = jest.fn();

  beforeEach(() => {
    wrapper = shallow(<RadioButtonGroup items={items} name="radio-button-test" onChange={handleChange} />);
  });
  it('should render the RadioGroup component', () => {
    expect(wrapper.find('ForwardRef(RadioGroup)[name="radio-button-test"]')).toHaveLength(1);
  });

  it('should render the radio buttons', () => {
    expect(wrapper.find('ForwardRef(RadioGroup)').children()).toHaveLength(items.length);
  });

  it('should trigger OnChange on click of a radio button', () => {
    wrapper.find('ForwardRef(RadioGroup)').simulate('change', { target: { value: 'custom' } });
    expect(handleChange.mock.calls.length).toBe(1);
    expect(handleChange.mock.calls[0][0]).toBe('custom');
  });
});
