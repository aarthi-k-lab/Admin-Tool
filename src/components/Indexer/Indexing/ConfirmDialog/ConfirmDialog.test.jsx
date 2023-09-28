import React from 'react';
import { shallow } from 'enzyme';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import ConfirmDialog from './ConfirmDialog';

const defaultProps = {
  isOpen: true,
  handleClose: jest.fn(),
  saveFn: jest.fn(),
  cancelFn: jest.fn(),
  isMaLoan: false,
};

describe('ConfirmDialog', () => {
  describe('ConfirmDialog snapshot', () => {
    const rootReducer = (state = { dashboard: { resultOperation: { status: '' } } }) => state;
    const store = createStore(rootReducer);
    it('should take ConfirmDialog snapshot', () => {
      const component = shallow(
        <Provider store={store}><ConfirmDialog {...defaultProps} /></Provider>,
      );
      expect(component).toMatchSnapshot();
    });
    it('does not show third question for isMaLoan false props', () => {
      const wrapper = shallow(
        <Provider store={store}><ConfirmDialog {...defaultProps} /></Provider>,
      );
      const spanElement = wrapper.find('span.maQuery');
      expect(spanElement.exists()).toBe(false);
    });
  });
});
