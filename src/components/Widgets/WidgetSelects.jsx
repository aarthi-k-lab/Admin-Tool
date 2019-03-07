import React from 'react';
import ChatIcon from '@material-ui/icons/Chat';
import CommentsWidget from './CommentsWidget';

const widgets = [
  {
    id: 'Comments',
    icon: <ChatIcon />,
    component: <CommentsWidget />,
    show: true,
  },
];

export default function getWidgets() {
  return widgets;
}
