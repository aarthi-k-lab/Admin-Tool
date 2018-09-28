import React from 'react';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import AlertBox from '.';

describe('<AlertBox />', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<AlertBox level="error" message="Please retry" />);
  });

  it('snapshot test for error level', () => {
    const tree = renderer
      .create(<AlertBox level="error" message="Please retry" />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('snapshot test for success level', () => {
    const tree = renderer
      .create(<AlertBox level="success" message="Enjoy your cupcake!" />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('snapshot test for other levels', () => {
    const tree = renderer
      .create(<AlertBox level="info" message="Informational message" />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should render the AlertBox component', () => {
    expect(wrapper.find('span').text()).toBe('Please retry');
  });
});
