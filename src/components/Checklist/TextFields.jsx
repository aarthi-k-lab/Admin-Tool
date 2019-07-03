import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import TextField from '@material-ui/core/TextField';
import React from 'react';
import HTMLElements from '../../constants/componentTypes';
import './TextFields.css';


function getCurrentDate() {
  const date = new Date();
  const year = date.getFullYear();
  let month = date.getMonth() + 1;
  let dt = date.getDate();
  if (dt < 10) {
    dt = `0${dt}`;
  }
  if (month < 10) {
    month = `0${month}`;
  }
  return `${year}-${month}-${dt}`;
}

function getProps(type, props) {
  const { MULTILINE_TEXT, DATE, NUMBER } = HTMLElements;
  switch (type) {
    case DATE: {
      return { ...props, inputProps: { type: 'date', max: getCurrentDate() } };
    }
    case MULTILINE_TEXT: {
      return {
        ...props, maxRows: 10, multiline: true, rows: 5,
      };
    }
    case NUMBER: {
      return {
        ...props,
        inputProps: {
          type: 'number',
          min: '0',
        },
      };
    }
    default: return { ...props };
  }
}

const TextFields = (props) => {
  const { type, title } = props;
  const properties = getProps(type, props);
  return (
    <FormControl component="fieldset">
      <FormLabel component="legend" styleName="text-label">{title}</FormLabel>
      <TextField {...properties} />
    </FormControl>
  );
};

export default TextFields;
