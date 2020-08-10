import React from 'react';
import { shallow } from 'enzyme';
import ConfirmationDialogBox from './ConfirmationDialogBox';

describe('<Tabs />', () => {
  it('should render the ConfirmationDialogBox component', () => {
    const onClose = jest.fn();
    const wrapper = shallow(
      <ConfirmationDialogBox onClose={onClose} />,
    );
    expect(wrapper.find('WithStyles(ForwardRef(Dialog))')).toHaveLength(1);
    wrapper.find('WithStyles(ForwardRef(Button))').at(0).simulate('click');
    wrapper.find('WithStyles(ForwardRef(Button))').at(1).simulate('click');
    expect(onClose).toBeCalledTimes(2);
  });
});
