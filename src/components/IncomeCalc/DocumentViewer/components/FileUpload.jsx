import React, { useEffect, useState } from 'react';
import { Typography } from '@material-ui/core';
import PropTypes from 'prop-types';
import LinearProgressBar from './LinearProgressBar';
import './FileUpload.css';

function removeUploadedFiles(docTitle, setUploadedFiles, uploadedFiles) {
  const newUploadedFiles = uploadedFiles.filter(file => file.docTitle !== docTitle);
  setUploadedFiles(newUploadedFiles);
}


const FileUpload = function FileUpload(props) {
  const {
    data, file, setUploadedFiles, uploadedFiles, handleClose,
  } = props;
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(true);
  // eslint-disable-next-line no-undef
  const xhr = new XMLHttpRequest();

  const uploadFile = () => {
    const {
      loanNumber, brand,
      setSnackBarValuesTrigger,
      selectedFilenetType, selectedFilenetCategory, selectedFilenetTypeName,
    } = data;
    const url = '/api/document/api/FileNet/UploadAndGetDocument';
    setIsUploading(true);
    return new Promise((res, rej) => {
      xhr.open('POST', url, true);
      xhr.onload = () => {
        setIsUploading(false);
        const uploadResponse = JSON.parse(xhr.response);
        if (xhr.status === 404) {
          setSnackBarValuesTrigger({
            open: true,
            message: 'Unable to reach filenet server',
            type: 'error',
            timeout: 3000,
          });
          handleClose();
          return;
        }
        if (xhr.status === 400) {
          setSnackBarValuesTrigger({
            open: true,
            message: uploadResponse.title,
            type: 'error',
            timeout: 3000,
          });
          handleClose();
          return;
        }
        if (uploadResponse) {
          removeUploadedFiles(uploadResponse.docTitle, setUploadedFiles, uploadedFiles);
          setProgress(0);
          handleClose();
        } else {
          handleClose();
          setSnackBarValuesTrigger({
            open: true,
            message: 'Unable to upload files',
            type: 'error',
            timeout: 3000,
          });
        }
      };
      xhr.onerror = evt => rej(evt);
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percentage = (event.loaded / event.total) * 100;
          setTimeout(() => {
            setProgress(Math.round(percentage));
          }, 200);
        }
      };

      const formData = new window.FormData();
      formData.append('LoanId', loanNumber);
      formData.append('UploadDocumentTypeCode', selectedFilenetType);
      formData.append('UploadDocumentTypeCategory', selectedFilenetCategory);
      formData.append('IsException', false);
      formData.append('UploadedBy', 'svc_cmod_filenet');
      formData.append('UploadDocumentName', selectedFilenetTypeName);
      formData.append('FileByteStream', file);
      xhr.setRequestHeader('Brand', brand);
      setTimeout(() => {
        xhr.send(formData);
      }, 3000);
    });
  };

  useEffect(() => {
    async function upload() {
      await uploadFile();
    }
    upload();
  }, []);


  return (
    <div>
      {isUploading
        && (
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          <Typography
            noWrap
            styleName="docName"
          >
            {file.name}
          </Typography>
          <LinearProgressBar progress={progress} />
        </div>
        )
      }
    </div>
  );
};

FileUpload.propTypes = {
  data: PropTypes.shape({
    brand: PropTypes.string,
    loanNumber: PropTypes.string,
    selectedFilenetCategory: PropTypes.string,
    selectedFilenetType: PropTypes.string,
    selectedFilenetTypeName: PropTypes.string,
    setSnackBarValuesTrigger: PropTypes.func,
  }).isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  file: PropTypes.any.isRequired,
  handleClose: PropTypes.func.isRequired,
  setUploadedFiles: PropTypes.func.isRequired,
  uploadedFiles: PropTypes.shape().isRequired,
};

export default FileUpload;
