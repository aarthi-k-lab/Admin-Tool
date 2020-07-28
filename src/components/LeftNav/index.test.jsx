import React from 'react';
import { shallow } from 'enzyme';
import { TestExports } from './LeftNav';

describe('<LeftNav />', () => {
  it('shows LeftNavButtons', () => {
    const user = {
      userDetails: {
        email: 'bernt@mrcooper.com',
        jobTitle: 'CEO',
        name: 'brent',
      },
    };
    const wrapper = shallow(
      <TestExports.LeftNav user={user} />,
    );
    expect(wrapper.find('nav')).toHaveLength(1);
  });
  it('should call the handleLandingpage function', () => {
    const user = {
      userDetails: {
        email: 'bernt@mrcooper.com',
        jobTitle: 'CEO',
        name: 'brent',
      },
    };
    const onClearStagerTaskName = jest.fn();
    const onEndShift = jest.fn();
    const handleLandingpage = jest.spyOn(TestExports.LeftNav.prototype, 'handleLandingpage');
    const props = {
      user,
      onClearStagerTaskName,
      onEndShift,
    };
    const wrapper = shallow(
      <TestExports.LeftNav {...props} />,
    );
    expect(wrapper.find('nav')).toHaveLength(1);
    wrapper.find('Link').at(0).simulate('click');
    expect(handleLandingpage).toBeCalled();
  });

  it('should call the onAutoSave and onClearStagerResponse function', () => {
    const user = {
      userDetails: {
        email: 'bernt@mrcooper.com',
        jobTitle: 'CEO',
        name: 'brent',
      },
    };
    const onClearStagerTaskName = jest.fn();
    const onEndShift = jest.fn();
    const onAutoSave = jest.fn();
    const onClearStagerResponse = jest.fn();
    const handleLandingpage = jest.spyOn(TestExports.LeftNav.prototype, 'handleLandingpage');
    const props = {
      user,
      onClearStagerTaskName,
      onClearStagerResponse,
      onAutoSave,
      onEndShift,
      evalId: '123',
      enableGetNext: false,
      path: '/stager',
      isAssigned: true,
    };
    const wrapper = shallow(
      <TestExports.LeftNav {...props} />,
    );
    expect(wrapper.find('nav')).toHaveLength(1);
    wrapper.find('Link').at(4).simulate('click');
    expect(handleLandingpage).toBeCalled();
    expect(onAutoSave).toBeCalled();
    expect(onClearStagerResponse).toBeCalled();
  });
});
