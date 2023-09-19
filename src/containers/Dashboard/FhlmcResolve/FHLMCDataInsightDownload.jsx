import React from 'react';
import GetAppIcon from '@material-ui/icons/GetApp';
import * as R from 'ramda';
import { connect } from 'react-redux';
import { selectors, operations } from 'ducks/dashboard';
import { PropTypes } from 'prop-types';
import { CustomButton } from './FHLMCDataInsight';
import './FhlmcResolve.css';

class FHLMCDataInsightDownload extends React.PureComponent {
  constructor(props) {
    super(props);
    this.handleDownload = this.handleDownload.bind(this);
  }

  componentWillUnmount() {
    const { dismissUserNotification } = this.props;
    dismissUserNotification();
  }

  handleDownload = () => {
    const { resultData, downloadFile } = this.props;
    const payload = {};
    if (R.has('message', R.head(resultData))) {
      payload.fileName = 'RESPONSE_FROM _FHLMC.xlsx';
      payload.data = resultData;
    } else {
      const metaData = R.filter(data => data.isValid, resultData);
      payload.fileName = 'FHLMC_DATA.xlsx';
      payload.data = metaData;
    }
    downloadFile(payload);
  }

  render() {
    const { isWidget, isAssigned } = this.props;
    return (
      <div styleName="download-btn">
        <CustomButton
          color="primary"
          disabled={!isAssigned}
          extraStyle={isWidget ? 'widgetDwnld' : ''}
          // hasTooltip
          onClick={this.handleDownload}
          startIcon={<GetAppIcon style={{ height: '1.5rem' }} />}
          title="DOWNLOAD"
          tooltipMessage="Create an excel file with the data from this tab for your review."
          variant="text"
        />
      </div>
    );
  }
}

FHLMCDataInsightDownload.defaultProps = {
  resultData: [],
  isWidget: false,
};

FHLMCDataInsightDownload.propTypes = {
  dismissUserNotification: PropTypes.func.isRequired,
  downloadFile: PropTypes.func.isRequired,
  isAssigned: PropTypes.bool.isRequired,
  isWidget: PropTypes.bool,
  resultData: PropTypes.arrayOf({
    caseId: PropTypes.string,
    message: PropTypes.string,
  }),
};

const mapStateToProps = state => ({
  resultData: selectors.resultData(state),
  isAssigned: selectors.isAssigned(state),
  disableSubmitToFhlmc: selectors.disableSubmittofhlmc(state),
});

const mapDispatchToProps = dispatch => ({
  downloadFile: operations.downloadFile(dispatch),
  dismissUserNotification: operations.onDismissUserNotification(dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(FHLMCDataInsightDownload);
