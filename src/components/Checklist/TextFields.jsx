import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import TextField from '@material-ui/core/TextField';
import React from 'react';
import HTMLElements from '../../constants/componentTypes';
import './TextFields.css';

const TextFields = (props) => {
  const { MULTILINE_TEXT } = HTMLElements;
  const { type, title } = props;
  const properties = type !== MULTILINE_TEXT ? props : {
    ...props, maxRows: 10, multiline: true, rows: 5,
  };
  return (
    <FormControl component="fieldset">
      <FormLabel component="legend" styleName="text-label">{title}</FormLabel>
      <TextField {...properties} />
    </FormControl>
  );
};

export default TextFields;
