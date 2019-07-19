import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import History from '@material-ui/icons/History';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Fab from '@material-ui/core/Fab';
import Tooltip from '@material-ui/core/Tooltip';
import './ChecklistHistory.css';


const styles = theme => ({
  margin: {
    margin: theme.spacing.unit,
  },
  extendedIcon: {
    marginRight: theme.spacing.unit,
  },
  custom: {
    color: 'black',
    backgroundColor: 'var(--grey-300)',
    borderRadius: '0.15rem',
    minHeight: '25px',
    width: '30px',
    height: '0px',
    '&:hover': {
      backgroundColor: 'var(--grey-300)',
    },
  },
});

// const historicalData = [
//   {
//     checklistId: '5cee56a55b95415a7ce905f6',
//     description: 'BEUW-Suspicious Activity Review',
//     time: '27 May 2019 08:30pm',
//   },
//   {
//     checklistId: '5cee415e6dc1d4270a6a63e8',
//     description: 'FEUW-Suspicious Activity Review',
//     time: '27 May 2019 08:30pm',
//   },
//   {
//     checklistId: '5ce7143f69daeb6ed3ffdb4c',
//     description: 'FEUW-Suspicious Activity Review',
//     time: '27 May 2019 08:30pm',
//   },
// ];


class ChecklistHistory extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      anchorEl: null,
    };
    this.handleClose = this.handleClose.bind(this);
    this.handleChecklistOpen = this.handleChecklistOpen.bind(this);
  }

  handleClose() {
    this.setState({ anchorEl: null });
  }

  handleChecklistOpen(event) {
    this.setState({
      anchorEl: event.currentTarget,
    });
  }

  render() {
    const { anchorEl } = this.state;
    const { checkListData: historicalData } = this.props;
    const open = Boolean(anchorEl);
    const {
      margin, toolTipPosition, classes,
    } = this.props;
    return (
      <>
        <Tooltip aria-label="Checklist History" placement={toolTipPosition} title="Checklist History">
          <Fab
            aria-label="Checklist History"
            className={classes.custom}
            color="secondary"
            onClick={this.handleChecklistOpen}
            style={margin}
          >
            <History />
          </Fab>
        </Tooltip>

        <Menu
          anchorEl={anchorEl}
          id="long-menu"
          onClose={value => this.handleClose(value)}
          open={open}
          PaperProps={{
            style: {
              // width: 200,
            },
          }}
        >
          {
            (historicalData)
              ? historicalData.map(option => (
                // eslint-disable-next-line react/jsx-no-target-blank
                <a
                  href={`http://127.0.0.1:7601/api/download/${
                    option.taskCheckListId
                  }?event=${option.taskCheckListTemplateName}&disposition=${
                    option.dispositionCode
                  }`}
                  // eslint-disable-next-line react/jsx-no-target-blank
                  target="_blank"
                >
                  <MenuItem className="menuItem">
                    <div>
                      {option.taskCheckListTemplateName}
                      <br />
                      <span>{option.taskCheckListDateTime}</span>
                    </div>
                  </MenuItem>
                </a>
              ))
              : <>
                No historical checklists are available
              </>}
        </Menu>
      </>
    );
  }
}

ChecklistHistory.defaultProps = {
  margin: {
    'margin-left': '4rem',
  },
  toolTipPosition: 'bottom',

};

ChecklistHistory.propTypes = {
  checkListData: PropTypes.arrayOf(Object).isRequired,
  classes: PropTypes.shape.isRequired,
  margin: PropTypes.shape({
    marginLeft: PropTypes.string,
  }),
  toolTipPosition: PropTypes.string,

};


export default withStyles(styles)(ChecklistHistory);
