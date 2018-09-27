import React from 'react';
import App from 'components/App';
import Center from 'components/Center';
import Tombstone, { TombstoneLoader } from 'components/Tombstone';
import ContentHeader from 'components/ContentHeader';
import LoanTombstone from 'models/LoanTombstone';
import SSODemo from 'containers/SSODemo';
import PropTypes from 'prop-types';
import * as R from 'ramda';

class Dashboard extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      loadingTombstoneData: true,
      tombstoneData: [],
    };

    this.sampleLoans = [596400243, 596400270];
    this.loansIndex = 0;
    this.handleGetNext = this.handleGetNext.bind(this);
  }

  componentDidMount() {
    this.fetchLoanTombstoneData(this.sampleLoans[this.loansIndex]);
  }

  fetchLoanTombstoneData(loanNumber) {
    this.setState({
      loadingTombstoneData: true,
    });
    LoanTombstone.fetchData(loanNumber)
      .then((data) => {
        this.setState({
          loadingTombstoneData: false,
          tombstoneData: data,
        });
      })
      .catch(console.error);
  }

  handleGetNext() {
    this.loansIndex = (this.loansIndex + 1) % this.sampleLoans.length;
    this.fetchLoanTombstoneData(this.sampleLoans[this.loansIndex]);
  }

  renderTombstone() {
    const { loadingTombstoneData, tombstoneData } = this.state;
    const tombstone = loadingTombstoneData
      ? <TombstoneLoader />
      : <Tombstone items={tombstoneData} />;
    return tombstone;
  }

  render() {
    const tombstone = this.renderTombstone();
    const { user } = this.props;

    const getUserDetails = R.propOr({}, 'userDetails');
    const getUserGroups = R.propOr({}, 'groupList');

    const userDetails = getUserDetails(user);
    const groups = getUserGroups(user);

    return (
      <App user={user}>
        <ContentHeader
          onGetNext={this.handleGetNext}
          title="Document Verification"
        />
        {tombstone}
        <Center>
          <SSODemo groups={groups} userDetails={userDetails} />
        </Center>
      </App>
    );
  }
}

Dashboard.propTypes = {
  user: PropTypes.shape({
    userDetails: PropTypes.shape({
      email: PropTypes.string,
      jobTitle: PropTypes.string,
      name: PropTypes.string,
    }),
    userGroups: PropTypes.array,
  }).isRequired,
};

export default Dashboard;
