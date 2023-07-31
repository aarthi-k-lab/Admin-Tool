import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import SectionHeader from 'containers/UserSkills/SectionHeader';
import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField';
import SearchIcon from '@material-ui/icons/Search';
import IconButton from '@material-ui/core/IconButton';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import * as R from 'ramda';
import './UserList.css';
import {
  selectors as userSkillsSelectors,
  operations as userSkillsOperations,
} from 'ducks/user-skills';

class UserList extends React.Component {
  constructor(props) {
    super(props);
    this.state = { userSearchText: '', selectedUser: -1 };
    this.title = 'Users';
    this.userListStyle = props.style;
    this.sectionHeaderStyle = { paddingTop: 15, paddingLeft: 15 };
  }

  componentDidMount() {
    const { fetchUsers } = this.props;

    fetchUsers();
  }

  onSelectUser(userInfo) {
    this.setState({ selectedUser: userInfo.emailAddr });

    const {
      setSelectedUser,
      loadUserSkills,
      selectedEvent,
      setAddSkillBtn,
      setClearSaveBtn,
    } = this.props;

    setSelectedUser(userInfo);

    if (Object.keys(selectedEvent).length !== 0) {
      loadUserSkills();
    }

    setAddSkillBtn(true);
    setClearSaveBtn(false);
  }

  render() {
    const { users } = this.props;
    const { userSearchText, selectedUser } = this.state;

    return (
      <div style={this.userListStyle}>
        <SectionHeader style={this.sectionHeaderStyle} title={this.title} />

        <TextField
          InputProps={{
            disableUnderline: true,
            startAdornment: (
              <InputAdornment position="start">
                <IconButton aria-label="search" size="small" styleName="search-icon" type="button">
                  <SearchIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
          onChange={(e) => { this.setState({ userSearchText: e.target.value }); }}
          onKeyPress={() => {}}
          placeholder="Search user..."
          styleName="searchStyle"
          value={userSearchText}
          varirant="filled"
        />

        <Divider styleName="divider" />

        <List component="nav">
          {
            users.length > 0 && users.map(value => (
              <ListItem
                key={value.emailAddr}
                button
                divider
                onClick={() => { this.onSelectUser(value); }}
                selected={selectedUser === value.emailAddr}
                style={{
                  display: R.pathOr('', ['first'], value).toLowerCase().search(userSearchText.toLowerCase()) !== -1
                  || R.pathOr('', ['lastName'], value).toLowerCase().search(userSearchText.toLowerCase()) !== -1 ? '' : 'none',
                }}
              >
                <ListItemText
                  primary={`${value.firstName} ${value.lastName}`}
                  secondary={
                    <React.Fragment>{value.emailAddr}</React.Fragment>
                  }
                />
              </ListItem>
            ))
          }
        </List>
      </div>
    );
  }
}

UserList.defaultProps = {
  selectedEvent: {},
  style: {},
  users: [],
};

UserList.propTypes = {
  fetchUsers: PropTypes.func.isRequired,
  loadUserSkills: PropTypes.func.isRequired,
  selectedEvent: PropTypes.shape({
    eventName: PropTypes.string,
  }),
  setAddSkillBtn: PropTypes.func.isRequired,
  setClearSaveBtn: PropTypes.func.isRequired,
  setSelectedUser: PropTypes.func.isRequired,
  style: PropTypes.shape({

  }),
  users: PropTypes.arrayOf(
    PropTypes.shape({
      emailAddr: PropTypes.string.isRequired,
      firstName: PropTypes.string.isRequired,
      lastName: PropTypes.string.isRequired,
      managerEmailAddr: PropTypes.string.isRequired,
      userId: PropTypes.string,
    }),
  ),
};

const mapStateToProps = state => ({
  users: userSkillsSelectors.getUsers(state),
  selectedEvent: userSkillsSelectors.getSelectedEvent(state),
});


const mapDispatchToProps = dispatch => ({
  fetchUsers: userSkillsOperations.fetchUsersOperation(dispatch),
  setSelectedUser: userSkillsOperations.setSelectedUserOperation(dispatch),
  loadUserSkills: userSkillsOperations.fetchUserSkillsOperation(dispatch),
  setAddSkillBtn: userSkillsOperations.setAddSkillBtnOperation(dispatch),
  setClearSaveBtn: userSkillsOperations.setClearSaveBtnOperation(dispatch),
});


export default connect(mapStateToProps, mapDispatchToProps)(UserList);
