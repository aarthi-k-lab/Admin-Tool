import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { selectors as loginSelectors } from 'ducks/login';
import RouteAccess from 'lib/RouteAccess';
import './EvalTableCell.css';

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
    const actions = 'Loan Activity';
    const { value, styleProps } = this.props;
    return (
      value !== actions ? (
        <span styleName={styleProps}>
          {value}
        </span>
      ) : (
        <Link
          onClick={this.handleLinkClick}
          styleName="loanActivityLink"
          to={this.route()}
        >
          {value}
        </Link>
      )
    );
  }
}

EvalTableCell.propTypes = {
  click: PropTypes.func.isRequired,
  styleProps: PropTypes.string.isRequired,
  user: PropTypes.shape({
    groupList: PropTypes.array,
    skills: PropTypes.objectOf(PropTypes.string).isRequired,
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
