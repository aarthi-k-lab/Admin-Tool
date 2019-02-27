import React from 'react';
import { shallow } from 'enzyme';
import { TestHooks } from './Controls';

describe('<Controls />', () => {
  it('does not show \'EndShift\' and \'GetNext\'', () => {
    const wrapper = shallow(<TestHooks.Controls />);
    expect(wrapper.find('EndShift')).toHaveLength(0);
    expect(wrapper.find('GetNext')).toHaveLength(0);
  });

  it('show \'EndShift\' and \'GetNext\'', () => {
    const wrapper = shallow(<TestHooks.Controls showEndShift showGetNext />);
    expect(wrapper.find('EndShift')).toHaveLength(1);
    expect(wrapper.find('GetNext')).toHaveLength(1);
  });

  it('passes the props to the child components <GetNext />, <EndShift />, <Expand />', () => {
    const handleEndShift = jest.fn();
    const handleExpand = jest.fn();
    const wrapper = shallow(
      <TestHooks.Controls
        onEndShift={handleEndShift}
        onExpand={handleExpand}
        showEndShift
        showGetNext
      />,
    );
    expect(wrapper.find('GetNext').at(0).prop('disabled')).toBe(true);
    expect(wrapper.find('EndShift').at(0).prop('onClick')).toBe(handleEndShift);
    expect(wrapper.find('Expand').at(0).prop('onClick')).toBe(handleExpand);
  });
});
