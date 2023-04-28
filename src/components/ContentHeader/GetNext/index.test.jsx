import React from 'react';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import { TestHooks } from './GetNext';

const defaultProps = {
  disabled: false,
  onClick: jest.fn(),
  onDialogClose: jest.fn(),
  resultOperation: {
    status: '',
  },
};

describe('<GetNext />', () => {
  test('snapshot test', () => {
    const tree = renderer
      .create(<TestHooks.GetNext {...defaultProps} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('triggers onClick handler', () => {
    const handleClick = jest.fn();
    const wrapper = shallow(<TestHooks.GetNext {...defaultProps} onClick={handleClick} />);
    wrapper.find('.material-ui-button').simulate('click');
    expect(handleClick.mock.calls.length).toBe(1);
  });
});
