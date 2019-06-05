import React from 'react';
import ChatIcon from '@material-ui/icons/Chat';
import IconButton from '@material-ui/core/IconButton';
import CommentsWidget from './CommentsWidget';
import TrialLetter from '../../containers/LoanActivity/TrialLetter/TrialLetter';

function CustomCommunicationLetter() {
  return (
    <IconButton>
      <img alt="customCommunicationLetter   " src="/static/img/customCommunicationLetter.png" />
    </IconButton>
  );
}

const widgets = [
  {
    id: 'Comments',
    icon: <ChatIcon />,
    component: <CommentsWidget />,
    show: true,
  },
];

const loanActivityWidgets = [
  {
    id: 'customCommunicationLetter',
    icon: CustomCommunicationLetter(),
    component: <TrialLetter />,
    show: true,
  },
  {
    id: 'Comments',
    icon: <ChatIcon />,
    component: <CommentsWidget />,
    show: true,
  },
];

function getWidgets() {
  return widgets;
}

function getLoanActivityWidgets() {
  return loanActivityWidgets;
}

export {
  getWidgets,
  getLoanActivityWidgets,
};
