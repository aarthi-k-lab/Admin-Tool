/* eslint-disable jsx-a11y/interactive-supports-focus */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import * as React from 'react';
import * as R from 'ramda';
import './MilestoneTracker.css';
import PropTypes from 'prop-types';


class MilestoneTracker extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      selectedItem: -1,
    };
  }

  static getDerivedStateFromProps(props, state) {
    const { currentSelection } = props;
    const { selectedItem } = state;
    if (R.equals(selectedItem, -1)) {
      return {
        selectedItem: currentSelection,
      };
    }
    return null;
  }

  // Phase II
  // handleOnClick = index => () => {
  //   const { trackerItems } = this.props;
  //   if (R.prop('visited', trackerItems[index])) {
  //     this.setState({ selectedItem: index });
  //   }
  // };

  styleMap = (index) => {
    const { trackerItems } = this.props;
    const { selectedItem } = this.state;
    let style = '';
    const selected = selectedItem === index ? 'selected' : 'deselected';
    const visited = trackerItems[index].visited ? 'visited' : 'not-visited';
    // const clickable = R.prop('visited', trackerItems[index]) ? 'clickable' : '';
    if (index === 0) style = 'firstButton';
    else if (index === trackerItems.length - 1) style = 'lastButton';
    else style = 'button';
    return `baseButton ${style} ${selected}-${visited} `;
  };

  render() {
    const { trackerItems } = this.props;
    return (
      <div styleName="container">
        {trackerItems.map((item, index) => (
          <div
            key={item.title}
            color="secondary"
            // onClick={this.handleOnClick(index)}
            role="button"
            styleName={this.styleMap(index)}
            variant="outlined"
          >
            <p styleName="title">{item.title}</p>
          </div>
        ))}
      </div>
    );
  }
}

MilestoneTracker.defaultProps = {
  trackerItems: [],
};

MilestoneTracker.propTypes = {
  trackerItems: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string,
    visited: PropTypes.bool,
  })),
};

export default MilestoneTracker;
