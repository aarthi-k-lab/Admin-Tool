/* eslint-disable no-unused-vars */
/* eslint-disable react/no-array-index-key */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { operations } from 'ducks/tombstone';
import DashboardModel from '../../models/Dashboard';
import TabContent from './TabContent/TabContent';
import Item from './Item';
import Selector from '../../state/ducks/tombstone/selectors';
import styles from './Tombstone.css';

class Tombstone extends React.Component {
  constructor(props) {
    super(props);
    const { items } = props;
    const dummy = items;
    const array = [];
    this.state = {
      menuItem: dummy.slice(array.length, dummy.length),
      index: 0,
    };
    this.handleChange = this.handleChange.bind(this);
  }


  componentWillUnmount() {
    const { clearTombstoneData } = this.props;
    clearTombstoneData();
  }

  static getDerivedStateFromProps(props) {
    const { items } = props;
    return {
      menuItem: items,
    };
  }


  handleChange(_, idx) {
    const { index } = this.state;
    const { toggleTombstoneView } = this.props;
    if (index !== idx) {
      this.setState(
        { index: idx },
      );
      toggleTombstoneView();
    }
  }

  render() {
    const { menuItem, index } = this.state;
    const { group, disableIcons } = this.props;
    const width = group !== DashboardModel.SEARCH_LOAN ? '55%' : '100%';
    const indicatorColor = group !== DashboardModel.SEARCH_LOAN ? 'primary' : '';
    const tombstoneStyle = `${group === DashboardModel.SEARCH_LOAN ? 'search-loan' : 'loan-view'}`;
    return (
      <section className={styles.tombstone} id="container" styleName={group === DashboardModel.MILESTONE_ACTIVITY ? 'milestone-activity' : tombstoneStyle}>
        <Tabs
          indicatorColor={indicatorColor}
          onChange={this.handleChange}
          textColor="primary"
          value={index}
          variant="fullWidth"
        >
          <Tab
            label="LOAN INFO"
            style={{ minWidth: `${width}` }}
          />
          {group !== DashboardModel.SEARCH_LOAN
            ? (
              <Tab
                label="MOD INFO"
                style={{ minWidth: '50%' }}
              />
            ) : null}
        </Tabs>

        <TabContent index={0} value={index}>
          {Tombstone.getItems(menuItem, disableIcons)}
        </TabContent>
        {group !== DashboardModel.SEARCH_LOAN
          ? (
            <TabContent index={1} value={index}>
              {Tombstone.getItems(menuItem, disableIcons)}
            </TabContent>
          ) : null}
      </section>

    );
  }
}

Tombstone.defaultProps = {
  group: '',
  items: [
    {
      title: 'Loan #',
      content: '67845985',
    },
    {
      title: 'Investors',
      content: 'FHA',
    },
    {
      title: 'Title',
      content: 'Content',
    },
  ],
};

Tombstone.propTypes = {
  group: PropTypes.string,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      content: PropTypes.any.isRequired,
      title: PropTypes.string.isRequired,
    }).isRequired,
  ),
};


Tombstone.getItems = function getItems(items, disableIcons) {
  const screenWidth = window.innerWidth;
  const arrayLength = items.length;
  return items.map(({
    content, title, style, component,
  }) => (
    (
      <tr key={title} style={{ maxWidth: screenWidth / arrayLength, textAlign: 'left' }} styleName={content.style || 'itemTd'}>
        <Item
          key={title}
          Component={component}
          content={content.flag || content}
          disableIcons={disableIcons}
          style={style}
          title={title}
        />
      </tr>
    )
  ));
};

Tombstone.propTypes = {
  clearTombstoneData: PropTypes.func,
  disableIcons: PropTypes.bool,
  toggleTombstoneView: PropTypes.func,
};

Tombstone.defaultProps = {
  clearTombstoneData: () => { },
  toggleTombstoneView: () => { },
  disableIcons: false,
};

const mapStateToProps = state => ({
  items: Selector.getTombstoneData(state),
});

const mapDispatchToProps = dispatch => ({
  clearTombstoneData: operations.clearTombstoneDataOperation(dispatch),
  toggleTombstoneView: operations.toggleViewType(dispatch),
});

const TombstoneContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(Tombstone);

const TestHooks = {
  Tombstone,
};

export default TombstoneContainer;
export { TestHooks };
