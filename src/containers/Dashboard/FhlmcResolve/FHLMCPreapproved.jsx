import React from 'react';
import Grid from '@material-ui/core/Grid';
import { connect } from 'react-redux';
import CustomTable from 'components/CustomTable';
import Button from '@material-ui/core/Button';
import getters from 'models/Headers';
import * as R from 'ramda';
import { selectors, operations } from 'ducks/dashboard';
import { PropTypes } from 'prop-types';
import './FHLMCPreapproved.css';
import { GENERATE_BOARDING_TEMPLATE_STATUS } from '../../../constants/fhlmc';

class FHLMCPreapproved extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      showMessageProp: false,
      generateOnboardingTemplate: true,
    };
    this.renderCustomTable = this.renderCustomTable.bind(this);
    this.submitOnBoardingTemplate = this.submitOnBoardingTemplate.bind(this);
    this.isBoardingButtonDisabled = this.isBoardingButtonDisabled.bind(this);
  }

  submitOnBoardingTemplate = () => {
    const { onSentToBoardingTemplate, selectedRequestType, portfolioCode } = this.props;
    const status = GENERATE_BOARDING_TEMPLATE_STATUS;
    const level = 'Info';
    const showConfirmButton = true;
    const sweetAlertPayload = {
      status,
      level,
      showConfirmButton,
    };
    onSentToBoardingTemplate(selectedRequestType, portfolioCode, sweetAlertPayload);
  }

  renderCustomTable = (resultData, submitCases, showMessageProp, selectedRequestType) => {
    const failedCaseId = R.pluck('loanNumber', R.filter(R.propEq('isValid', false), resultData));
    return (
      <CustomTable
        defaultPageSize={25}
        getTrProps={(state, rowInfo) => {
          if (rowInfo) {
            const { original } = rowInfo;
            let style = {};
            if (R.contains(original.loanNumber, failedCaseId)) {
              style = {
                background: '#e10c32',
              };
            }
            return {
              style,
            };
          }
          return {};
        }}
        pageSizeOptions={[10, 20, 25, 50, 100]}
        styleName="table"
        tableData={R.isEmpty(resultData) ? [] : resultData}
        tableHeader={getters.getFhlmcColumns('submitPreapprovalLoans', selectedRequestType)}
      />
    );
  }

  isBoardingButtonDisabled = () => {
    const { resultData } = this.props;
    const valid = R.filter(R.propEq('isValid', true), resultData);
    if (valid && valid.length > 0) {
      return false;
    }
    return true;
  }

  render() {
    const {
      resultData, submitCases, selectedRequestType,
    } = this.props;
    const {
      showMessageProp, generateOnboardingTemplate,
    } = this.state;
    return (
      <Grid container direction="column">
        <Grid item>
          {this.renderCustomTable(resultData, submitCases, showMessageProp, selectedRequestType)}
        </Grid>
        <Grid item>
          {generateOnboardingTemplate && (
            <Button
              className="material-ui-button"
              color="primary"
              disabled={this.isBoardingButtonDisabled()}
              onClick={this.submitOnBoardingTemplate}
              styleName="boardingButton"
              variant="contained"
            >
              GENERATE BOARDING TEMPLATE
            </Button>
          )
          }
        </Grid>
      </Grid>
    );
  }
}
FHLMCPreapproved.defaultProps = {
  selectedRequestType: '',
  submitCases: PropTypes.bool,
  resultData: [],
  portfolioCode: '',
  onSentToBoardingTemplate: () => { },
};
FHLMCPreapproved.propTypes = {
  onSentToBoardingTemplate: PropTypes.func,
  portfolioCode: PropTypes.string,
  resultData: PropTypes.arrayOf({
    loanNumber: PropTypes.string,
    message: PropTypes.string,
  }),
  selectedRequestType: '',
  submitCases: PropTypes.bool,
};
const mapStateToProps = state => ({
  resultData: selectors.resultData(state),
  isAssigned: selectors.isAssigned(state),
});

const mapDispatchToProps = dispatch => ({
  onSentToBoardingTemplate: operations.onSentToBoardingTemplateOperation(dispatch),
});
export default connect(mapStateToProps, mapDispatchToProps)(FHLMCPreapproved);
