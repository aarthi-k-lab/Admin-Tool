import React from 'react';
import { shallow } from 'enzyme';
import { TestHooks } from './BackEndDisposition';

describe('<BackEndDisposition />', () => {
  it('shows BackEndDisposition widget in Loading mode', () => {
    const { BackEndDisposition } = TestHooks;
    const wrapper = shallow(
      <BackEndDisposition inProgress />,
    );
    expect(wrapper.find('Loader')).toHaveLength(1);
  });

  it('shows Disposition widget with no data', () => {
    const { BackEndDisposition } = TestHooks;
    const wrapper = shallow(
      <BackEndDisposition inProgress={false} />,
    );
    expect(wrapper.find('Loader')).toHaveLength(0);
    expect(wrapper.find('div')).toHaveLength(1);
    expect(wrapper.find('section')).toHaveLength(1);
  });

  it('should change the ExpandAll label to CollapseAll once when clicked', () => {
    const { BackEndDisposition } = TestHooks;
    const wrapper = shallow(
      <BackEndDisposition inProgress={false} />,
    );
    expect(wrapper.state().operate).toEqual('ExpandAll');
    const firstButton = wrapper.find('button').at(0);
    firstButton.simulate('click');
    expect(wrapper.state().operate).toEqual('CollapseAll');
  });


  it('should change the collapseAll label to ExpandAll once when clicked', () => {
    const { BackEndDisposition } = TestHooks;
    const wrapper = shallow(
      <BackEndDisposition inProgress={false} />,
    );
    const firstButton = wrapper.find('button').at(0);
    firstButton.simulate('click');
    firstButton.simulate('click');
    expect(wrapper.state().operate).toEqual('ExpandAll');
  });
});
