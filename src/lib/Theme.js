import { createMuiTheme } from '@material-ui/core/styles';
import blue from '@material-ui/core/colors/blue';

const theme = createMuiTheme({
  palette: {
    secondary: {
      main: blue[900],
    },
  },
  typography: {
    fontFamily: '"Lato", sans-serif',
  },
});

export default theme;
