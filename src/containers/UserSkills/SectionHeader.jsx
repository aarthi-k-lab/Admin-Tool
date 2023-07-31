import React from 'react';
import { Typography } from '@material-ui/core/index';
import PropTypes from 'prop-types';

class SectionHeader extends React.Component {
  constructor(props) {
    super(props);
    this.title = props.title;
    this.style = props.style;
  }

  render() {
    return (
      <>
        <Typography style={this.style} variant="h5">
          {this.title}
        </Typography>
      </>
    );
  }
}

SectionHeader.defaultProps = {
  style: {},
};

SectionHeader.propTypes = {
  style: PropTypes.shape({

  }),
  title: PropTypes.string.isRequired,
};

export default SectionHeader;
