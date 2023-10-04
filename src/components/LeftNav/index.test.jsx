import React from 'react';
import { shallow } from 'enzyme';
import { TestExports } from './LeftNav';

let defaultProps ={
  isAssigned : false,
  onAutoSave : jest.fn(),
  onClearStagerTaskName : jest.fn(),
  onEndShift : jest.fn(),
  path : '',
}
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
      <TestExports.LeftNav {...defaultProps} user={user} />,
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
      <TestExports.LeftNav {...defaultProps}{...props} />,
    );
    expect(wrapper.find('nav')).toHaveLength(1);
    wrapper.find('Link').at(0).simulate('click');
    expect(handleLandingpage).toBeCalled();
  });

  it('should call the onAutoSave and onClearStagerTaskName function', () => {
    const user = {
      userDetails: {
        email: 'bernt@mrcooper.com',
        jobTitle: 'CEO',
        name: 'brent',
      },
    };
    const onClearStagerTaskName = jest.fn();
    const onClearStagerResponse = jest.fn();
    const onEndShift = jest.fn();
    const onAutoSave = jest.fn();
    const handleLandingpage = jest.spyOn(TestExports.LeftNav.prototype, 'handleLandingpage');
    const props = {
      user,
      onClearStagerTaskName,
      onAutoSave,
      onEndShift,
      evalId: '123',
      enableGetNext: false,
      path: '/stager',
      isAssigned: true,
      onClearStagerResponse,
    };
    const wrapper = shallow(
      <TestExports.LeftNav {...defaultProps} {...props} />,
    );
    expect(wrapper.find('nav')).toHaveLength(1);
    wrapper.find('Link').at(4).simulate('click');
    expect(handleLandingpage).toBeCalled();
    expect(onAutoSave).toBeCalled();
    expect(onClearStagerTaskName).toBeCalled();
    expect(onClearStagerResponse).toBeCalled();
  });
});
