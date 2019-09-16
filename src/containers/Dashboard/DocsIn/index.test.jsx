import React from 'react';
import { shallow } from 'enzyme';
import { TestHooks } from './DocsIn';

describe('DocsIn ', () => {
  it('shows DocsIn widget ', () => {
    const wrapper = shallow(<TestHooks.DocsIn />);
    // console.log(wrapper.debug());
    const grid = wrapper.find('ContentHeader');
    
    expect(grid).toHaveLength(1);
  });

  it('shows DocsIn widget without in progress ', () => {
    const { DocsIn } = TestHooks;
    const wrapper = shallow(<DocsIn />);

    expect(wrapper.find('Loader')).toHaveLength(0);
  });  
  it('shows DocsIn widget in progress ', () => {
    const { DocsIn } = TestHooks;
    const wrapper = shallow(<DocsIn inProgress={true} />);

    expect(wrapper.find('Loader')).toHaveLength(1);
  });  
});
