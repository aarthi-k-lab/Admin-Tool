import React from 'react';
import { shallow } from 'enzyme';
import TabPanel from './TabPanel';

const defaultProps = {
  index: 0,
  value: 0,
};
describe('<Tabs />', () => {
  it('should render the child component', () => {
    const Something = () => null;
    const wrapper = shallow(

      <TabPanel {...defaultProps}>
        <Something />
      </TabPanel>,

    );
    expect(wrapper.find('Something')).toHaveLength(1);
  });
});
