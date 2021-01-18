import React from 'react';
import PropTypes from 'prop-types';
import { Link, withRouter } from 'react-router-dom';
import './GoBackToSearch.css';

class GoBackToSearch extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleSearchBackButton = () => {
    const {
      loanNumber, history, location, onClick,
    } = this.props;
    if (location.pathname === '/search') {
      onClick();
    } else history.push(`/search?loanNumber=${loanNumber}`);
  }

  render() {
    const { loanNumber } = this.props;
    const renderBackButtonPage = `/search?loanNumber=${loanNumber}`;
    return (
      <span styleName="backButton">
        <Link onClick={this.handleSearchBackButton} to={renderBackButtonPage}>
            &lt; GO BACK TO SEARCH RESULTS
        </Link>
      </span>
    );
  }
}

GoBackToSearch.propTypes = {
  history: PropTypes.arrayOf(PropTypes.string).isRequired,
  loanNumber: PropTypes.string.isRequired,
  location: PropTypes.shape({
    pathname: PropTypes.string,
    search: PropTypes.string.isRequired,
  }).isRequired,
  onClick: PropTypes.func.isRequired,
};

const TestHooks = {
  GoBackToSearch,
};

export default withRouter(GoBackToSearch);
export { TestHooks };
