import React from 'react';
import PropTypes from 'prop-types';
import IconButton from '@material-ui/core/IconButton';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import './ExpandableCell.css';
import { connect } from 'react-redux';

class ExpandableCell extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
    };
  }

  handleDataExpand() {
    const { isOpen } = this.state;

    this.setState({ isOpen: !isOpen });
  }

  render() {
    const { data, width } = this.props;
    const { isOpen } = this.state;

    return (
      <>
        <div style={{ width: `${width}px` }} styleName="align-icon">
          <div styleName={!isOpen ? 'expand' : 'collapse'}>
            {data}
          </div>
          <IconButton
            aria-label="expand row"
            size="small"
            styleName="icon"
          >
            {!isOpen
              ? <ExpandMoreIcon onClick={() => { this.handleDataExpand(); }} styleName="expand-more" />
              : <ExpandLessIcon onClick={() => { this.handleDataExpand(); }} styleName="expand-less" />
            }
          </IconButton>
        </div>
      </>
    );
  }
}

ExpandableCell.defaultProps = {
  data: '',
  width: 100,
};

ExpandableCell.propTypes = {
  data: PropTypes.string,
  width: PropTypes.number,
};

export default connect(null, null)(ExpandableCell);
