import React from 'react';
import { shallow } from 'enzyme';
import SlaRules from './SlaRules';

describe('renders <SlaRules /> for false case', () => {
  const props = {
    additionalInfo: {
      displayName: 'mock',
    },
    options: {
      displayName: 'mock',
      hint: 'hint',
      isEnabled: true,
      textColor: 'mock',
      value: 'mock',
      text: 'mock',
      Check: 'false',
    },
    title: 'mock',
    value: 'mock',
  };
  const wrapper = shallow(
    <SlaRules {...props} />,
  );
  it('should render SlaRules', () => {
    expect(wrapper.find('Fragment')).toHaveLength(1);
  });
  it('should render UserNotification', () => {
    expect(wrapper.find('UserNotification')).toHaveLength(1);
  });
  it('should render TextField', () => {
    expect(wrapper.find('WithStyles(ForwardRef(TextField))')).toHaveLength(1);
  });
});

describe('renders <SlaRules /> for true case', () => {
  const props = {
    additionalInfo: {
      displayName: 'mock',
    },
    options: {
      displayName: 'mock',
      hint: 'hint',
      isEnabled: true,
      textColor: 'mock',
      value: 'mock',
      text: 'mock',
      Check: 'true',
    },
    title: 'mock',
    value: 'mock',
  };
  const wrapper = shallow(
    <SlaRules {...props} />,
  );
  it('should render SlaRules', () => {
    expect(wrapper.find('Fragment')).toHaveLength(1);
  });
  it('should render UserNotification', () => {
    expect(wrapper.find('UserNotification')).toHaveLength(1);
  });
  it('should not render TextField', () => {
    expect(wrapper.find('WithStyles(ForwardRef(TextField))')).toHaveLength(0);
  });
});

describe('renders <SlaRules /> for null case', () => {
  const props = {
    additionalInfo: {
      displayName: 'mock',
    },
    options: {
      displayName: 'mock',
      hint: 'hint',
      isEnabled: true,
      textColor: 'mock',
      value: 'mock',
    },
    title: 'mock',
    value: 'mock',
  };
  const wrapper = shallow(
    <SlaRules {...props} />,
  );
  it('should render SlaRules', () => {
    expect(wrapper.find('Fragment')).toHaveLength(1);
  });
  it('should not render UserNotification', () => {
    expect(wrapper.find('UserNotification')).toHaveLength(0);
  });
  it('should not render TextField', () => {
    expect(wrapper.find('WithStyles(ForwardRef(TextField))')).toHaveLength(0);
  });
});
