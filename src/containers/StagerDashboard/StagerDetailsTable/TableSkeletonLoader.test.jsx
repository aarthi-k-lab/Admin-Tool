import React from 'react';
import renderer from 'react-test-renderer';
import renderSkeletonLoader from './TableSkeletonLoader';

describe('<Table Skeleton Component />', () => {
  it('Skeleton renders correctly', () => {
    const tree = renderer
      .create(<renderSkeletonLoader />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
