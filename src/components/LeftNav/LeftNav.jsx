import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { links } from 'lib/RouteAccess';
import './LeftNav.css';

function LeftNav({ user }) {
  const groupList = user && user.groupList;
  return (
    <div styleName="stretch-column">
      <nav id="cmod_leftnav" styleName="left-nav-bar">
        {
        links.map(link => (
          groupList && groupList.some(r => link.groups.includes(r))
            ? (
              <Link to={link.path}>
                <img alt={link.name} src={link.img} />
              </Link>) : null
        ))
      }
      </nav>
    </div>
  );
}

LeftNav.propTypes = {
  user: PropTypes.shape({
    userDetails: PropTypes.shape({
      email: PropTypes.string,
      jobTitle: PropTypes.string,
      name: PropTypes.string,
    }),
    userGroups: PropTypes.array,
  }).isRequired,
};

export default LeftNav;
