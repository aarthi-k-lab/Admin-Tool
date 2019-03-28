// eslint-disable
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import './EvalTableCell.css';

class EvalTableCell extends React.PureComponent {
  constructor(props) {
    super(props);
    this.handleLinkClick = this.handleLinkClick.bind(this);
  }

  handleLinkClick() {
    const { click } = this.props;
    click();
  }

  render() {
    const actions = 'Loan Activity';
    const { value, styleProps } = this.props;
    return (
      value !== actions ? (
        <span styleName={styleProps}>
          {value}
        </span>
      ) : <Link onClick={() => this.handleLinkClick()} style={{ cursor: 'pointer', color: 'blue' }} to="/loan-activity">{value}</Link>
    );
  }
}

EvalTableCell.propTypes = {
  click: PropTypes.func.isRequired,
  styleProps: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
};

export default EvalTableCell;
