import React from 'react';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextareaAutosize';
import Button from '@material-ui/core/Button';
import ContentHeader from 'components/ContentHeader';
import Controls from 'containers/Controls';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import './CoviusBulkOrder.css';
import Simpleselect from 'react-select';
import ErrorIcon from '@material-ui/icons/Error';

class CoviusBulkOrder extends React.PureComponent {
  constructor(props) {
    super(props);
    this.csvLink = React.createRef();
    this.state = {
      loansNumber: '',

    };
    this.renderNotepadArea = this.renderNotepadArea.bind(this);
  }

  renderNotepadArea() {
    const { loansNumber } = this.state;
    const techCompanies = [
      { label: 'Apple', value: 1 },
      { label: 'Facebook', value: 2 },
      { label: 'Netflix', value: 3 },
      { label: 'Tesla', value: 4 },
      { label: 'Amazon', value: 5 },
      { label: 'Alphabet', value: 6 },
    ];
    return (
      <div styleName="status-details-parent">
        <span styleName="newBulkUpload">
          {'New Bulk Upload'}
        </span>
        <div styleName="loan-numbers">
          <span>
            {'Request Category'}
          </span>
          <span styleName="errorIcon">
            <ErrorIcon styleName="errorSvg" />
          </span>
        </div>
        <div style={{
          margin: '0rem 0.5rem 2rem 0.5rem',
        }}
        >
          <Simpleselect options={techCompanies} />

        </div>
        <div styleName="loan-numbers">
          <span>
            {'Request Code'}
          </span>
          <span styleName="errorIcon">
            <ErrorIcon styleName="errorSvg" />
          </span>
        </div>
        <div style={{
          margin: '0rem 0.5rem 2rem 0.5rem',
        }}
        >
          <Simpleselect
            options={techCompanies}
          />

        </div>
        <span styleName="loan-numbers">
          {'Case id(s)'}
        </span>
        <div styleName="status-details">
          <TextField
            id="loanNumbers"
            margin="normal"
            multiline
            onChange={this.handleChange}
            style={{ height: '98%', width: '99%', resize: 'none' }}
            value={loansNumber}
          />
        </div>
        <div styleName="interactive-button">
          <div>
            <Button
              className="material-ui-button"
              color="primary"
              disabled
              margin="normal"
              styleName="submitButton"
              variant="contained"
            >
                  SUBMIT
            </Button>
          </div>
        </div>
      </div>
    );
  }

  render() {
    const title = '';
    return (
      <>
        <ContentHeader title={title}>
          <Grid container style={{ height: '3rem' }} xs={12}>
            <Grid item xs={1}>
              <div styleName="backButton">
              Covius
              </div>
            </Grid>
          </Grid>
          <Controls />
        </ContentHeader>
        <Grid container styleName="loan-activity" xs={12}>
          <Grid item xs={2}>{this.renderNotepadArea()}</Grid>
        </Grid>
      </>
    );
  }
}


const CoviusBulkOrderContainer = connect(null, null)(CoviusBulkOrder);


export default withRouter(CoviusBulkOrderContainer);
