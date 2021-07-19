import React from 'react';
import { shallow } from 'enzyme';
import { TestHooks } from './UserReport';

const props = {
  setPageType: jest.fn(),
  fetchPowerBIConstants: jest.fn(),
  history: [],
};
describe('<UserReport />', () => {
  const { UserReport } = TestHooks;
  it('should render Content Header component', () => {
    const location = {
      pathname: '/dg-vendor',
    };
    const userGroupList = ['proc'];
    const wrapper = shallow(<UserReport
      {...props}
      location={location}
      userGroupList={userGroupList}
    />);
    expect(wrapper.find('Connect(ContentHeader)')).toHaveLength(1);
    expect(wrapper.instance().showAddDocsIn).toBe(true);
    wrapper.instance().onHandleClick();
    expect(wrapper.instance().props.history).toContain('/coviusBulkOrder');
  });
  it('should render expand component if the group is docgenvendor', () => {
    const location = {
      pathname: '/dg-vendor',
    };
    const userGroupList = ['proc'];
    const onExpand = jest.fn();
    const wrapper = shallow(<UserReport {...props} location={location} onExpand={onExpand} userGroupList={userGroupList} />);
    expect(wrapper.find('Connect(ContentHeader)')).toHaveLength(1);
    expect(wrapper.instance().showAddDocsIn).toBe(true);
    expect(wrapper.find('Expand')).toHaveLength(1);
    wrapper.instance().props.onExpand();
    expect(onExpand.mock.calls.length).toBe(1);
  });
  it('should render Controls component if the group is docgenvendor', () => {
    const location = {
      pathname: '/special-loan',
    };
    const userGroupList = ['proc'];
    const wrapper = shallow(<UserReport {...props} location={location} userGroupList={userGroupList} />);
    expect(wrapper.find('Connect(ContentHeader)')).toHaveLength(1);
    expect(wrapper.instance().showAddDocsIn).toBe(false);
    expect(wrapper.find('withRouter(Connect(Controls))')).toHaveLength(1);
  });
  it('should render reports in the dashboard', () => {
    const location = {
      pathname: '/dg-vendor',
    };
    const powerBIConstants = [{
      groupId: '365427',
      reportId: '12345',
      reportUrl: 'abc/xyz',
      reportName: 'DOCGEN VENDOR Agent Dashboard',
    }];
    const userGroupList = ['proc'];
    const wrapper = shallow(<UserReport {...props} location={location} powerBIConstants={powerBIConstants} userGroupList={userGroupList} />);
    expect(wrapper.find('div')).toHaveLength(1);
    wrapper.instance().reportStyle = { width: '100%', height: '100%' };
    wrapper.instance().accessToken = '12345';
    expect(wrapper.instance().accessToken).toBe('12345');
    wrapper.instance().forceUpdate();
    expect(wrapper.find('Report')).toHaveLength(1);
  });
  it('should show authentication message until the accesstoken and powerbi constants are obtained', () => {
    const location = {
      pathname: '/dg-vendor',
    };
    const powerBIReports = [{
      groupId: '365427',
      reportId: '12345',
      reportUrl: 'abc/xyz',
      reportName: 'DOCGEN VENDOR Agent Dashboard',
    }];
    const userGroupList = ['proc'];
    const wrapper = shallow(<UserReport {...props} location={location} powerBIConstants={powerBIReports} userGroupList={userGroupList} />);
    expect(wrapper.find('div')).toHaveLength(1);
    expect(wrapper.find('Center')).toHaveLength(1);
    expect(wrapper.find('span')).toHaveLength(1);
    expect(wrapper.find('span').text()).toBe('Authenticating with PowerBI...');
  });
  it('should show report under construction message when there is no report name from the powerbi constants', () => {
    const location = {
      pathname: '/dg-vendor',
    };
    const powerBIReports = [{
      groupId: '365427',
      reportId: '12345',
      reportUrl: 'abc/xyz',
      reportName: 'abc',
    }];
    const userGroupList = ['proc'];
    const wrapper = shallow(<UserReport {...props} location={location} powerBIConstants={powerBIReports} userGroupList={userGroupList} />);
    expect(wrapper.find('div')).toHaveLength(1);
    expect(wrapper.find('Center')).toHaveLength(1);
    expect(wrapper.find('span')).toHaveLength(1);
    expect(wrapper.find('span').text()).toBe('Report is under Construction...');
  });
});
