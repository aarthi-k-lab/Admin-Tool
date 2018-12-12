import React from 'react';
import renderer from 'react-test-renderer';
import LeftNav from './LeftNav';

describe('<LeftNav Components />', () => {
  it('LeftNav renders correctly', () => {
    const user = {
      userDetails: {
        email: 'bernt@mrcooper.com',
        jobTitle: 'CEO',
        name: 'brent',
      },
    };
    const tree = renderer
      .create(<LeftNav user={user} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
