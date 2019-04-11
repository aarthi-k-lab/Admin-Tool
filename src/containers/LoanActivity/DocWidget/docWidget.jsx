import React from 'react';
import './docWidget.css';
import Grid from '@material-ui/core/Grid';

const DocWidgetHeader = () => (
  <Grid container style={{ display: 'flex' }} styleName="widgetHeaderAndContent">
    <Grid xs={2}>
      <span styleName="header-style">Case Id</span>
    </Grid>
    <Grid xs={3}>
      <span styleName="header-style">Case Type</span>
    </Grid>
    <Grid xs={3}>
      <span styleName="header-style">Case Status</span>
    </Grid>
    <Grid xs={4}>
      <span styleName="header-style">Trial Letter Sent On</span>
    </Grid>
  </Grid>
);

const DocWidgetDetails = props => (
  props.docList.map(doc => (
    <Grid container styleName="widgetHeaderAndContent">
      <Grid xs={2}>
        <span styleName="tableData-style">{doc.caseId}</span>
      </Grid>
      <Grid xs={3}>
        <span styleName="tableData-style">{doc.caseType}</span>
      </Grid>
      <Grid xs={3}>
        <span styleName="tableData-style">{doc.caseStatus}</span>
      </Grid>
      <Grid xs={4}>
        <span styleName="tableData-style">{doc.trailLetterSentOn}</span>
      </Grid>
    </Grid>
  ))
);

const docList = [
  {
    caseId: 'CASEID1',
    caseType: 'CASETYPEA',
    caseStatus: 'Active',
    trailLetterSentOn: '11/12/2018',
  },
  {
    caseId: 'CASEID1',
    caseType: 'CASETYPEA',
    caseStatus: 'Active',
    trailLetterSentOn: '11/12/2018',
  },
  {
    caseId: 'CASEID1',
    caseType: 'CASETYPEA',
    caseStatus: 'Active',
    trailLetterSentOn: '11/12/2018',
  }, {
    caseId: 'CASEID1',
    caseType: 'CASETYPEA',
    caseStatus: 'Active',
    trailLetterSentOn: '11/12/2018',
  }, {
    caseId: 'CASEID1',
    caseType: 'CASETYPEA',
    caseStatus: 'Active',
    trailLetterSentOn: '11/12/2018',
  }, {
    caseId: 'CASEID1',
    caseType: 'CASETYPEA',
    caseStatus: 'Active',
    trailLetterSentOn: '11/12/2018',
  },
];

class DocWidget extends React.Component {
  render() {
    return (
      <>
        <div styleName="title-style">
          Customer Communication Letter
        </div>
        <DocWidgetHeader />
        <DocWidgetDetails docList={docList} />
      </>
    );
  }
}

export default DocWidget;
