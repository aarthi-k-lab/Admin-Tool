import React from 'react';
import { shallow } from 'enzyme';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextareaAutosize';
import Button from '@material-ui/core/Button';
import { TestHooks } from './MoveForward';

describe('<MoveForward />', () => {
  it('should render MoveForward component', () => {
    const { MoveForward } = TestHooks;
    const dropDown = jest.spyOn(MoveForward.prototype, 'renderDropdown');
    const table =  jest.spyOn(MoveForward.prototype, 'renderTableData');
    const notepad = jest.spyOn(MoveForward.prototype, 'renderNotepadArea');
    const wrapper = shallow(
      <TestHooks.MoveForward />,
    );
    expect(wrapper.find(Select)).toHaveLength(1);
    expect(wrapper.find(TextField)).toHaveLength(1);
    expect(wrapper.find(Button)).toHaveLength(1);
    expect(dropDown).toBeCalled();
    expect(table).toBeCalled();
    expect(notepad).toBeCalled();
  });
});
