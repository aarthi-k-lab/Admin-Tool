import React from 'react';
import PropTypes from 'prop-types';
import './BookingHomePage.css';
import Grid from '@material-ui/core/Grid';

const BookingHomePage = (props) => {
  const { message } = props;
  return (
    <>
      <div>
        <Grid alignItems="center" container direction="column" styleName="homePage" xs={12}>
          <Grid alignItems="center" container direction="column" justify="center" xs={12}>
            <Grid item xs={12}>
              <img alt="Assign to me" src={`/static/img/${(message === 'Assign to me') ? 'assigntome' : 'openwidget'}.png `} />
            </Grid>
            <Grid item xs={12}>
              <p>
                Please click on the
                <span style={{ fontWeight: 1000 }}>
                  {' '}
                  {message}
                  {' '}
                </span>
                {' '}
                to continue the work
              </p>
            </Grid>
          </Grid>
        </Grid>
      </div>
    </>
  );
};

const TestHooks = {
  BookingHomePage,
};
BookingHomePage.defaultProps = {
  message: 'HelloWorld',
};


BookingHomePage.propTypes = {
  message: PropTypes.string,
};

export { TestHooks };
export default BookingHomePage;
