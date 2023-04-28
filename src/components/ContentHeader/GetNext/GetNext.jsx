import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import { connect } from 'react-redux';
import { selectors, operations } from 'ducks/dashboard';
import './GetNext.css';
import SweetAlertBox from '../../SweetAlertBox';

const GetNext = ({
  disabled, onClick, onDialogClose, resultOperation,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [renderContent, setRenderContent] = useState('');
  const [msgType, setMsgType] = useState('');

  const handleClose = () => {
    setIsOpen(false);
    onDialogClose();
  };

  useEffect(() => {
    if (resultOperation && resultOperation.status) {
      const { status, level } = resultOperation;
      setRenderContent(status);
      setMsgType(level || 'Failed');
      setIsOpen(true);
    }
  }, [resultOperation]);

  return (
    <>
      <Button
        className="material-ui-button"
        color="primary"
        disabled={disabled}
        onClick={onClick}
        styleName={disabled ? 'get-next-disabled' : 'get-next'}
        variant="contained"
      >
    Get Next
      </Button>
      {resultOperation && resultOperation.status && (
      <SweetAlertBox
        message={renderContent}
        onConfirm={() => handleClose}
        show={isOpen}
        type={msgType}
      />
      )}
    </>
  );
};

GetNext.defaultProps = {
  disabled: false,
  onClick: () => {},
  onDialogClose: () => {},
};

GetNext.propTypes = {
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
  onDialogClose: PropTypes.func,
  resultOperation: PropTypes.shape({
    status: PropTypes.string,
  }).isRequired,
};

const mapStateToProps = state => ({
  resultOperation: selectors.resultOperation(state),
});

const mapDispatchToProps = dispatch => ({
  onDialogClose: operations.onDialogClose(dispatch),
});

const GetNextContainer = connect(mapStateToProps, mapDispatchToProps)(GetNext);

const TestHooks = {
  GetNext,
};

export default GetNextContainer;

export { TestHooks };
