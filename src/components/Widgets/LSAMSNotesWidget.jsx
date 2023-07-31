import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Box from '@material-ui/core/Box';
import CloseIcon from '@material-ui/icons/Close';
import { Typography } from '@material-ui/core/index';
import { MONTH_SHORTNAMES } from 'constants/dateConversion';
import NavExpMUITable from 'components/NavExpMUITable';
import './LSAMSNotesWidget.css';
import * as R from 'ramda';
import {
  selectors as lsamsNotesSelectors,
  operations as lsamsNotesOperations,
} from 'ducks/lsams-notes';
import {
  operations as widgetsOperations,
} from 'ducks/widgets';
import {
  selectors as dashboardSelectors,
} from 'ducks/dashboard';

const LSAMS_NOTES_TABLE_COLUMNS = [
  {
    name: 'class',
    label: 'Class',
    align: 'left',
    minWidthHead: 50,
    options: {
      filter: true,
      sort: false,
      expand: false,
      toolTip: {
        title: 'Filter Class',
        size: 'small',
        color: 'action',
      },
    },
  },
  {
    name: 'enterDate',
    label: 'Entered Date',
    align: 'left',
    minWidthHead: 80,
    options: {
      filter: true,
      sort: false,
      expand: false,
      toolTip: {
        title: 'Filter Entered Date',
        size: 'small',
        color: 'action',
      },
    },
    cellFormat: (date) => {
      if (R.isNil(date)) { return ''; }
      const year = date.slice(0, 4);
      const month = MONTH_SHORTNAMES[Number(date.slice(5, 7))];
      const day = date.slice(8, 10);
      return (`${day} ${month} ${year}`);
    },
  },
  {
    name: 'collectionCode',
    label: 'Cmt Code',
    align: 'left',
    minWidthHead: 85,
    options: {
      filter: true,
      sort: false,
      expand: false,
      toolTip: {
        title: 'Filter Cmt Code',
        size: 'small',
        color: 'action',
      },
    },
  },
  {
    name: 'enteredBy',
    label: 'Entered By',
    align: 'left',
    minWidthHead: 100,
    options: {
      filter: true,
      sort: false,
      expand: false,
      toolTip: {
        title: 'Filter Entered By',
        size: 'small',
        color: 'action',
      },
    },
  },
  {
    name: 'clearDate',
    label: 'Clear Date',
    align: 'left',
    minWidthHead: 100,
    options: {
      filter: true,
      sort: false,
      expand: false,
      toolTip: {
        title: 'Filter Clear Date',
        size: 'small',
        color: 'action',
      },
    },
    cellFormat: (date) => {
      if (R.isNil(date)) { return ''; }
      const year = date.slice(0, 4);
      const month = MONTH_SHORTNAMES[Number(date.slice(5, 7))];
      const day = date.slice(8, 10);
      return (`${day} ${month} ${year}`);
    },
  },
  {
    name: 'targetDate',
    label: 'Target Date',
    align: 'left',
    minWidthHead: 100,
    options: {
      filter: true,
      sort: false,
      expand: false,
      toolTip: {
        title: 'Filter Target Date',
        size: 'small',
        color: 'action',
      },
    },
    cellFormat: (date) => {
      if (R.isNil(date)) { return ''; }
      const year = date.slice(0, 4);
      const month = MONTH_SHORTNAMES[Number(date.slice(5, 7))];
      const day = date.slice(8, 10);
      return (`${day} ${month} ${year}`);
    },
  },
  {
    name: 'textCommentsResultSet',
    label: 'Comment',
    align: 'left',
    minWidthHead: 250,
    options: {
      filter: false,
      sort: false,
      expand: true,
      expandValues: {
        limit: 60,
        width: 300,
      },
      toolTip: {
        title: 'Filter Comments',
        size: 'small',
        color: 'action',
      },
    },
    cellFormat: (comments) => {
      let result = '';

      R.pathOr([], ['textComments'], comments).forEach((value) => {
        result = result.concat(value.comment.replace(/\s\s+/g, ' '), ' ');
      });

      return result;
    },
  },
];

class LSAMSNotesWidget extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const { fetchCommentsCode } = this.props;

    fetchCommentsCode();
  }

  componentWillUnmount() {
    const { clearCommentsCode } = this.props;

    clearCommentsCode();
  }

  handleScreenClose() {
    const { groupName, onWidgetToggle } = this.props;

    const payload = {
      currentWidget: '',
      openWidgetList: [],
      page: groupName,
    };
    onWidgetToggle(payload);
  }

  render() {
    const { commentsCode } = this.props;

    return (
      <>
        <Box styleName="box">
          <Typography styleName="title" variant="subtitle1">
            LSAMS NOTES

            <CloseIcon onClick={() => { this.handleScreenClose(); }} styleName="close-icon" />
          </Typography>

          <NavExpMUITable
            backgroundColor="#f3f5f9"
            cellSize={5}
            columns={LSAMS_NOTES_TABLE_COLUMNS}
            data={commentsCode}
            height="70vh"
            noOfRecords={16}
          />
        </Box>
      </>
    );
  }
}

const TestHooks = {
  LSAMSNotesWidget,
};

LSAMSNotesWidget.defaultProps = {
  commentsCode: [],
};

LSAMSNotesWidget.propTypes = {
  clearCommentsCode: PropTypes.func.isRequired,
  commentsCode: PropTypes.arrayOf(
    PropTypes.shape({

    }),
  ),
  fetchCommentsCode: PropTypes.func.isRequired,
  groupName: PropTypes.string.isRequired,
  onWidgetToggle: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  commentsCode: lsamsNotesSelectors.getCommentsCode(state),
  groupName: dashboardSelectors.groupName(state),
});

const mapDispatchToProps = dispatch => ({
  clearCommentsCode: lsamsNotesOperations.clearCommentsCodeOperation(dispatch),
  fetchCommentsCode: lsamsNotesOperations.fetchCommentsCodeOperation(dispatch),
  onWidgetToggle: widgetsOperations.onWidgetToggle(dispatch),
});

export {
  LSAMSNotesWidget,
};
export default connect(mapStateToProps, mapDispatchToProps)(LSAMSNotesWidget);
export { TestHooks };
