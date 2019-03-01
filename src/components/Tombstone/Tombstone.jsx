import React from 'react';
import PropTypes from 'prop-types';
import IconButton from '@material-ui/core/IconButton';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import MoreIcon from '@material-ui/icons/MoreHoriz';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
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
    this.handleClose = this.handleClose.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.resize = this.resize.bind(this);
  }

  componentDidMount() {
    window.addEventListener('resize', this.resize.bind(this));
    this.resize();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resize.bind(this));
  }

  resize() {
    const { items } = this.props;
    let { tombStoneArray } = this.state;
    const dummy = items;
    const screenWidth = window.innerWidth;
    if (screenWidth < 300) tombStoneArray = items.slice(0, 2);
    else if (screenWidth < 400) tombStoneArray = items.slice(0, 3);
    else if (screenWidth < 500) tombStoneArray = items.slice(0, 4);
    else if (screenWidth < 600) tombStoneArray = items.slice(0, 4);
    else if (screenWidth < 700) tombStoneArray = items.slice(0, 5);
    else if (screenWidth < 800) tombStoneArray = items.slice(0, 5);
    else if (screenWidth < 900) tombStoneArray = items.slice(0, 6);
    else if (screenWidth < 1000) tombStoneArray = items.slice(0, 7);
    else if (screenWidth < 1100) tombStoneArray = items.slice(0, 8);
    else if (screenWidth > 1100) tombStoneArray = items.slice(0, 9);
    this.setState({ tombStoneArray, menuItem: dummy.slice(tombStoneArray.length, dummy.length) });
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
    let menuDiv = <div />;
    if (menuItem.length > 0) {
      menuDiv = (
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
              <MenuItem styleName="menuItem">
                <div>
                  {option.title}
                  <br />
                  <span styleName="menuItemContent">
                    {option.content}
                  </span>
                </div>
              </MenuItem>
            ))}
          </Menu>
        </div>
      );
    }

    const tableWidth = tombStoneArray.length > 2 ? '100%' : '20%';
    return (
      <section id="container" styleName="tombstone">
        <table styleName="tombstone-table" width={tableWidth}>
          <tr>
            {Tombstone.getItems(tombStoneArray)}
            <td>{menuDiv}</td>
            <td>
              <div styleName="spacer" />
              <IconButton onClick={onOpenWindow}>
                <OpenInNewIcon styleName="icon" />
              </IconButton>
            </td>
          </tr>
        </table>
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
    <td styleName="itemTd">
      <Item key={title} content={content} title={title} />
    </td>
  ));
};

const mapStateToProps = state => ({
  items: Selector.getTombstoneData(state),
});
const TombstoneContainer = connect(
  mapStateToProps,
  null,
)(Tombstone);

const TestHooks = {
  Tombstone,
};

export default TombstoneContainer;
export { TestHooks };
