import React from 'react';
import ChatIcon from '@material-ui/icons/Chat';
import TrailButton from '@material-ui/icons/Email';
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
let loanActivityWidgets = {
  id: 'customCommunicationLetter',
  icon: <TrailButton />,
  component: <TrialLetter />,
  show: true,
};
loanActivityWidgets = [loanActivityWidgets, ...widgets];
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
