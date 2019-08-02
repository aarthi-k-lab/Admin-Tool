import React from 'react';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import { TombstoneLoader, TombstoneError } from '.';
import Item from './Item';
import { TestHooks } from './Tombstone';

jest.mock('./Item');

describe('<Tombstone />', () => {
  beforeEach(() => {
    Item.mockClear();
  });

  test('contains the items passed as props', () => {
    const items = [
      {
        content: 'C1',
        title: 'T1',
      },
      {
        content: 'C2',
        title: 'T2',
      },
    ];
    const wrapper = shallow(<TestHooks.Tombstone items={items} />);
    wrapper.find('WithStyles(ForwardRef(IconButton))').at(0).simulate('Click');
    expect(wrapper.find(Item.name)).toHaveLength(items.length);
    expect(wrapper.find(Item.name).at(0).props().content).toBe(items[0].content);
    expect(wrapper.find(Item.name).at(0).props().title).toBe(items[0].title);
    expect(wrapper.find(Item.name).at(1).props().content).toBe(items[1].content);
    expect(wrapper.find(Item.name).at(1).props().title).toBe(items[1].title);
  });

  test('calls the \'onOpenWindow\' prop', () => {
    const handleOnOpenWindow = jest.fn();
    const wrapper = shallow(<TestHooks.Tombstone onOpenWindow={handleOnOpenWindow} />);
    expect(wrapper.find('WithStyles(ForwardRef(IconButton))').at(0).prop('onClick')).toBe(handleOnOpenWindow);
  });
});

describe('<TombstoneLoader />', () => {
  test('snapshot test', () => {
    const tree = renderer
      .create(<TombstoneLoader />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});

describe('<TombstoneError />', () => {
  test('snapshot test', () => {
    const tree = renderer
      .create(<TombstoneError />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
