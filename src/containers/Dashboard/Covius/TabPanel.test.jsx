import React from 'react';
import { shallow } from 'enzyme';
import TabPanel from './TabPanel';

describe('<Tabs />', () => {
  it('should render the child component', () => {
    const Something = () => null;
    const wrapper = shallow(
      <TabPanel>
        <Something />
      </TabPanel>,
    );
    expect(wrapper.find('Something')).toHaveLength(1);
  });
});
