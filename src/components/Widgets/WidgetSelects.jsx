import React from 'react';
import TrailButton from '@material-ui/icons/Email';
import * as R from 'ramda';
import {
  COMMENTS,
  ADDITIONAL_INFO,
  HISTORY,
  CUSTOM_COMM_LETTER,
  BOOKING,
  FINANCIAL_CALCULATOR,
  FHLMC,
  DOCUMENT_CHECKLIST,
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
  SECONDLOOK,
  BOOKING: BOOKING_GROUP,
} = DashboardModel;

const widgets = [
  {
    id: CUSTOM_COMM_LETTER,
    icon: <TrailButton style={{ color: '#4E586E' }} />,
    component: <TrialLetter />,
    visibility: [LOAN_ACTIVITY],
  },
  {
    id: COMMENTS,
    icon: <img alt="Comment" src="/static/img/comment.png" />,
    component: <CommentsWidget />,
    visibility: [
      FEUW, BEUW, PROC, DOC_GEN, DOCS_IN, STAGER, LOAN_ACTIVITY,
      BOOKING_GROUP, SEARCH_LOAN, DOCGEN_GOBACK,
      MLSTN_PAGE, POSTMODSTAGER, UWSTAGER, INVSET, SECONDLOOK,
    ],
    overlay: true,
  },
  {
    id: ADDITIONAL_INFO,
    icon: <img alt="Additional Info" src="/static/img/information.png" />,
    visibility: [
      FEUW, BEUW, PROC, DOC_GEN, DOCS_IN, STAGER, LOAN_ACTIVITY,
      BOOKING_GROUP, SEARCH_LOAN, POSTMODSTAGER, UWSTAGER, INVSET, SECONDLOOK,
    ],
    children: [COMMENTS],
  },
  {
    id: HISTORY,
    icon: <img alt="History" src="/static/img/history.png" />,
    visibility: [
      FEUW, BEUW, PROC, DOC_GEN, DOCS_IN,
      STAGER, LOAN_ACTIVITY, BOOKING_GROUP, POSTMODSTAGER, INVSET, SECONDLOOK,
    ],
    children: [COMMENTS],
  },
  {
    id: BOOKING,
    icon: <img alt="BookingAutomation" src="/static/img/bookingWidget.svg" />,
    visibility: [
      DOCS_IN,
    ],
    children: [COMMENTS],
  },
  {
    id: FINANCIAL_CALCULATOR,
    icon: <img alt="Income Calculator" src="/static/img/incomecalculator.png" />,
    visibility: [
      FEUW, BEUW, PROC, DOC_GEN, DOCS_IN, BOOKING_GROUP,
    ],
    children: [COMMENTS],
  },
  {
    id: FHLMC,
    icon: <img alt="FHLMC" src="/static/img/Freddie_Widget.png" style={{ width: '23px' }} />,
    component: <FHLMCWidget />,
    visibility: [
      BEUW, DOC_GEN, INVSET,
    ],
    overlay: true,
    children: [COMMENTS],
    dependency: FHLMC,
  },
  {
    id: DOCUMENT_CHECKLIST,
    icon: <img alt="DOC CHECKLIST" src="/static/img/docchecklistwidget.png" style={{ width: '40px' }} />,
    visibility: [BEUW, FEUW, PROC],
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
