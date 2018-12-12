import React from 'react';
import { shallow } from 'enzyme';
import { TestHooks } from './CustomSnackBar';

describe('<CustomSnackBar />', () => {
  const close = jest.fn();
  it('shows CustomSnackBar', () => {
    const wrapper = shallow(
      <TestHooks.CustomSnackbar onClose={close} />,
    );
    expect(wrapper.find('WithStyles(Snackbar)')).toHaveLength(1);
    expect(wrapper.find('WithStyles(SnackbarContent)')).toHaveLength(1);
    wrapper.find('WithStyles(Snackbar)').at(0).simulate('Close');
    expect(close.mock.calls).toHaveLength(1);
  });
});
