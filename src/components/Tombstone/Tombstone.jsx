import React from 'react';
import PropTypes from 'prop-types';
import IconButton from '@material-ui/core/IconButton';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import MoreIcon from '@material-ui/icons/MoreHoriz';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
// import * as R from 'ramda';
import { connect } from 'react-redux';
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
      anchorEl: null,
      menuItem: dummy.slice(array.length, dummy.length),
      tombStoneArray: array,
    };
    this.onWindowResize = this.onWindowResize.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.onLoadResize = this.onLoadResize.bind(this);
  }

  componentDidMount() {
    window.addEventListener('resize', this.onWindowResize.bind(this));
    this.onLoadResize();
  }

  /**
   * Remove event listener
   */
  componentWillUnmount() {
    window.removeEventListener('resize', this.onWindowResize.bind(this));
  }

  onLoadResize() {
    console.log('loadSize-->');
    const { items } = this.props;
    let { tombStoneArray } = this.state;
    const dummy = items;
    const screenWidth = window.innerWidth;
    if (screenWidth < 500) tombStoneArray = items.slice(0, 4);
    else if (screenWidth >= 501 && screenWidth <= 599) tombStoneArray = items.slice(0, 5);
    else if (screenWidth >= 600 && screenWidth <= 750) tombStoneArray = items.slice(0, 6);
    else if (screenWidth >= 751 && screenWidth <= 900) tombStoneArray = items.slice(0, 8);
    else if (screenWidth > 901) tombStoneArray = items;
    this.setState({ tombStoneArray, menuItem: dummy.slice(tombStoneArray.length, dummy.length) });
  }

  onWindowResize() {
    // const { items } = this.props;
    // const dummy = items;
    // let array = [];
    // const screenWidth = window.innerWidth;
    // console.log('sizee ->', screenWidth);
    // if (screenWidth < 500) array = items.slice(0, 4);
    // else if (screenWidth >= 501 && screenWidth <= 599) array = items.slice(0, 5);
    // else if (screenWidth >= 600 && screenWidth <= 750) array = items.slice(0, 6);
    // else if (screenWidth >= 751 && screenWidth <= 900) array = items.slice(0, 8);
    // else if (screenWidth > 901) array = items;
    // this.setState({ tombStoneArray: array, menuItem: dummy.slice(array.length, dummy.length) });
    this.onLoadResize();
  }

  handleClose() {
    this.setState({ anchorEl: null });
  }

  handleClick(event) {
    const { items } = this.props;
    const { tombStoneArray } = this.state;
    this.setState({
      anchorEl: event.currentTarget,
      menuItem: items.slice(tombStoneArray.length, items.length),
    });
  }

  render() {
    const { onOpenWindow } = this.props;
    const { tombStoneArray, anchorEl, menuItem } = this.state;
    const open = Boolean(anchorEl);
    console.log('tombStoneArray render', tombStoneArray);
    return (
      <section id="container" styleName="tombstone">
        {Tombstone.getItems(tombStoneArray)}
        <div styleName="more-icon-button">
          <IconButton onClick={this.handleClick}>
            <MoreIcon styleName="more-icon" />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            classes={{
              paper: styles.menuItemRoot,
            }}
            id="long-menu"
            onClose={this.handleClose}
            open={open}
            PaperProps={{
              style: {
                maxHeight: menuItem.length * 500,
                width: 300,
                right: 0,
              },
            }}
          >
            {menuItem.map(option => (
              <MenuItem>
                <div>
                  {option.title}
                  <br />
                  <span style={{ fontWeight: 'bold', fontSize: '10px' }}>{option.content}</span>
                </div>
              </MenuItem>
            ))}
          </Menu>
        </div>
        <div styleName="spacer" />
        <IconButton onClick={onOpenWindow}>
          <OpenInNewIcon styleName="icon" />
        </IconButton>
      </section>
    );
  }
}

Tombstone.defaultProps = {
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
  onOpenWindow: () => { },
};

Tombstone.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      content: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
    }).isRequired,
  ),
  onOpenWindow: PropTypes.func,
};


Tombstone.getItems = function getItems(items) {
  return items.map(({ content, title }) => (
    <Item key={title} content={content} title={title} />
  ));
};

// function mapStateToProps(state) {
//   return {
//     items: R.pathOr(false, ['tombstone', 'data'], state),
//   };
// }
const mapStateToProps = state => ({
  items: Selector.getTombstoneData(state),
});
const TombstoneContainer = connect(
  mapStateToProps,
  null,
)(Tombstone);

// export default connect(mapStateToProps, null)(Tombstone);
export default TombstoneContainer;
