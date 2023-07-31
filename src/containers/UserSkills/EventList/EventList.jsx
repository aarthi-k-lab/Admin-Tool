import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import SectionHeader from 'containers/UserSkills/SectionHeader';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import './EventList.css';
import {
  selectors as userSkillsSelectors,
  operations as userSkillsOperations,
} from 'ducks/user-skills';

class EventList extends React.Component {
  constructor(props) {
    super(props);
    this.state = { selectedEvent: -1 };
    this.title = 'Events';
    this.eventListStyle = props.style;
    this.sectionHeaderStyle = { paddingTop: 15, paddingLeft: 15 };
  }

  componentDidMount() {
    const { fetchEvents } = this.props;
    fetchEvents();
  }

  onSelectEvent(eventInfo, index) {
    const {
      setSelectedEvent,
      loadSkills,
      loadUserSkills,
      setAddSkillBtn,
      setClearSaveBtn,
      selectedUser,
    } = this.props;

    if (selectedUser !== null && Object.keys(selectedUser).length !== 0) {
      this.setState({ selectedEvent: index });

      setSelectedEvent(eventInfo);

      loadSkills();

      loadUserSkills();

      setAddSkillBtn(true);
      setClearSaveBtn(false);
    }
  }

  render() {
    const { events } = this.props;
    const { selectedEvent } = this.state;

    return (
      <div style={this.eventListStyle}>
        <SectionHeader style={this.sectionHeaderStyle} title={this.title} />

        <List component="nav">
          {
            events.length > 0 && events.map((value, index) => (
              <ListItem
                key={value.eventName}
                button
                onClick={() => { this.onSelectEvent(value, index); }}
                selected={selectedEvent === index}
                styleName="list-item"
              >
                <ListItemText primary={value.eventName} />
              </ListItem>
            ))
          }
        </List>
      </div>
    );
  }
}

EventList.defaultProps = {
  events: [],
  selectedUser: {},
  style: {},
};

EventList.propTypes = {
  events: PropTypes.arrayOf(
    PropTypes.shape({
      eventName: PropTypes.string.isRequired,
    }),
  ),
  fetchEvents: PropTypes.func.isRequired,
  loadSkills: PropTypes.func.isRequired,
  loadUserSkills: PropTypes.func.isRequired,
  selectedUser: PropTypes.shape({
    emailAddr: PropTypes.string.isRequired,
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    managerEmailAddr: PropTypes.string.isRequired,
    userId: PropTypes.string,
  }),
  setAddSkillBtn: PropTypes.func.isRequired,
  setClearSaveBtn: PropTypes.func.isRequired,
  setSelectedEvent: PropTypes.func.isRequired,
  style: PropTypes.shape({

  }),
};

const mapStateToProps = state => ({
  events: userSkillsSelectors.getEvents(state),
  selectedUser: userSkillsSelectors.getSelectedUser(state),
});


const mapDispatchToProps = dispatch => ({
  fetchEvents: userSkillsOperations.fetchEventsOperation(dispatch),
  setSelectedEvent: userSkillsOperations.setSelectedEventOperation(dispatch),
  loadSkills: userSkillsOperations.fetchSkillsOperation(dispatch),
  loadUserSkills: userSkillsOperations.fetchUserSkillsOperation(dispatch),
  setAddSkillBtn: userSkillsOperations.setAddSkillBtnOperation(dispatch),
  setClearSaveBtn: userSkillsOperations.setClearSaveBtnOperation(dispatch),
});


export default connect(mapStateToProps, mapDispatchToProps)(EventList);
