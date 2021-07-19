import React from 'react';
import { shallow } from 'enzyme';
import { TestHooks } from './DocGenGoBack';

const defaultProps = {
  dispositionReason: '',
  EvalId: 0,
  LoanNumber: 0,
  onAdditionalInfo: jest.fn(),
  onAdditionalInfoSelect: jest.fn(),
  onHistorySelect: jest.fn(),
  onPostComment: jest.fn(),
  TaskId: 0,

};
describe('<DocGenGoBack />', () => {
  it('shows DocGenGoBack widget with buttons ', () => {
    const { DocGenGoBack } = TestHooks;
    const user = { id: 25, groupList: ['docgen-mgr'], skills: [] };
    const wrapper = shallow(<DocGenGoBack {...defaultProps} user={user} />);
    const grid = wrapper.find('ContentHeader');

    expect(grid).toHaveLength(0);
    expect(wrapper.find({ showSendToDocGen: true, showSendToDocGenStager: true })).toHaveLength(1);
  });
  it('shows DocGenGoBack widget without buttons ', () => {
    const { DocGenGoBack } = TestHooks;
    const user = { id: 25, groupList: ['util'], skills: [] };
    const wrapper = shallow(<DocGenGoBack {...defaultProps} user={user} />);
    const grid = wrapper.find('ContentHeader');

    expect(grid).toHaveLength(0);
    expect(wrapper.find({ showSendToDocGen: true, showSendToDocGenStager: true })).toHaveLength(0);
  });
  it('shows DocGenGoBack widget without in progress ', () => {
    const { DocGenGoBack } = TestHooks;
    const user = { id: 25, groupList: ['util-mrg'], skills: [] };
    const wrapper = shallow(<DocGenGoBack {...defaultProps} inProgress={false} user={user} />);

    expect(wrapper.find('Loader')).toHaveLength(0);
  });
  it('shows DocGenGoBack widget in progress ', () => {
    const { DocGenGoBack } = TestHooks;
    const user = { id: 25, groupList: ['util-mrg'], skills: [] };
    const wrapper = shallow(<DocGenGoBack {...defaultProps} inProgress user={user} />);

    expect(wrapper.find('Loader')).toHaveLength(1);
  });
});
