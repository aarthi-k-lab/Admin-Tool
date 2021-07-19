import React from 'react';
import { shallow } from 'enzyme';
import { TestHooks } from './CompleteMyReview';

const defaultProps = {
  completeReviewResponse: jest.fn(),
};
describe('<CompleteMyReview>', () => {
  const onClick = jest.fn();
  const onDialogClose = jest.fn();
  it('should render the CompleteMyReview component', () => {
    const completeReviewResponse = null;
    const props = {
      onClick,
      onDialogClose,
      completeReviewResponse,
    };
    const wrapper = shallow(
      <TestHooks.CompleteMyReview {...defaultProps} {...props} />,
    );
    expect(wrapper.find('Fragment')).toHaveLength(1);
  });
  it('should render the SweetAlertBox', () => {
    const completeReviewResponse = {
      error: true,
    };
    const props = {
      onClick,
      onDialogClose,
      completeReviewResponse,
    };
    const wrapper = shallow(
      <TestHooks.CompleteMyReview {...defaultProps} {...props} />,
    );
    expect(wrapper.find('SweetAlertBox')).toHaveLength(1);
    wrapper.find('SweetAlertBox').at(0).simulate('confirm');
    expect(onDialogClose).toHaveBeenCalledTimes(1);
  });
  it('should call the onClick function', () => {
    const completeReviewResponse = {
      error: true,
    };
    const props = {
      onClick,
      onDialogClose,
      completeReviewResponse,
    };
    const wrapper = shallow(
      <TestHooks.CompleteMyReview {...defaultProps} {...props} />,
    );
    expect(wrapper.find('WithStyles(ForwardRef(Button))')).toHaveLength(1);
    wrapper.find('WithStyles(ForwardRef(Button))').at(0).simulate('click');
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
