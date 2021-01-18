import React from 'react';
import renderer from 'react-test-renderer';
import { shallow, mount } from 'enzyme';
import mock from 'models/Testmock';
import Profile from '.';
import { userGroupList } from '../../../models/AppGroupName';

jest.mock('../../../lib/Auth.js');

// eslint-disable-next-line import/first
import Auth from '../../../lib/Auth';


describe('<Profile />', () => {
  const groups = [];
  const userDetails = {
    email: 'email',
    name: 'name',
  };
  const setRoleCallBack = jest.fn();
  const props = {
    groups,
    setRoleCallBack,
    userDetails,
    userRole: 'Agent',
  };

  const unchecked = ['POSTMODSTAGER', 'BOOKING', 'DOCGENVENDOR', 'BETA'];

  test('Feature toggle - disable userGroupToggle', () => {
    const managerGroups = ['docgenvendor-mgr',
      'booking',
      'trial-mgr'];
    const wrapper = shallow(
      <Profile {...props} groups={managerGroups} />,
    );

    const spy = jest.spyOn(wrapper.instance(), 'renderGroups');
    wrapper.update();
    wrapper.instance().forceUpdate();
    expect(spy).toBeCalled();
    expect(wrapper.find('WithStyles(ForwardRef(Button))')).toHaveLength(0);
  });


  test('Feature toggle - with default agent role', () => {
    const wrapper = shallow(
      <Profile
        {...props}
        featureToggle
        groups={['docgenvendor']}
        userGroups={[{
          '@odata.type': '#microsoft.graph.group',
          id: 'f29572e5-ba5c-4287-85b1-dbe1ef4974d8',
          description: 'This group will be used as dev access security group for docgenvendor role for CMOD application',
          displayName: 'cmod-dev-docgenvendor',
          securityEnabled: true,
          groupName: 'docgenvendor',
        }]}
      />,
    );
    expect(wrapper.instance().props.setRoleCallBack).toBeCalledWith('Agent');
  });
  const skills = { FEUW: ['Skill14::InVESTOR', 'Skill19::MRC Onshore', 'Skill1::something', 'Skill2::nothing'] };

  test('Feature toggle - enable userGroupToggle', () => {
    userGroupList.forEach((group) => {
      groups.push(group.toLowerCase());
      groups.push(`${group.toLowerCase()}-mgr`);
    });
    const userGroups = JSON.parse(JSON.stringify(mock.userGroups));
    const renderRoleAndGroups = jest.spyOn(Profile.prototype, 'renderRoleAndGroups');
    const wrapper = mount(
      <Profile {...props} featureToggle skills={skills} userGroups={userGroups} />,
    );
    const instance = wrapper.instance();
    const button = wrapper.find('WithStyles(ForwardRef(Button))');
    const handleSetGroups = jest.spyOn(instance, 'handleSetGroups');
    const handleResetGroups = jest.spyOn(instance, 'handleResetGroups');
    expect(renderRoleAndGroups).toBeCalled();
    expect(button).toHaveLength(2);
    Auth.updateUserGroups.mockImplementation(() => {});
    button.first().simulate('click');
    expect(handleSetGroups).toBeCalled();
    button.at(1).simulate('click');
    expect(handleResetGroups).toBeCalled();
    Auth.updateUserGroups.mockImplementation(() => {});
    expect(instance.state.isChecked).toEqual(mock.isChecked);
    expect(instance.state.isChecked).toEqual(mock.isChecked);
    button.first().simulate('click');
    wrapper.find('WithStyles(ForwardRef(Checkbox))').forEach((node) => {
      if (unchecked.includes(node.prop('value'))) { node.prop('onChange')({ target: { checked: false } }); }
    });
    expect(instance.state.isChecked).toEqual(mock.isCheckedFalse);
    button.first().simulate('click');
    expect(Auth.updateUserGroups).toBeCalledWith('email', mock.userGroupsUncheckedAgent);
    wrapper.find('WithStyles(ForwardRef(SwitchBase))').first().prop('onChange')({ target: { value: 'Manager' } });
    expect(wrapper.instance().props.setRoleCallBack).toBeCalledWith('Manager');
    wrapper.setProps({ userRole: 'Manager', userGroups: mock.userGroups });
    wrapper.find('WithStyles(ForwardRef(Checkbox))').forEach((node) => {
      if (unchecked.includes(node.prop('value'))) { node.prop('onChange')({ target: { checked: false } }); }
    });
    button.first().simulate('click');
    expect(Auth.updateUserGroups).toBeCalledWith('email', mock.userGroupsUncheckedManager);
  });

  test('snapshot test', () => {
    const tree = renderer
      .create(
        <Profile {...props} skills={skills} />,
      ).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
