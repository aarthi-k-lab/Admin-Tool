import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
// import Replay from '@material-ui/icons/Replay';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import { selectors as loginSelectors } from 'ducks/login';
import RouteAccess from 'lib/RouteAccess';
import './EvalTableCell.css';
// import styles from './EvalTableCell.css';

class EvalTableCell extends React.PureComponent {
  constructor(props) {
    super(props);
    this.handleLinkClick = this.handleLinkClick.bind(this);
    this.route = this.route.bind(this);
  }

  handleLinkClick() {
    const { click } = this.props;
    click();
  }

  route() {
    const { user } = this.props;
    const groups = user && user.groupList;
    if (RouteAccess.hasLoanActivityAccess(groups)) {
      return '/loan-activity';
    }
    return '/';
  }

  render() {
    const { value, styleProps } = this.props;
    let renderCellValue = '';
    switch (value) {
      case 'Loan Activity':
        renderCellValue = (
          <Link
            onClick={this.handleLinkClick}
            styleName="loanActivityLink"
            to={this.route()}
          >
            {value}
          </Link>
        );
        break;
      case 'Reject':
        renderCellValue = (
          <Tooltip
            styleName="tooltip"
            title="UnReject"
          >
            <IconButton onClick={this.handleLinkClick} styleName="reject-icon">
              <img alt="UnReject" src="/static/img/Revoke.svg" />
            </IconButton>
          </Tooltip>
        );
        break;
      default:
        renderCellValue = (
          <span styleName={styleProps}>
            {value}
          </span>
        );
    }
    return (
      <div>
        {renderCellValue}
      </div>
    );
  }
}

EvalTableCell.propTypes = {
  click: PropTypes.func.isRequired,
  styleProps: PropTypes.string.isRequired,
  user: PropTypes.shape({
    groupList: PropTypes.array,
    skills: PropTypes.objectOf(PropTypes.array).isRequired,
    userDetails: PropTypes.shape({
      email: PropTypes.string,
      jobTitle: PropTypes.string,
      name: PropTypes.string,
    }),
    userGroups: PropTypes.array,
  }).isRequired,
  value: PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
  user: loginSelectors.getUser(state),
});

export default connect(mapStateToProps, null)(EvalTableCell);
