import React from 'react';
import { shallow } from 'enzyme';
import { TestHooks } from './DocsIn';

const groups = ['post-mod-stager', 'post-mod-stager-mgr', 'stager-mgr', 'stager'];

describe('DocsIn ', () => {
  it('shows DocsIn widget ', () => {
    const wrapper = shallow(<TestHooks.DocsIn groups={groups} />);
    // console.log(wrapper.debug());
    const grid = wrapper.find('ContentHeader');

    expect(grid).toHaveLength(0);
  });

  it('shows DocsIn widget without in progress ', () => {
    const { DocsIn } = TestHooks;
    const wrapper = shallow(<DocsIn groups={groups} />);

    expect(wrapper.find('Loader')).toHaveLength(0);
  });
  it('shows DocsIn widget in progress ', () => {
    const { DocsIn } = TestHooks;
    const wrapper = shallow(<DocsIn groups={groups} inProgress />);

    expect(wrapper.find('Loader')).toHaveLength(1);
  });
});
