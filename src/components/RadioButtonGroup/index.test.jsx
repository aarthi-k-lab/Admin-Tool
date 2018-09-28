import React from 'react';
import { shallow } from 'enzyme';
import RadioButtonGroup from '.';

describe('<RadioButtonGroup />', () => {
  let wrapper;
  const items = [
    {
      key: 'C1',
      value: 'T1',
    },
    {
      key: 'C2',
      value: 'T2',
    },
  ];
  const handleChange = jest.fn();

  beforeEach(() => {
    wrapper = shallow(<RadioButtonGroup items={items} name="radio-button-test" onChange={handleChange} />);
  });
  it('should render the RadioGroup component', () => {
    expect(wrapper.find('RadioGroup').at(0).props()).toHaveProperty('name', 'radio-button-test');
  });

  it('should render the radio buttons', () => {
    expect(wrapper.find('RadioGroup').children()).toHaveLength(items.length);
    expect(wrapper.find('RadioGroup').children().at(0).prop('label')).toBe('T1');
  });

  it('should trigger OnChange on click of a radio button', () => {
    wrapper.find('RadioGroup').simulate('change', { target: { value: 'custom' } });
    expect(handleChange.mock.calls.length).toBe(1);
    expect(handleChange.mock.calls[0][0]).toBe('custom');
  });
});
