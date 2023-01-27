import * as R from 'ramda';
import React from 'react';
import PropTypes from 'prop-types';
import './GridView.css';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

class GridView extends React.PureComponent {
  render() {
    const {
      value, additionalInfo: {
        styleName, hasTitle, columnNames,
        columnSize, columns,
      }, title, disabled,
    } = this.props;
    const remainder = columnSize && (12 - columnSize.reduce((a, b) => a + b, 0));
    const disabledStyle = disabled && {
      backgroundColor: '#eee',
    };
    const header = (hasTitle) && (
    <Typography>
      {title}
    </Typography>
    );
    return (
      <>
        {header}
        <Grid
          container
          direction="row"
          style={{ ...disabledStyle }}
          styleName={styleName || ''}
        >
          {columnNames && columnNames.map((columnName, index) => (
            <Grid
              item
              style={{ display: 'flex', justifyContent: 'center' }}
              xs={columnSize[index]}
            >
              <p style={{ fontSize: '0.8rem', textTransform: 'capitalize' }}>{R.toLower(columnName)}</p>
            </Grid>
          ))}
          {value && value.map((rowItem, index) => (
            <>
              {columnNames && columnNames.map(columnName => (
                <Grid
                  item
                  style={{ display: 'flex', justifyContent: 'center', padding: '1rem 0rem' }}
                  xs={columnSize[index - (Math.floor(index / columns) * columns)]}
                >

                  {R.propOr('', columnName, rowItem)}
                </Grid>
              ))}
              {((index + 1) % columns) === 0 && <Grid item xs={remainder} />}
              <Grid item xs={12}>
                <hr style={{ margin: 0 }} />
              </Grid>
            </>
          ))}
        </Grid>
      </>
    );
  }
}


GridView.defaultProps = {
  title: '',
  additionalInfo: {
    styleName: 'taskSection',
    hasTitle: true,
    columns: 1,
    columnSize: [],
    columnNames: [],
  },
  value: {},
  disabled: false,
};

GridView.propTypes = {
  additionalInfo: PropTypes.shape({
    columnNames: PropTypes.arrayOf(),
    columns: PropTypes.number,
    columnSize: PropTypes.arrayOf(),
    hasTitle: PropTypes.bool,
    styleName: PropTypes.string,
  }),
  disabled: PropTypes.bool,
  title: PropTypes.string,
  value: PropTypes.shape(),
};

export default GridView;
