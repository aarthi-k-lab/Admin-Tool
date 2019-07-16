import React from 'react';
import { shallow } from 'enzyme';
import { TestHooks } from './DocGenGoBack';

describe('<DocGenGoBack />', () => {
  it('shows DocGenGoBack widget with buttons ', () => {
    const { DocGenGoBack } = TestHooks;
    const user = {"id": 25, "groupList": "docgen-mgr"}
    const wrapper = shallow(<DocGenGoBack user={user} />);
    const grid = wrapper.find('ContentHeader');
    
    expect(grid).toHaveLength(1);
    expect(wrapper.find({ showSendToDocGen: true, showSendToDocGenStager: true })).toHaveLength(1);
  });
  it('shows DocGenGoBack widget without buttons ', () => {
    const { DocGenGoBack } = TestHooks;
    const user = {"id": 25, "groupList": "util"}
    const wrapper = shallow(<DocGenGoBack user={user} />);
    const grid = wrapper.find('ContentHeader');

    expect(grid).toHaveLength(1);
    expect(wrapper.find({ showSendToDocGen: true, showSendToDocGenStager: true })).toHaveLength(0);
  });
  it('shows DocGenGoBack widget without in progress ', () => {
    const { DocGenGoBack } = TestHooks;
    const user = {"id": 25, "groupList": "util-mrg"}
    const wrapper = shallow(<DocGenGoBack inProgress={false} user={user} />);

    expect(wrapper.find('Loader')).toHaveLength(0);
  });  
  it('shows DocGenGoBack widget in progress ', () => {
    const { DocGenGoBack } = TestHooks;
    const user = {"id": 25, "groupList": "util-mrg"}
    const wrapper = shallow(<DocGenGoBack inProgress={true} user={user} />);

    expect(wrapper.find('Loader')).toHaveLength(1);
  });  
});
