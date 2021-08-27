import React from 'react';
import ChatIcon from '@material-ui/icons/Chat';
import HistoryIcon from '@material-ui/icons/History';
import TrailButton from '@material-ui/icons/Email';
import Exposure from '@material-ui/icons/Exposure';
import * as R from 'ramda';
import {
  COMMENTS,
  ADDITIONAL_INFO,
  HISTORY,
  CUSTOM_COMM_LETTER,
  BOOKING,
  INCOME_CALCULATOR,
  FHLMC,
} from 'constants/widgets';
import CommentsWidget from './CommentsWidget';
import TrialLetter from '../../containers/LoanActivity/TrialLetter/TrialLetter';
import FHLMCWidget from './FHLMCWidget';

const widgets = [
  {
    id: CUSTOM_COMM_LETTER,
    icon: <TrailButton />,
    component: <TrialLetter />,
    visibility: ['LA'],
    defaultOpen: true,
  },
  {
    id: COMMENTS,
    icon: <ChatIcon />,
    component: <CommentsWidget />,
    visibility: ['FEUW', 'BEUW', 'PROC', 'DOCGEN', 'DOCSIN', 'STAGER', 'LA',
      'BOOKING', 'SEARCH_LOAN', 'DOCGEN_GOBACK', 'MLSTN_PAGE', 'POSTMOD', 'UWSTAGER'],
    overlay: true,
  },
  {
    id: ADDITIONAL_INFO,
    icon: <img alt="Additional Info" src="/static/img/information.png" />,
    visibility: ['FEUW', 'BEUW', 'PROC', 'DOCGEN', 'DOCSIN', 'STAGER', 'LA',
      'BOOKING', 'SEARCH_LOAN', 'POSTMOD', 'UWSTAGER'],
    children: [COMMENTS],
  },
  {
    id: HISTORY,
    icon: <HistoryIcon />,
    visibility: ['FEUW', 'BEUW', 'PROC', 'DOCGEN', 'DOCSIN',
      'STAGER', 'LA', 'BOOKING', 'POSTMOD'],
    children: [COMMENTS],
  },
  {
    id: BOOKING,
    icon: <img alt="BookingAutomation" src="/static/img/bookingWidget.svg" />,
    visibility: ['DOCSIN', 'BOOKING'],
    children: [COMMENTS],
  },
  {
    id: INCOME_CALCULATOR,
    icon: <Exposure />,
    visibility: ['FEUW', 'BEUW', 'PROC', 'DOCGEN', 'DOCSIN',
      'BOOKING'],
    children: [COMMENTS],
  },
  {
    id: FHLMC,
    icon: <img alt="FHLMC" src="/static/img/Freddie-Widget.svg" />,
    component: <FHLMCWidget />,
    visibility: ['BEUW', 'DOCGEN', 'POSTMOD'],
    overlay: true,
    children: [COMMENTS],
  },
];


function getWidgets(page) {
  return widgets.filter(widget => R.contains(page, widget.visibility));
}

function getSelectedWidget(widgetId, page) {
  return R.find(R.propEq('id', widgetId))(getWidgets(page));
}

function getBookingWidget(page) {
  return R.find(R.propEq('id', BOOKING))(getWidgets(page));
}

function closeWidgets(request) {
  const {
    openWidgetList, page, closingWidgets,
  } = request;
  const widgetList = R.clone(closingWidgets);
  closingWidgets.forEach((widget) => {
    const selectedWidgetData = getSelectedWidget(widget, page);
    if (selectedWidgetData) { widgetList.push(selectedWidgetData.children); }
  });
  return R.without(widgetList, openWidgetList);
}

export {
  getWidgets,
  getSelectedWidget,
  getBookingWidget,
  closeWidgets,
};
