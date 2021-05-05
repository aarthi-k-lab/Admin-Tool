import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { operations, selectors } from 'ducks/tasks-and-checklist';
import MenuItem from '@material-ui/core/MenuItem';
import Popper from '@material-ui/core/Popper';
import Paper from '@material-ui/core/Paper';
import './CreateSelect.css';
import InputBase from '@material-ui/core/InputBase';
import { withStyles } from '@material-ui/core/styles';
import Icon from '@material-ui/core/Icon';
import * as R from 'ramda';
import { getStyleName } from 'constants/incomeCalc/styleName';

const BootstrapInput = withStyles(theme => ({
  root: {
    'label + &': {
      marginTop: theme.spacing(3),
    },
  },
  input: {
    borderRadius: 2,
    position: 'relative',
    backgroundColor: theme.palette.background.paper,
    border: '1px solid #ced4da',
    fontSize: 12,
    width: '6rem',
    padding: '4px 26px 5px 12px',
    transition: theme.transitions.create(['border-color', 'box-shadow']),
    // Use the system font instead of the default Roboto font.
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    '&:focus': {
      borderRadius: 2,
      borderColor: '#80bdff',
      boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
    },
  },
}))(InputBase);

class CreateSelect extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      newEntry: null,
      selectedIndex: 0,
      anchorEl: null,
      isSubmitted: false,
    };
  }

  componentDidMount() {
    const { value } = this.props;
    this.setState({ newEntry: value, isSubmitted: !!value });
  }

  handleTextChange = (e) => {
    const { additionalInfo, processAction, source } = this.props;
    const type = R.pathOr(null, ['actions', 'preProcess'], additionalInfo);
    const payload = {
      source,
      additionalInfo: {
        ...additionalInfo,
        value: e.target.value,
      },
    };
    if (type) processAction(type, payload);
    if (e.target.value !== '') {
      this.setState({ selectedIndex: 0, anchorEl: e.currentTarget });
    } else {
      this.setState({ anchorEl: null, selectedIndex: 0 });
    }
    this.setState({ newEntry: e.target.value, isSubmitted: false });
  };

  handleClick = (event) => {
    const { anchorEl, newEntry } = this.state;
    const { value } = this.props;
    let anchor = null;
    if (anchorEl) {
      anchor = null;
      this.setState({ newEntry: value });
    } else if (newEntry !== '') {
      anchor = event.currentTarget;
    }
    this.setState({ anchorEl: anchor });
  };

  onKeyDown = (event) => {
    const { selectedIndex, newEntry } = this.state;
    const {
      onChange, value, additionalInfo, processAction, options,
    } = this.props;
    const { selector } = additionalInfo;
    const filteredOptions = R.pathOr([], selector, options);
    const isNewEntry = newEntry !== '' || newEntry !== value ? 0 : 1;
    const type = R.pathOr(null, ['actions', 'postProcess'], additionalInfo);
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this.setState({ anchorEl: event.currentTarget });
        if (filteredOptions.length - isNewEntry !== selectedIndex) {
          this.setState({ selectedIndex: selectedIndex + 1 });
        } else if (filteredOptions.length - isNewEntry === selectedIndex) {
          this.setState({ selectedIndex: 0 });
        }
        break;
      case 'ArrowUp':
        event.preventDefault();
        if (selectedIndex !== 0) {
          this.setState({ selectedIndex: selectedIndex - 1 });
        } else {
          this.setState({ selectedIndex: filteredOptions.length });
        }
        break;
      case 'Enter':
        event.preventDefault();
        if (selectedIndex !== 0) {
          this.setState({ newEntry: filteredOptions[selectedIndex - 1] });
          onChange({ target: { value: filteredOptions[selectedIndex - 1] } });
        } else {
          const payload = {
            ...additionalInfo,
            value: newEntry,
          };
          this.setState({ newEntry });
          onChange({ target: { value: newEntry } });
          if (type) processAction(type, payload);
        }
        this.setState({ anchorEl: null, isSubmitted: true });

        break;
      default:
        break;
    }
  };

  handleClickAway = (event) => {
    const { anchorEl } = this.state;
    this.setState({ anchorEl: anchorEl ? null : event.currentTarget });
  }

  handleEdit = () => {
    this.setState({ isSubmitted: false });
  }

  handleOnClick = (event) => {
    const { onChange } = this.props;
    const { anchorEl } = this.state;
    onChange({ target: { value: event.currentTarget.innerText } });
    this.setState({
      anchorEl: anchorEl ? null : event.currentTarget,
      newEntry: event.currentTarget.innerText,
      isSubmitted: true,
    });
  }

  handleOnNewItemClick = (event) => {
    const { onChange, additionalInfo, processAction } = this.props;
    const { anchorEl, newEntry } = this.state;
    const type = R.pathOr(null, ['actions', 'postProcess'], additionalInfo);
    const payload = {
      ...additionalInfo,
      value: newEntry,
    };
    onChange({ target: { value: newEntry } });
    this.setState({
      anchorEl: anchorEl ? null : event.currentTarget,
      newEntry,
      isSubmitted: true,
    });
    if (type) processAction(type, payload);
  }

  render() {
    const {
      anchorEl, newEntry, selectedIndex, isSubmitted,
    } = this.state;
    const {
      title, additionalInfo, value, options, styleName,
    } = this.props;
    const { additionalElements, selector } = additionalInfo;
    const filteredOptions = R.pathOr([], selector, options);

    const button = additionalElements.includes('readOnlyField') && isSubmitted && (
      <div styleName={getStyleName('createSelect', styleName, 'button')}>
        <p>{value}</p>
        <div styleName={getStyleName('createSelect', styleName, 'buttonIcon')}>
          <Icon onClick={this.handleEdit}>
          edit
          </Icon>
        </div>
      </div>
    );
    return (
      <div styleName={getStyleName('createSelect', styleName, 'createSelectWrapper')}>
        {button}
        {!isSubmitted && (
        <div styleName={getStyleName('createSelect', styleName, 'createSelect')}>
          <p>{title}</p>
          <div styleName={getStyleName('createSelect', styleName, 'dropDown')}>
            <BootstrapInput
              onBlur={this.handleClick}
              onChange={this.handleTextChange}
              onClick={this.handleClick}
              onKeyDown={this.onKeyDown}
              value={newEntry}
            />
            <Popper
              anchorEl={anchorEl}
              fullWidth
              open={Boolean(anchorEl)}
              placement="bottom"
              style={{ width: anchorEl ? anchorEl.clientWidth : null }}
            >
              <Paper elevation={2}>
                {newEntry && (
                  <MenuItem
                    onClick={this.handleOnNewItemClick}
                    onMouseDown={event => event.preventDefault()}
                    selected={selectedIndex === 0}
                    style={{ display: 'flex', justifyContent: 'space-between' }}
                    value={newEntry}
                  >
                    <span>{newEntry}</span>
                    <span>+ADD</span>
                  </MenuItem>
                )}
                {filteredOptions.map((option, index) => (
                  <MenuItem
                    key={option}
                    onClick={this.handleOnClick}
                    onMouseDown={event => event.preventDefault()}
                    selected={
                        newEntry === ''
                          ? selectedIndex === index
                          : selectedIndex - 1 === index
                    }
                    value={option}
                  >
                    {option}
                  </MenuItem>
                ))}
              </Paper>
            </Popper>
          </div>
        </div>
        )}
      </div>
    );
  }
}


CreateSelect.defaultProps = {
  options: [],
  source: [],
};

CreateSelect.propTypes = {
  additionalInfo: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(PropTypes.string),
  processAction: PropTypes.func.isRequired,
  source: PropTypes.arrayOf(PropTypes.string),
  styleName: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
};

const mapDispatchToProps = dispatch => ({
  fetchDropDownOption: operations.fetchDropDownOptions(dispatch),
  processAction: operations.preProcessChecklistItems(dispatch),
});

const mapStateToProps = state => ({
  options: selectors.getTasksAndChecklist(state),
});

export default connect(mapStateToProps, mapDispatchToProps)(CreateSelect);
