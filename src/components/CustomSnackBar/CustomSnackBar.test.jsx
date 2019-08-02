import React from 'react';
import { shallow } from 'enzyme';
import { TestHooks } from './CustomSnackBar';

describe('<CustomSnackBar />', () => {
  const close = jest.fn();
  it('shows CustomSnackBar', () => {
    const wrapper = shallow(
      <TestHooks.CustomSnackbar onClose={close} />,
    );
    expect(wrapper.find('WithStyles(ForwardRef(Snackbar))')).toHaveLength(1);
    expect(wrapper.find('WithStyles(ForwardRef(SnackbarContent))')).toHaveLength(1);
    wrapper.find('WithStyles(ForwardRef(Snackbar))').simulate('Close');
    expect(close.mock.calls).toHaveLength(1);
  });
});
