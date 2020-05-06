import React from 'react';
import { shallow } from 'enzyme';
import IconButton from '@material-ui/core/IconButton';
import { TestHooks } from './EvalTableCell';


describe.only('Eval Table Cell ', () => {
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
});
