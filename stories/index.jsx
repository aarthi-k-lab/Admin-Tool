import React from 'react';
import { storiesOf } from '@storybook/react';
import { Button } from '@storybook/react/demo';
import Checklist from '../src/components/Checklist';
import { MuiThemeProvider } from '@material-ui/core/styles';
import theme from 'lib/Theme';

storiesOf('Button', module)
  .add('with text', () => (
    <Button>Hello Button</Button>
  ))
  .add('with some emoji', () => (
    <Button><span aria-label="so cool" role="img">😀 😎 👍 💯</span></Button>
  ));

const checklistItems = [
  {
    options: [
      { displayName: 'Yes', value: 'yes' },
      { displayName: 'No', value: 'no' },
    ],
    title: 'Are all documents received',
    type: 'radio',
  },
  {
    options: [
      { displayName: 'complete', value: 'complete' },
      { displayName: 'incomplete', value: 'incomplete' },
    ],
    title: 'Update Document Expiration Date',
    type: 'radio',
  },
  {
    options: [
      { displayName: 'complete', value: 'complete' },
      { displayName: 'incomplete', value: 'incomplete' },
    ],
    title: 'Update Document Checklist for Document Validation',
    type: 'radio',
  },
  {
    options: [
      { displayName: 'complete', value: 'complete' },
      { displayName: 'incomplete', value: 'incomplete' },
    ],
    title: 'Oscars Summary',
    type: 'multiline-text',
  },
];

storiesOf('Checklist', module)
  .add('default', () => (
    <MuiThemeProvider theme={theme}>
      <Checklist checklistItems={checklistItems} title="Document Review" />
    </MuiThemeProvider>
  ));
