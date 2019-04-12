import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import PropTypes from 'prop-types';
import ExpandPanel from './ExpandPanel';
import './StatusDetails.css';

class StatusDetails extends React.PureComponent {
  constructor(props) {
    super(props);
    this.renderDetailsCard = this.renderDetailsCard.bind(this);
  }

  renderDetailsCard() {
    const { loanActivityDetails } = this.props;
    return (
      <>
        <div styleName="title-row">
          <div styleName="title-style">
            {loanActivityDetails.title}
          </div>
          <Card styleName="card-border">
            <CardContent styleName="card-content">
              <div style={{ display: 'flex', width: '760px' }}>
                {loanActivityDetails.statusDetails
                  && loanActivityDetails.statusDetails.map(detail => (
                    <div styleName="item">
                      <span styleName="header-style">{detail.columnName}</span>
                      <span styleName="value-style">{detail.columnValue}</span>
                    </div>
                  ))
                }
              </div>
            </CardContent>
          </Card>
        </div>
        <ExpandPanel monthlyDetails={loanActivityDetails.monthlyDetails} />
      </>
    );
  }

  render() {
    const { loanActivityDetails } = this.props;
    if (Object.keys(loanActivityDetails).length === 0) {
      return null;
    }
    return (
      this.renderDetailsCard()
    );
  }
}

StatusDetails.propTypes = {
  loanActivityDetails: PropTypes.shape.isRequired,
};

export default StatusDetails;
