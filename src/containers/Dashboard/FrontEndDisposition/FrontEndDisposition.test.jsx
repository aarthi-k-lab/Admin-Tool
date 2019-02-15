import React from 'react';
import { shallow } from 'enzyme';
import { TestHooks } from './FrontEndDisposition';

describe('<FrontEndDisposition />', () => {
  it('shows FrontEndDisposition widget in Loading mode', () => {
    const { Disposition } = TestHooks;
    const wrapper = shallow(
      <Disposition inProgress noTasksFound />,
    );
    expect(wrapper.find('Loader')).toHaveLength(1);
  });

  it('shows Disposition widget with no data', () => {
    const { Disposition } = TestHooks;
    const wrapper = shallow(
      <Disposition inProgress={false} noTasksFound />,
    );
    expect(wrapper.find('Loader')).toHaveLength(0);
    expect(wrapper.find('div')).toHaveLength(1);
    expect(wrapper.find('section')).toHaveLength(1);
    expect(wrapper.find('UserNotification')).toHaveLength(1);
  });

  it('shows Disposition widget with Radio Button Group without error Messages', () => {
    const { Disposition } = TestHooks;
    const wrapper = shallow(
      <Disposition dispositionErrorMessages={[]} inProgress={false} noTasksFound={false} />,
    );
    expect(wrapper.find('Loader')).toHaveLength(0);
    expect(wrapper.find('div')).toHaveLength(1);
    expect(wrapper.find('section')).toHaveLength(1);
    expect(wrapper.find('header')).toHaveLength(1);
    expect(wrapper.find('RadioButtonGroup')).toHaveLength(1);
  });

  it('shows Disposition widget with Radio Button Group with error Messages', () => {
    const { Disposition } = TestHooks;
    const wrapper = shallow(
      <Disposition
        dispositionErrorMessages={[{ expected: '', actual: '' }]}
        inProgress={false}
        noTasksFound={false}
      />,
    );
    expect(wrapper.find('Loader')).toHaveLength(0);
    expect(wrapper.find('div')).toHaveLength(1);
    expect(wrapper.find('section')).toHaveLength(1);
    expect(wrapper.find('header')).toHaveLength(1);
    expect(wrapper.find('UserNotification')).toHaveLength(1);
    expect(wrapper.find('RadioButtonGroup')).toHaveLength(1);
  });

  it('shows Disposition widget with Radio Button Group with enable get next Notif', () => {
    const { Disposition } = TestHooks;
    const wrapper = shallow(
      <Disposition
        dispositionErrorMessages={[]}
        enableGetNext
        inProgress={false}
        noTasksFound={false}
      />,
    );
    expect(wrapper.find('Loader')).toHaveLength(0);
    expect(wrapper.find('div')).toHaveLength(1);
    expect(wrapper.find('section')).toHaveLength(1);
    expect(wrapper.find('header')).toHaveLength(1);
    expect(wrapper.find('UserNotification')).toHaveLength(1);
    expect(wrapper.find('RadioButtonGroup')).toHaveLength(1);
  });

  it('shows Disposition widget with Save button', () => {
    const { Disposition } = TestHooks;
    const wrapper = shallow(
      <Disposition
        dispositionErrorMessages={[]}
        enableGetNext={false}
        inProgress={false}
        noTasksFound={false}
        saveInProgress={false}
      />,
    );
    expect(wrapper.find('Loader')).toHaveLength(0);
    expect(wrapper.find('div')).toHaveLength(1);
    expect(wrapper.find('section')).toHaveLength(1);
    expect(wrapper.find('header')).toHaveLength(1);
    expect(wrapper.find('UserNotification')).toHaveLength(0);
    expect(wrapper.find('RadioButtonGroup')).toHaveLength(1);
    expect(wrapper.find('WithStyles(Button)')).toHaveLength(1);
  });
  it('shows Disposition widget with Save in progress', () => {
    const { Disposition } = TestHooks;
    const wrapper = shallow(
      <Disposition
        dispositionErrorMessages={[]}
        dispositionReason="MissingDocs"
        enableGetNext
        inProgress={false}
        noTasksFound={false}
        saveInProgress
      />,
    );
    expect(wrapper.find('Loader')).toHaveLength(1);
    expect(wrapper.find('div')).toHaveLength(1);
    expect(wrapper.find('section')).toHaveLength(1);
    expect(wrapper.find('header')).toHaveLength(1);
    expect(wrapper.find('UserNotification')).toHaveLength(1);
    expect(wrapper.find('RadioButtonGroup')).toHaveLength(1);
  });
});
