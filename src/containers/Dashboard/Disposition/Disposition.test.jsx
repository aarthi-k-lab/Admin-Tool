import React from 'react';
import { shallow } from 'enzyme';
import { TestHooks } from './Disposition';
import getStatus from '../BackEndDisposition/statusList';

describe('<Disposition />', () => {
  it('shows Disposition widget in Loading mode', () => {
    const { Disposition } = TestHooks;
    const errorNotification = jest.fn();
    const wrapper = shallow(
      <Disposition errorNotification={errorNotification} inProgress status={getStatus()} />,
    );
    expect(wrapper.find('Loader')).toHaveLength(1);
  });

  it('shows Disposition widget with no data', () => {
    const { Disposition } = TestHooks;
    const errorNotification = jest.fn();
    const wrapper = shallow(
      <Disposition errorNotification={errorNotification} inProgress={false} status={getStatus()} />,
    );
    expect(wrapper.find('Loader')).toHaveLength(0);
    expect(wrapper.find('div')).toHaveLength(1);
    expect(wrapper.find('section')).toHaveLength(1);
  });

  it('should change the ExpandAll label to CollapseAll once when clicked', () => {
    const { Disposition } = TestHooks;
    const errorNotification = jest.fn();
    const wrapper = shallow(
      <Disposition errorNotification={errorNotification} inProgress={false} status={getStatus()} />,
    );
    expect(wrapper.state().operate).toEqual('ExpandAll');
    const firstButton = wrapper.find('button').at(0);
    firstButton.simulate('click');
    expect(wrapper.state().operate).toEqual('CollapseAll');
  });


  it('should change the collapseAll label to ExpandAll once when clicked', () => {
    const { Disposition } = TestHooks;
    const errorNotification = jest.fn();
    const wrapper = shallow(
      <Disposition errorNotification={errorNotification} inProgress={false} status={getStatus()} />,
    );
    const firstButton = wrapper.find('button').at(0);
    firstButton.simulate('click');
    firstButton.simulate('click');
    expect(wrapper.state().operate).toEqual('ExpandAll');
  });
});