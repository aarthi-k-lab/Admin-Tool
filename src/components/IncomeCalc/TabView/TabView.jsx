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

const getSubTask = (task, index = 0, level = 1) => {
  if (level === 0) return task;
  return getSubTask(task[index].subTasks, level - 1);
};

const DISPLAY_LENGTH = 4;
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
    const { additionalInfo, onChange } = this.props;
    const { valuePath } = additionalInfo;
    const value = R.propOr('', 'value', R.nth(selectedIndex, tabViewList));
    const targetValue = R.assocPath(valuePath, value, {});
    onChange(targetValue);
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

  render() {
    const {
      subTasks, additionalInfo: {
        valuePath,
      }, renderChildren, value,
      failureReason,
    } = this.props;
    const {
      anchorEl, displayList, dropDownList,
    } = this.state;
    const tabIndex = displayList && R.findIndex(R.propEq('value', R.pathOr(value, valuePath || [], value)))(displayList);
    return (
      <div styleName="tabview">
        <Paper elevation={1} square>
          <Tabs
            aria-label="scrollable auto tabs example"
            indicatorColor="primary"
            onChange={(e, selectedIndex) => this.onTabSelection(selectedIndex, displayList)}
            scrollButtons="auto"
            style={{ backgroundColor: 'white' }}
            textColor="primary"
            value={tabIndex === -1 ? null : tabIndex}
          >
            {displayList && displayList.map((task, index) => (
              <Tab
                key={R.propOr('', 'name', task)}
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
                    </div>
                    <div style={{ display: 'grid', textTransform: 'capitalize' }}>
                      <Typography style={{ fontWeight: '600' }} variant="subtitle1">
                        {task && R.propOr('', 'name', task)}
                      </Typography>
                      <Typography variant="subtitle2">
                        {task && R.propOr('', 'description', task)}
                      </Typography>
                    </div>
                  </div>
                )}
                style={{ width: '13.5rem' }}
              />
            ))}
            {!R.isEmpty(dropDownList) && (
              <Box>
                <Tab
                  label={(
                    <Box style={{ display: 'flex', fontWeight: 500 }}>
                    +
                      {dropDownList && dropDownList.length}
                      <Icon>expand_more</Icon>
                    </Box>
                )}
                  onClick={this.handlePopperClick}
                />
                <Popper
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  style={{ width: anchorEl ? anchorEl.clientWidth : null }}
                  transition
                >
                  <ClickAwayListener onClickAway={this.handleClickAway}>
                    <Paper style={{ width: '15rem', marginLeft: '-3.5rem' }}>
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
  },
  failureReason: [],
};

TabView.propTypes = {
  additionalInfo: PropTypes.shape({
    hasTitle: PropTypes.bool,
    styleName: PropTypes.string,
    valuePath: PropTypes.arrayOf(PropTypes.string),
  }),
  failureReason: PropTypes.arrayOf({
    level: PropTypes.number,
    message: PropTypes.string,
  }),
  onChange: PropTypes.func.isRequired,
  renderChildren: PropTypes.func.isRequired,
  subTasks: PropTypes.arrayOf(PropTypes.string).isRequired,
  value: PropTypes.string.isRequired,
};

export default TabView;