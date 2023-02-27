import React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import * as R from 'ramda';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import './TabView.css';
import Box from '@material-ui/core/Box';
import Popper from '@material-ui/core/Popper';
import MenuItem from '@material-ui/core/MenuItem';
import Icon from '@material-ui/core/Icon';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import TabScrollButton from '@material-ui/core/TabScrollButton';
import { withStyles } from '@material-ui/core/styles';
import { getStyleName } from 'constants/incomeCalc/styleName';
import { connect } from 'react-redux';
import { selectors as documentChecklistSelectors } from '../../../state/ducks/document-checklist';
import { operations as incomeCalcOperations } from '../../../state/ducks/income-calculator';

const tabScrollButton = withStyles(() => ({
  root: {
    width: 25,
    overflow: 'hidden',
    transition: 'width 0.5s',
    '&.Mui-disabled': {
      width: 0,
    },
  },
}))(TabScrollButton);


const DISPLAY_LENGTH = 5;
class TabView extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      tabList: [],
      dropDownList: [],
      displayList: [],
      anchorEl: null,
    };
  }

  static getDerivedStateFromProps(props, state) {
    const { tabList } = state;
    const { tabViewList, value, additionalInfo } = props;
    const { valuePath } = additionalInfo;
    const tabIndex = tabList && R.findIndex(R.propEq('value', R.pathOr(value, valuePath || [], value)))(tabList);

    if (R.isEmpty(tabList) || R.isNil(tabList)) {
      return {
        tabList: tabViewList,
        dropDownList: tabViewList && tabViewList.slice(DISPLAY_LENGTH, tabViewList.length),
        displayList: tabViewList && tabViewList.slice(0, DISPLAY_LENGTH),
      };
    } if (DISPLAY_LENGTH <= tabIndex) {
      const tabData = JSON.parse(JSON.stringify(tabList));
      [tabData[DISPLAY_LENGTH - 1], tabData[tabIndex]] = [tabData[tabIndex],
        tabData[DISPLAY_LENGTH - 1]];
      return {
        tabList: tabData,
        dropDownList: tabData && tabData.slice(DISPLAY_LENGTH, tabData.length),
        displayList: tabData && tabData.slice(0, DISPLAY_LENGTH),
      };
    }
    return null;
  }

  onTabSelection = (selectedIndex, tabViewList) => {
    const { additionalInfo, onChange, setSelectedBorrorwer } = this.props;
    const { valuePath } = additionalInfo;
    const value = R.propOr('', 'value', R.nth(selectedIndex, tabViewList));
    const targetValue = R.assocPath(valuePath, value, {});
    onChange(targetValue);
    setSelectedBorrorwer(targetValue);
  }

  handlePopperClick = (event) => {
    const { anchorEl } = this.state;
    this.setState({ anchorEl: anchorEl ? null : event.currentTarget });
  }

  handleClickAway = () => {
    this.setState({ anchorEl: null });
  }

  onMenuItemClick = index => () => {
    const { tabList } = this.state;
    this.onTabSelection(index, tabList);
    this.setState({ anchorEl: null });
  }

  onDisabled = (index) => {
    const disabled = index !== 0;
    return disabled;
  }

  render() {
    const {
      subTasks, additionalInfo: {
        valuePath, isDisabled, styleName,
      }, renderChildren, value,
      failureReason,
      errorFields,
    } = this.props;
    const {
      anchorEl, displayList, dropDownList,
    } = this.state;
    const tabIndex = displayList && R.findIndex(R.propEq('value', R.pathOr(value, valuePath || [], value)))(displayList);
    const borrowerValue = errorFields.borrowerNames || [];
    return (
      <div styleName={getStyleName('tabStyle', styleName, 'tabs')}>
        <Paper elevation={1} square styleName="borrowerBanner">
          <Tabs
            inkBarStyle={{ background: '#596feb' }}
            onChange={(_, selectedIndex) => this.onTabSelection(selectedIndex, displayList)}
            scrollable="true"
            ScrollButtonComponent={tabScrollButton}
            value={tabIndex === -1 ? null : tabIndex}
            variant="scrollable"
          >
            {displayList && displayList.map((task, index) => (
              <Tab
                key={R.propOr('', 'name', task)}
                disabled={isDisabled ? this.onDisabled(index) : false}
                label={(
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    width: '100%',
                    justifyContent: 'space-evenly',
                  }}
                  >
                    <div>
                      {R.prop(1, R.nth(index, failureReason)) ? <span styleName="dot" /> : null }
                      {R.prop(2, R.nth(index, failureReason)) ? <span styleName="dot1" /> : null }
                      {borrowerValue.includes(task && R.propOr('', 'value', task)) ? <span styleName="dot" /> : null }
                    </div>
                    <div style={{ display: 'grid', textTransform: 'capitalize' }}>
                      <Typography style={{ fontWeight: '700', color: '#4e586e' }} variant="subtitle1">
                        {task && R.propOr('', 'name', task)}
                      </Typography>
                      <Typography style={{ color: '#939299' }} variant="subtitle2">
                        {task && R.propOr('', 'description', task)}
                      </Typography>
                    </div>
                  </div>
                )}
                style={{ width: '12.75rem' }}
              />
            ))}
            {!R.isEmpty(dropDownList) && (
              <Box style={{ marginLeft: '0rem' }}>
                <Tab
                  label={(
                    <Box style={{ display: 'flex', fontWeight: 500, marginLeft: '6rem' }}>
                      +
                      {dropDownList && dropDownList.length}
                      <Icon>expand_more</Icon>
                    </Box>
                  )}
                  onClick={this.handlePopperClick}
                  style={{ width: '2rem' }}
                />
                <Popper
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  style={{ width: anchorEl ? anchorEl.clientWidth : null }}
                  transition
                >
                  <ClickAwayListener onClickAway={this.handleClickAway}>
                    <Paper>
                      {dropDownList && dropDownList.map((item, index) => (
                        <MenuItem
                          key={item.name}
                          onClick={this.onMenuItemClick(DISPLAY_LENGTH + index)}
                          value={item}
                        >
                          <div style={{ display: 'grid', textTransform: 'capitalize' }}>
                            <Typography style={{ fontWeight: '600' }} variant="subtitle1">
                              {R.toLower(R.propOr('', 'name', item))}
                            </Typography>
                            <Typography variant="subtitle2">
                              {R.toLower(R.propOr('', 'description', item))}
                            </Typography>
                          </div>
                        </MenuItem>
                      ))}
                    </Paper>
                  </ClickAwayListener>
                </Popper>
              </Box>
            )}
          </Tabs>
        </Paper>
        {renderChildren(subTasks)}
      </div>
    );
  }
}


TabView.defaultProps = {
  additionalInfo: {
    hasTitle: false,
    styleName: '',
    valuePath: [],
    isDisabled: false,
  },
  failureReason: [],
};

TabView.propTypes = {
  additionalInfo: PropTypes.shape({
    hasTitle: PropTypes.bool,
    isDisabled: PropTypes.bool,
    styleName: PropTypes.string,
    valuePath: PropTypes.arrayOf(PropTypes.string),
  }),
  errorFields: PropTypes.shape().isRequired,
  failureReason: PropTypes.arrayOf({
    level: PropTypes.number,
    message: PropTypes.string,
  }),
  onChange: PropTypes.func.isRequired,
  renderChildren: PropTypes.func.isRequired,
  setSelectedBorrorwer: PropTypes.func.isRequired,
  subTasks: PropTypes.arrayOf(PropTypes.string).isRequired,
  value: PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
  errorFields: documentChecklistSelectors.getErrorFields(state),
});

const mapDispatchToProps = dispatch => ({
  setSelectedBorrorwer: incomeCalcOperations.setSelectedBorrower(dispatch),
});
export default connect(mapStateToProps, mapDispatchToProps)(TabView);
