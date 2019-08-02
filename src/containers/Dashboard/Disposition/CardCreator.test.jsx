import React from 'react';
import { shallow } from 'enzyme';
import { TestHooks } from './CardCreator';

describe('<CardCreator />', () => {
  const items = [
    {
      id: 'ID1',
      name: 'N1',
      activities: [{ id: 'I1', activityName: 'AN1', verbiage: 'V1' }],
      labelDisplay: 'LD1',
      expanded: false,
    },
    {
      id: 'ID2',
      name: 'N2',
      activities: [{ id: 'I2', activityName: 'AN2', verbiage: 'V2' }],
      labelDisplay: 'LD2',
      expanded: false,
    },
  ];
  it('toggle iconbutton and rendering the radiobutton component', () => {
    const { CardCreator } = TestHooks;
    const wrapper = shallow(
      <CardCreator
        onDispositionSelect={() => console.log('test')}
        selectedActivity="FILE INCOMPLETE"
        status={items[0]}
      />,
    );
    wrapper.find('WithStyles(ForwardRef(IconButton))').simulate('click');
    expect(wrapper.find('ForwardRef(RadioGroup)').children()).toHaveLength(items[0].activities.length);
  });
});
