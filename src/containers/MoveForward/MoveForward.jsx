import React from 'react';
import ReactTable from 'react-table';
import * as R from 'ramda';
import * as Api from 'lib/Api';

import Filters from './Filters';
import './MoveForward.css';

class MoveForward extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      loading: false,
      pids: '',
      pidsCount: 0,
      tableData: [],
    };

    this.handleChange = this.handleChange.bind(this);
    this.moveForward = this.moveForward.bind(this);
  }

  getMessage() {
    const { hasError, loading, pidsCount } = this.state;
    if (loading) {
      return '';
    }
    if (hasError) {
      return 'We are experiencing some issues. Please try after some time.';
    }
    return `${pidsCount} pids have been processed.`;
  }

  handleChange(event) {
    this.setState({ pids: event.target.value });
  }

  moveForward() {
    const { pids } = this.state;
    const pidsList = pids.split(/\s*,\s*/).map(s => s.trim());
    const pidsCount = pidsList.length;
    this.setState({ pidsCount });
    const requestURL = '/api/release/api/process/release';
    const requestBody = pidsList;
    this.setState({ loading: true, hasError: false });
    Api.callPost(requestURL, requestBody)
      .then((res) => {
        const tableData = R.compose(
          R.map(([pId, val]) => ({
            pId,
            status: R.pathOr(
              'An error occured',
              ['updateInstanceStatusResponse', 'statusCode'],
              val,
            ),
          })),
          R.toPairs,
        )(res);
        this.setState({ tableData });
      })
      .catch(() => {
        this.setState({ hasError: true, tableData: [] });
      })
      .finally(() => {
        this.setState({ loading: false });
      });
  }

  render() {
    const { loading } = this.state;
    const { pids } = this.state;
    const { tableData } = this.state;
    return (
      <>
        <Filters
          loading={loading}
          onChange={this.handleChange}
          onClick={this.moveForward}
          pIds={pids}
        />
        <div styleName="move-forward-table-container">
          <div styleName="move-forward-height-limiter">
            <p styleName="move-forward-message">
              {this.getMessage()}
            </p>
            <ReactTable
              columns={[
                { Header: 'Process Id', accessor: 'pId', id: 'pId' },
                { Header: 'Status', accessor: 'status', id: 'status' },
              ]}
              data={tableData}
              defaultPageSize={5}
              pageSizeOptions={[10, 20, 25, 50, 100]}
              styleName="move-forward-table"
            />
          </div>
        </div>
      </>
    );
  }
}

export default MoveForward;
