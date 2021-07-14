import React from 'react';
import { shallow } from 'enzyme';
import IconButton from '@material-ui/core/IconButton';
import { TestHooks } from './EvalTableCell';


describe('Eval Table Cell ', () => {
  it('shows Action button when passed a valid value ', () => {
    const { EvalTableCell } = TestHooks;
    const user = {
      userDetails: {
        email: 'brent@mrcooper.com',
        jobTitle: 'developer',
        name: 'brent',
      },
    };
    const styleProps = 'mock-style';
    const click = jest.fn();
    const wrapper = shallow(<EvalTableCell click={click} styleProps={styleProps} user={user} value="SendToFEUW" />);
    expect(wrapper.find(IconButton)).toHaveLength(1);
    expect(wrapper.find('img')).toHaveLength(1);
  });
  it('does not show Action button when passed an invalid value ', () => {
    const { EvalTableCell } = TestHooks;
    const user = {
      userDetails: {
        email: 'brent@mrcooper.com',
        jobTitle: 'developer',
        name: 'brent',
      },
    };
    const styleProps = 'blackText';
    const click = jest.fn();
    const wrapper = shallow(<EvalTableCell click={click} styleProps={styleProps} user={user} value="mock" />);
    expect(wrapper.find(IconButton)).toHaveLength(0);
  });
  it('should show link to Loan Activity', () => {
    const { EvalTableCell } = TestHooks;
    const user = {
      userDetails: {
        email: 'brent@mrcooper.com',
        jobTitle: 'developer',
        name: 'brent',
      },
    };
    const styleProps = 'cmod';
    const click = jest.fn();
    const wrapper = shallow(<EvalTableCell click={click} styleProps={styleProps} user={user} value="Booking" />);
    expect(wrapper.find('WithStyles(ForwardRef(IconButton))')).toHaveLength(1);
    wrapper.find('WithStyles(ForwardRef(IconButton))').simulate('click');
    expect(click).toBeCalled();
  });
  it('should show Tooltip to Un-reject', () => {
    const { EvalTableCell } = TestHooks;
    const user = {
      userDetails: {
        email: 'brent@mrcooper.com',
        jobTitle: 'developer',
        name: 'brent',
      },
    };
    const styleProps = 'mock-style';
    const click = jest.fn();
    const wrapper = shallow(<EvalTableCell click={click} styleProps={styleProps} user={user} value="Un-reject" />);
    expect(wrapper.find('WithStyles(ForwardRef(Tooltip))')).toHaveLength(1);
    wrapper.find('WithStyles(ForwardRef(IconButton))').simulate('click');
    expect(click).toBeCalled();
  });
  it('should show Action button for Booking', () => {
    const { EvalTableCell } = TestHooks;
    const user = {
      userDetails: {
        email: 'brent@mrcooper.com',
        jobTitle: 'developer',
        name: 'brent',
      },
    };
    const styleProps = 'mock-style';
    const click = jest.fn();
    const wrapper = shallow(<EvalTableCell click={click} styleProps={styleProps} user={user} value="Booking" />);
    expect(wrapper.find('WithStyles(ForwardRef(IconButton))')).toHaveLength(1);
  });
});
