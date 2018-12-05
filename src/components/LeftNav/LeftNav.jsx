import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import './LeftNav.css';

const links = [
  {
    path: '/reports',
    name: 'dashboard',
    img: '/static/img/icon-dashboard.png',
    groups: ['feuw-mgr', 'beuw-mgr'],
  },
  {
    path: '/loan-evaluation',
    name: 'loan-evaluation',
    img: '/static/img/frontend.svg',
    groups: ['feuw', 'feuw-mgr'],
  },
  {
    path: '/stager',
    name: 'stager',
    img: '/static/img/stager.svg',
    groups: ['feuw-mgr', 'beuw-mgr', 'stager', 'stager-mgr'],
  },
  {
    path: '/move-forward',
    name: 'move-forward',
    img: '/static/img/move_forward.svg',
    groups: ['feuw-mgr', 'beuw-mgr'],
  },
];

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
