import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import ContentHeader from 'components/ContentHeader';
import {
  operations as userSkillsOperations,
} from 'ducks/user-skills';

import UserList from './UserList/UserList';
import EventList from './EventList/EventList';
import UserSkillList from './UserSkillList/UserSkillList';
import './UserSkills.css';

class UserSkills extends React.Component {
  constructor(props) {
    super(props);
    this.title = 'Assignment Rules';
    this.userListStyle = {
      width: '22%',
      float: 'left',
      backgroundColor: 'white',
      height: '95%',
      border: '1px solid #F5F4F3',
      borderRadius: '5px',
      overflowY: 'scroll',
    };
    this.eventListStyle = {
      width: '10%',
      float: 'left',
      backgroundColor: 'white',
      height: '95%',
      border: '1px solid #F5F4F3',
      borderRadius: '5px',
    };
    this.userSkillListStyle = {
      width: '68%',
      float: 'right',
      backgroundColor: 'white',
      height: '95%',
      border: '1px solid #F5F4F3',
      borderRadius: '5px',
    };
  }

  componentWillUnmount() {
    const { clearInfo } = this.props;

    clearInfo();
  }

  render() {
    return (
      <>
        <ContentHeader title={this.title} />

        <div styleName="container">
          <UserList style={this.userListStyle} />
          <EventList style={this.eventListStyle} />
          <UserSkillList style={this.userSkillListStyle} />
        </div>
      </>
    );
  }
}

UserSkills.propTypes = {
  clearInfo: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  state,
});

const mapDispatchToProps = dispatch => ({
  clearInfo: userSkillsOperations.clearInfoOperation(dispatch),
});


export default connect(mapStateToProps, mapDispatchToProps)(withRouter(UserSkills));
