import React from 'react';
import renderer from 'react-test-renderer';
import Profile from '.';

describe('<Profile />', () => {
  test('snapshot test', () => {
    const setRoleCallBack = jest.fn();
    const tree = renderer
      .create(
        <Profile
          groups={['group1', 'group2']}
          setRoleCallBack={setRoleCallBack}
          skills={{ FEUW: ['Skill14::InVESTOR', 'Skill19::MRC Onshore', 'Skill1::something', 'Skill2::nothing'] }}
          userDetails={{
            email: 'email',
            name: 'name',
          }}
        />,
      ).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
