import React from 'react';
import renderer from 'react-test-renderer';
import Profile from '.';

describe('<Profile />', () => {
  test('snapshot test', () => {
    const tree = renderer
      .create(
        <Profile
          groups={['group1', 'group2']}
          skills={['Skill14', 'Skill19', 'Skill1', 'Skill2']}
          userDetails={{
            email: 'email',
            name: 'name',
          }}
        />,
      ).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
