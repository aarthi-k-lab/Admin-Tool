import React from 'react';
import { shallow } from 'enzyme';
import Tombstone from '.';
import Item from './Item';
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
    const wrapper = shallow(<Tombstone items={items} />);
    wrapper.find('WithStyles(IconButton)').simulate('Click');
    expect(wrapper.find(Item.name)).toHaveLength(items.length);
    expect(wrapper.find(Item.name).at(0).props().content).toBe(items[0].content);
    expect(wrapper.find(Item.name).at(0).props().title).toBe(items[0].title);
    expect(wrapper.find(Item.name).at(1).props().content).toBe(items[1].content);
    expect(wrapper.find(Item.name).at(1).props().title).toBe(items[1].title);
  });

  test('calls the \'onOpenWindow\' prop', () => {
    const handleOnOpenWindow = jest.fn();
    const wrapper = shallow(<Tombstone onOpenWindow={handleOnOpenWindow} />);
    wrapper.find('WithStyles(IconButton)').simulate('Click');
    expect(handleOnOpenWindow.mock.calls).toHaveLength(1);
  });
});