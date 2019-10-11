import React from 'react';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import './Profile.css';
import PropTypes from 'prop-types';
import * as R from 'ramda';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import FormGroup from '@material-ui/core/FormGroup';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import { userGroupList, disableGroups } from '../../../models/AppGroupName';
import Auth from '../../../lib/Auth';

const BETA = 'BETA';
const AGENT = 'Agent';
const ALL_ACCESS = 'allaccess';
const MANAGER = 'Manager';

class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isChecked: {},
      role: null,
    };
  }

  static getDerivedStateFromProps(props, state) {
    const { userGroups, setRoleCallBack } = props;
    if (R.isNil(state.role)) {
      let isAgent = false;
      userGroupList.forEach((group) => {
        if (userGroups
        && !R.equals(group, 'BETA')
        && !R.equals(R.findIndex(R.propEq('groupName', group.toLowerCase()))(userGroups), -1)) {
          isAgent = true;
        }
      });
      const role = isAgent ? AGENT : MANAGER;
      setRoleCallBack(role);
    }
    if (R.isNil(state.role) || !R.equals(props.userRole, state.role)) {
      let isChecked = [];
      userGroupList.forEach((group) => {
        isChecked = disableGroups(props.userRole, props.groups, group)
          ? R.assoc(group, false, isChecked)
          : R.assoc(group, true, isChecked);
      });
      return {
        role: props.userRole,
        isChecked,
      };
    }
    return null;
  }

  renderSkills = (skillList) => {
    let skills = [];
    const skillsListWithMap = {};
    Object.keys(skillList).forEach((group) => {
      skillsListWithMap[group] = {};
      skillList[group].map((eachSkill) => {
        const result = {};
        const [skill, desc] = eachSkill.split('::');
        result[skill] = desc;
        skillsListWithMap[group][skill] = desc;
        return result;
      });
    });
    Object.keys(skillList).forEach((group) => {
      const tempSkills = skillList[group].reduce((result, val) => {
        const [skill, description] = val.split('::');
        return {
          ...result,
          [`${group}-${skill}`]: description,
        };
      }, {});

      const sortedSkills = !R.isNil(tempSkills) && !R.isEmpty(tempSkills)
        ? Object.keys(tempSkills).sort((skill1, skill2) => {
          const skillNo1 = skill1.replace(/\s/g, '').match(/Skill(.*)/);
          const skillNo2 = skill2.replace(/\s/g, '').match(/Skill(.*)/);
          return parseInt(skillNo1[1], 10) - parseInt(skillNo2[1], 10);
        }) : [];
      skills = skills.concat(sortedSkills);
    });

    let start = 0;
    let style = '';
    return skills.map((skill) => {
      const [skillValue, descValue] = skill.split('-');
      if (skillValue === 'BEUW' && start !== 1) {
        start += 1;
        style = 'separater';
      } else {
        style = '';
      }
      return (
        <li key={skill} styleName={style}>
          <Typography variant="body2">
            {`${skill} - ${skillsListWithMap[skillValue][descValue]}`}
          </Typography>
        </li>
      );
    });
  };


  handleCheckBoxChange = name => (event) => {
    const { isChecked } = this.state;
    this.setState({ isChecked: { ...isChecked, [name]: event.target.checked } });
  };

  handleRadioChange = (event) => {
    const { setRoleCallBack } = this.props;
    setRoleCallBack(event.target.value);
  }

  handleSetGroups = (email) => {
    const { userGroups } = this.props;
    const { role, isChecked } = this.state;
    const groups = [];
    R.mapObjIndexed((value, key) => {
      if (R.equals(key, BETA) && !value) {
        groups.push(key.toLowerCase());
      }
      if (!R.equals(key, BETA)) {
        groups.push(`${key.toLowerCase()}${R.equals(role, AGENT) ? '-mgr' : ''}`);
        if (!value) {
          groups.push(`${key.toLowerCase()}${R.equals(role, AGENT) ? '' : '-mgr'}`);
        }
      }
    }, isChecked);
    groups.push(ALL_ACCESS);
    groups.forEach((group) => {
      const index = R.findIndex(R.propEq('groupName', group))(userGroups);
      if (!R.equals(index, -1)) {
        userGroups.splice(index, 1);
      }
    });
    Auth.updateUserGroups(email, userGroups);
  }

  handleResetGroups = (userPrincipalName) => {
    Auth.getUserGroups(userPrincipalName, true);
  }

  renderRoleAndGroups(groups) {
    const { isChecked, role } = this.state;

    return (
      <>
        <div styleName="row">
          <Typography styleName="field-title" variant="body2">Role: </Typography>
          <FormControl component="fieldset">
            <RadioGroup aria-label="role" name="role" onChange={this.handleRadioChange} styleName="radioGroup" value={role}>
              <FormControlLabel control={<Radio />} label="Manager" value="Manager" />
              <FormControlLabel control={<Radio />} label="Agent" value="Agent" />
            </RadioGroup>
          </FormControl>
        </div>
        <div styleName="row">
          <Typography styleName="field-title" variant="body2">Beta features: </Typography>
          <ol styleName="group-list">
            <FormControl component="fieldset">
              <FormControlLabel
                control={(
                  <Checkbox
                    checked={isChecked.BETA}
                    disabled={disableGroups(role, groups, BETA)}
                    onChange={this.handleCheckBoxChange(BETA)}
                    value={BETA}
                  />
                      )}
                label={BETA}
              />
            </FormControl>
          </ol>
        </div>
        <div styleName="row">
          <Typography styleName="field-title" variant="body2">Groups: </Typography>
          <ol styleName="group-list">
            <FormControl component="fieldset">
              <FormLabel component="legend">Assign responsibility</FormLabel>
              <FormGroup>
                {R.map(group => (
                  R.equals(group, BETA) ? null : (
                    <FormControlLabel
                      key={group}
                      control={(
                        <Checkbox
                          checked={isChecked[group]}
                          disabled={disableGroups(role, groups, group)}
                          onChange={this.handleCheckBoxChange(group)}
                          value={group}
                        />
                      )}
                      label={group}
                    />
                  )
                ), userGroupList)}
              </FormGroup>
            </FormControl>
          </ol>
        </div>
      </>
    );
  }

  renderGroups = groups => (
    <div styleName="row">
      <Typography styleName="field-title" variant="body2">Groups: </Typography>
      <ol styleName="group-list">
        {
          groups.map(
            group => (
              <li key={group}>
                <Typography variant="body2">{group}</Typography>
              </li>
            ),
          )}
      </ol>
    </div>
  );

  render() {
    const {
      userDetails, skills, groups, featureToggle,
    } = this.props;
    const getEmail = R.propOr('', 'email');
    const getName = R.propOr('', 'name');

    const email = getEmail(userDetails);
    const name = getName(userDetails);
    return (
      <Paper elevation={2} styleName="container" tabIndex={-1}>
        <div styleName="row">
          <Typography variant="h6">User Profile</Typography>
          <div styleName="buttons" variant="body2">
            <Button onClick={() => this.handleSetGroups(email)} variant="contained">
            Apply
            </Button>
            <div styleName="resetButton">
              <Button onClick={() => this.handleResetGroups(email)} variant="contained">
            Reset
              </Button>
            </div>
          </div>
        </div>
        { featureToggle ? this.renderRoleAndGroups(groups) : this.renderGroups(groups)}
        <div styleName="row">
          <Typography styleName="field-title" variant="body2">Name: </Typography>
          <Typography variant="body2">{name}</Typography>
        </div>
        <div styleName="row">
          <Typography styleName="field-title" variant="body2">Email: </Typography>
          <Typography variant="body2">{email}</Typography>
        </div>
        <div styleName="row">
          <Typography styleName="field-title" variant="body2">Skills: </Typography>
          <div styleName="skills">
            <ol styleName="group-list">
              {this.renderSkills(skills)}
            </ol>
          </div>
        </div>
      </Paper>
    );
  }
}

Profile.defaultProps = {
  groups: [],
  skills: {},
  userDetails: {},
  userGroups: [],
  featureToggle: false,
};


Profile.propTypes = {
  featureToggle: PropTypes.bool,
  groups: PropTypes.arrayOf(PropTypes.string),
  setRoleCallBack: PropTypes.func.isRequired,
  skills: PropTypes.objectOf(PropTypes.array),
  userDetails: PropTypes.shape({
    email: PropTypes.string,
    name: PropTypes.string,
  }),
  userGroups: PropTypes.arrayOf(PropTypes.shape({
    groupName: PropTypes.string,
  })),
};


export default Profile;
