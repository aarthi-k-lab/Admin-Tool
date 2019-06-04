import React from 'react';
import ChatIcon from '@material-ui/icons/Chat';
import CommentsWidget from './CommentsWidget';
import TrialLetter from '../../containers/LoanActivity/TrialLetter/TrialLetter';

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
    icon: <ChatIcon />,
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
