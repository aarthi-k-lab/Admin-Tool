import React from 'react';
import { shallow, mount } from 'enzyme';
import {
  fireEvent,
} from '@testing-library/dom';
import PropTypes from 'prop-types';
import { TestExports } from './Header';

const setWindowLocation = (url) => {
  delete global.window.location;
  global.window = Object.create(window);
  global.window.location = {
    protocol: 'http:',
    hostname: url,
  };
};

describe('<Header />', () => {
  const MountOptions = {
    context: {
      router: {
        history: {
          createHref: () => {
          },
          push: () => {
          },
          replace: () => {
          },
        },
      },
    },
    childContextTypes: {
      // eslint-disable-next-line react/forbid-prop-types
      router: PropTypes.object,
    },
  };
  const user = {
    userDetails: {
      email: 'brent@mrcooper.com',
      jobTitle: 'developer',
      name: 'brent',
    },
  };
  const setUserRole = jest.fn();
  const features = {
    userGroupsToggle: true,
  };
  const onClearSelectReject = jest.fn();
  const setBeginSearch = jest.fn();
  const historyMock = { push: jest.fn() };
  const onClearStagerTaskName = jest.fn();
  const onEndShift = jest.fn();
  const onAutoSave = jest.fn();
  const props = {
    features,
    historyMock,
    onAutoSave,
    onClearSelectReject,
    onClearStagerTaskName,
    onEndShift,
    setBeginSearch,
    setUserRole,
    user,
  };
  it('Hotkey \'s\' pressed ', () => {
    const MountOptions = {
      context: {
        router: {
          history: {
            createHref: () => {
            },
            push: () => {
            },
            replace: () => {
            },
          },
        },
      },
      childContextTypes: {
        // eslint-disable-next-line react/forbid-prop-types
        router: PropTypes.object,
      },
    };
    const wrapper = mount(
      <TestExports.Header
        features={features}
        history={historyMock}
        onClearSelectReject={onClearSelectReject}
        setBeginSearch={setBeginSearch}
        setUserRole={setUserRole}
        user={user}
      />, MountOptions,
    );

    const { textInput } = wrapper.instance();
    const spy = jest.spyOn(textInput.current, 'focus');
    fireEvent.keyDown(document.body, { key: 's', keyCode: 83 });
    expect(spy).toHaveBeenCalled();
  });
  it('Hotkey \'s\' pressed after unmount ', () => {
    const MountOptions = {
      context: {
        router: {
          history: {
            createHref: () => {
            },
            push: () => {
            },
            replace: () => {
            },
          },
        },
      },
      childContextTypes: {
        // eslint-disable-next-line react/forbid-prop-types
        router: PropTypes.object,
      },
    };
    const wrapper = mount(
      <TestExports.Header
        features={features}
        history={historyMock}
        onClearSelectReject={onClearSelectReject}
        setBeginSearch={setBeginSearch}
        setUserRole={setUserRole}
        user={user}
      />, MountOptions,
    );
    const { textInput } = wrapper.instance();
    const spy = jest.spyOn(textInput.current, 'focus');
    wrapper.instance().componentWillUnmount();
    fireEvent.keyDown(document.body, { key: 's', keyCode: 83 });
    expect(spy).not.toHaveBeenCalled();
  });
  it('shows Header', () => {
    const wrapper = shallow(
      <TestExports.Header features={features} setUserRole={setUserRole} user={user} />,
    );
    expect(wrapper.find('Link')).toHaveLength(1);
    expect(wrapper.find('WithStyles(ForwardRef(IconButton))')).toHaveLength(1);
    wrapper.find('WithStyles(ForwardRef(IconButton))').simulate('Click');
    expect(wrapper.instance().state.showProfileDetails).toBe(true);
    wrapper.instance().handleProfileClose();
    expect(wrapper.instance().state.showProfileDetails).toBe(false);
  });
  it('Click on loan search icon without text entered', () => {
    const wrapper = mount(
      <TestExports.Header
        {...props}
      />, MountOptions,
    );
    wrapper.find('img').at(1).simulate('click');
    expect(historyMock.push).not.toBeCalled();
  });
  it('enter loan number in loan search and search loan', () => {
    const wrapper = shallow(
      <TestExports.Header
        features={features}
        history={historyMock}
        onClearSelectReject={onClearSelectReject}
        setBeginSearch={setBeginSearch}
        setUserRole={setUserRole}
        user={user}
      />,
    );
    wrapper.find('WithStyles(ForwardRef(TextField))').simulate('change', { target: { value: 'cmod' } });
    expect(wrapper.instance().state.searchText).toBe('');
    wrapper.find('WithStyles(ForwardRef(TextField))').simulate('change', { target: { value: 1234 } });
    wrapper.find('WithStyles(ForwardRef(TextField))').simulate('keypress', { keyCode: '88' });
    expect(historyMock.push).not.toBeCalled();
    wrapper.find('WithStyles(ForwardRef(TextField))').simulate('change', { target: { value: 1234 } });
    wrapper.find('WithStyles(ForwardRef(TextField))').simulate('keypress', { key: 'Enter' });
    expect(wrapper.instance().state.searchText).toBe(1234);
    expect(historyMock.push).toHaveBeenCalled();
    wrapper.setProps({ clearSearch: true });
    expect(wrapper.instance().state.searchText).toBe('');
  });
  it('landing page click', () => {
    const wrapper = shallow(
      <TestExports.Header
        features={features}
        history={historyMock}
        onAutoSave={onAutoSave}
        onClearSelectReject={onClearSelectReject}
        onClearStagerTaskName={onClearStagerTaskName}
        onEndShift={onEndShift}
        setBeginSearch={setBeginSearch}
        setUserRole={setUserRole}
        user={user}
      />,
    );
    wrapper.find('Link').simulate('click');
    expect(onAutoSave).not.toBeCalled();
    expect(onClearStagerTaskName).toHaveBeenCalled();
    expect(onEndShift).toHaveBeenCalled();
    wrapper.setProps({ evalId: 12345, enableGetNext: false, isAssigned: true });
    wrapper.find('Link').simulate('click');
    expect(onAutoSave).toHaveBeenCalled();
    expect(onClearStagerTaskName).toHaveBeenCalled();
    expect(onEndShift).toHaveBeenCalled();
  });
  it('get env', () => {
    setWindowLocation('localhost');
    let wrapper = shallow(
      <TestExports.Header
        {...props}
      />,
    );
    expect(wrapper.find('span').get(0).props.children).toBe(' - LOCAL');
    setWindowLocation('127.0.0.1');
    wrapper = shallow(
      <TestExports.Header
        {...props}
      />,
    );
    expect(wrapper.find('span').get(0).props.children).toBe(' - LOCAL');
    setWindowLocation('dev.cmod.mrcooper.io');
    wrapper = shallow(
      <TestExports.Header
        {...props}
      />,
    );
    expect(wrapper.find('span').get(0).props.children).toBe(' - DEV');
    setWindowLocation('cmod.mrcooper.io');
    wrapper = shallow(
      <TestExports.Header
        {...props}
      />,
    );
    expect(wrapper.find('span').get(0).props.children).toBe('');
  });
});
