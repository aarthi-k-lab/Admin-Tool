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
import DashboardModel from '../../models/Dashboard';

const {
  FEUW,
  BEUW,
  PROC,
  DOC_GEN,
  DOCS_IN, STAGER,
  LOAN_ACTIVITY,
  POSTMODSTAGER,
  UWSTAGER,
  SEARCH_LOAN,
  DOCGEN_GOBACK,
  MLSTN_PAGE,
  INVSET,
  BOOKING: BOOKING_GROUP,
} = DashboardModel;

const widgets = [
  {
    id: CUSTOM_COMM_LETTER,
    icon: <TrailButton />,
    component: <TrialLetter />,
    visibility: [LOAN_ACTIVITY],
    defaultOpen: true,
  },
  {
    id: COMMENTS,
    icon: <ChatIcon />,
    component: <CommentsWidget />,
    visibility: [
      FEUW, BEUW, PROC, DOC_GEN, DOCS_IN, STAGER, LOAN_ACTIVITY,
      BOOKING_GROUP, SEARCH_LOAN, DOCGEN_GOBACK,
      MLSTN_PAGE, POSTMODSTAGER, UWSTAGER, INVSET,
    ],
    overlay: true,
  },
  {
    id: ADDITIONAL_INFO,
    icon: <img alt="Additional Info" src="/static/img/information.png" />,
    visibility: [
      FEUW, BEUW, PROC, DOC_GEN, DOCS_IN, STAGER, LOAN_ACTIVITY,
      BOOKING_GROUP, SEARCH_LOAN, POSTMODSTAGER, UWSTAGER, INVSET,
    ],
    children: [COMMENTS],
  },
  {
    id: HISTORY,
    icon: <HistoryIcon />,
    visibility: [
      FEUW, BEUW, PROC, DOC_GEN, DOCS_IN,
      STAGER, LOAN_ACTIVITY, BOOKING_GROUP, POSTMODSTAGER, INVSET,
    ],
    children: [COMMENTS],
  },
  {
    id: BOOKING,
    icon: <img alt="BookingAutomation" src="/static/img/bookingWidget.svg" />,
    visibility: [
      DOCS_IN, BOOKING_GROUP,
    ],
    children: [COMMENTS],
  },
  {
    id: INCOME_CALCULATOR,
    icon: <Exposure />,
    visibility: [
      FEUW, BEUW, PROC, DOC_GEN, DOCS_IN, BOOKING_GROUP,
    ],
    children: [COMMENTS],
  },
  {
    id: FHLMC,
    icon: <img alt="FHLMC" src="/static/img/Freddie-Widget.svg" />,
    component: <FHLMCWidget />,
    visibility: [
      BEUW, DOC_GEN, POSTMODSTAGER, INVSET,
    ],
    overlay: true,
    children: [COMMENTS],
    dependency: FHLMC,
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
