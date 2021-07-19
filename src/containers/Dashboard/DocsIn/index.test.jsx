import React from 'react';
import { shallow } from 'enzyme';
import { TestHooks } from './DocsIn';

const groups = ['postmodstager', 'postmodstager-mgr', 'stager-mgr', 'stager'];

const defaultProps = {
  bulkOrderPageType: '',
  history: [],
  onClearStagerResponse: jest.fn(),
  onClearStagerTaskName: jest.fn(),
  onSelect: jest.fn(),
  setPageType: jest.fn(),
  user: {},
};
describe('DocsIn ', () => {
  it('shows DocsIn widget ', () => {
    const wrapper = shallow(<TestHooks.DocsIn {...defaultProps} groupName="ALLSTAGER" groups={groups} />);
    const grid = wrapper.find('ContentHeader');

    expect(grid).toHaveLength(0);
  });

  it('shows DocsIn widget without in progress ', () => {
    const { DocsIn } = TestHooks;
    const wrapper = shallow(<DocsIn {...defaultProps} groupName="ALLSTAGER" groups={groups} />);

    expect(wrapper.find('Loader')).toHaveLength(0);
  });
  it('shows DocsIn widget in progress ', () => {
    const { DocsIn } = TestHooks;
    const wrapper = shallow(<DocsIn {...defaultProps} groupName="ALLSTAGER" groups={groups} inProgress />);

    expect(wrapper.find('Loader')).toHaveLength(1);
  });
});
