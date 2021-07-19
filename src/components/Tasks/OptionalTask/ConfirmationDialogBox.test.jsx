import React from 'react';
import { shallow } from 'enzyme';
import ConfirmationDialogBox from './ConfirmationDialogBox';

const defaultProps = {
  onClose: jest.fn(),
  message: '',
};
describe('<Tabs />', () => {
  it('should render the ConfirmationDialogBox component', () => {
    const wrapper = shallow(
      <ConfirmationDialogBox {...defaultProps} />,
    );
    expect(wrapper.find('WithStyles(ForwardRef(Dialog))')).toHaveLength(1);
    wrapper.find('WithStyles(ForwardRef(Button))').at(0).simulate('click');
    wrapper.find('WithStyles(ForwardRef(Button))').at(1).simulate('click');
    expect(defaultProps.onClose).toBeCalledTimes(2);
  });
});
