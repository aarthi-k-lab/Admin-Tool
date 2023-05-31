/* eslint-disable max-len */
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import * as R from 'ramda';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { selectors as incomeCalcSelectors } from 'ducks/income-calculator';
import { selectors as widgetsSelectors } from 'ducks/widgets';
import { operations as docChecklistOperations, selectors as documentChecklistSelectors } from 'ducks/document-checklist';
import {
  selectors as dashboardSelectors,
} from 'ducks/dashboard';
import IconButton from '@material-ui/core/IconButton';
import { DOCUMENT_CHECKLIST } from '../../../constants/widgets';
import AddContributor from '../AddContributor/AddContirbutor';
import processBorrowerData from '../../../lib/CustomFunctions/BorrowerData/processBorrowerData';
import './DocChecklist.css';
import DocumentViewer from '../DocumentViewer/DocumentViewer';
import DocumentList from '../DocumentList/DocumentList';


function DocChecklist(props) {
  const {
    getborrowerData, setDocSelectedBorrorwer, errorFields, openWidgetList,
    isAssigned,
  } = props;
  const isDocWidgetOpen = R.contains(DOCUMENT_CHECKLIST, openWidgetList);
  const [tabIndex, setTabIndex] = useState(0);
  const [showAddContributorPopup, setShowAddContributorPopup] = useState(false);
  const displayList = processBorrowerData(getborrowerData);
  const errorBorrowerValue = errorFields.borrowerNames || [];
  const tabListWidth = isDocWidgetOpen ? '75rem' : '58rem';
  const isDocWidgetNotInProc = R.contains(DOCUMENT_CHECKLIST, openWidgetList);
  const disableStyle = (!isAssigned || isDocWidgetNotInProc) ? 'add-assumptor-disable' : '';


  const handleTabChange = (selectedIndex) => {
    setTabIndex(selectedIndex);
    const borrowerValue = R.propOr('', 'value', R.find(R.propEq('pstnNum',
      (selectedIndex + 1)))(displayList));
    setDocSelectedBorrorwer({ selectedBorrower: borrowerValue });
  };

  const handAddContributorClick = () => {
    setShowAddContributorPopup(true);
  };

  const handleCloseAddContributor = () => {
    setShowAddContributorPopup(false);
  };


  useEffect(() => {
    const borrowerValue = R.propOr('', 'value', R.find(R.propEq('pstnNum',
      (tabIndex + 1)))(displayList));
    setDocSelectedBorrorwer({ selectedBorrower: borrowerValue });
  }, []);


  return (
    <div>
      <Grid container direction="row">
        <Grid item xs={9}>
          <Grid container direction="column">
            <Grid item styleName="tabWidth">
              <Paper elevation={1} square styleName="borrowerBanner">
                <Tabs
                  inkBarStyle={{ background: '#596feb' }}
                  onChange={(_, selectedIndex) => handleTabChange(selectedIndex)}
                  scrollable="true"
                  style={{ width: `${tabListWidth}` }}
                  value={tabIndex}
                  variant="scrollable"
                >
                  {displayList && displayList.map(task => (
                    <Tab
                      key={R.propOr('', 'name', task)}
                      label={(
                        <div styleName="tabContainer">
                          <div>
                            {errorBorrowerValue.includes(task && R.propOr('', 'value', task)) ? <span styleName="dot" /> : null }
                          </div>
                          <div styleName="taballign">
                            <div styleName="borrNameDiv">
                              <Typography styleName="borrName" variant="subtitle1">
                                {task && R.propOr('', 'name', task)}
                              </Typography>
                              <Typography styleName="borrDesc" variant="subtitle2">
                                {task && R.propOr('', 'description', task)}
                              </Typography>
                            </div>
                          </div>
                        </div>

                )}
                      styleName="borrTab"
                    />
                  ))}
                </Tabs>
                {displayList.length > 0 && (
                <IconButton
                  onClick={handAddContributorClick}
                  styleName={`add-contributor-button ${disableStyle}`}
                >
                  <img alt="add-contributor" src="/static/img/person_add.svg" />
                </IconButton>
                )}
              </Paper>
            </Grid>
            <Grid item>
              <div styleName="docListContainer">
                <DocumentList />
              </div>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={3}>
          <DocumentViewer />
        </Grid>
        {showAddContributorPopup && <AddContributor onClose={handleCloseAddContributor} />}
      </Grid>

    </div>
  );
}

DocChecklist.defaultProps = {
  openWidgetList: [],
};


DocChecklist.propTypes = {
  errorFields: PropTypes.shape().isRequired,
  getborrowerData: PropTypes.shape().isRequired,
  isAssigned: PropTypes.bool.isRequired,
  openWidgetList: PropTypes.arrayOf(PropTypes.string),
  setDocSelectedBorrorwer: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  getborrowerData: incomeCalcSelectors.getBorrowers(state),
  errorFields: documentChecklistSelectors.getErrorFields(state),
  openWidgetList: widgetsSelectors.getOpenWidgetList(state),
  isAssigned: dashboardSelectors.isAssigned(state),
});

const mapDispatchToProps = dispatch => ({
  setDocSelectedBorrorwer: docChecklistOperations.setSelectedBorrowerOperation(dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(DocChecklist);
