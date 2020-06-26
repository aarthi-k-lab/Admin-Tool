/* eslint-disable react/jsx-closing-tag-location */
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
let bookingAutomationWidget = {
  id: 'BookingAutomation',
  icon: <img alt="BookingAutomation" src="/static/img/bookingWidget.svg" />,
  show: true,
};
loanActivityWidgets = [loanActivityWidgets, ...widgets];
function getWidgets() {
  return widgets;
}

function getLoanActivityWidgets() {
  return loanActivityWidgets;
}

bookingAutomationWidget = [...widgets, bookingAutomationWidget];

function getBookingAutomationWidget() {
  return bookingAutomationWidget;
}

export {
  getWidgets,
  getLoanActivityWidgets,
  getBookingAutomationWidget,
};
