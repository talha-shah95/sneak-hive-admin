import React, { useEffect, useState } from 'react';

import { svgIcons } from '../../assets/images';

import './style.css';

const CustomVideoUploader = ({
  label,
  labelClassName,
  videoClassName,
  id,
  name,
  required,
  error,
  value,
  placeholder = 'Upload Video',
  onChange,
}) => {
  const [previewUrl, setPreviewUrl] = useState('');

  useEffect(() => {
    let fileUrl;

    if (value instanceof File) {
      fileUrl = URL.createObjectURL(value);
      setPreviewUrl(fileUrl);
    } else if (typeof value === 'string') {
      setPreviewUrl(value);
    } else {
      setPreviewUrl('');
    }

    return () => {
      if (fileUrl) {
        URL.revokeObjectURL(fileUrl);
      }
    };
  }, [value]);

  const handleVideoChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file && onChange) {
      onChange(e);
    }
  };

  return (
    <div className="inputWrapper">
      {label && (
        <label className={`mainLabel ${labelClassName || ''}`} htmlFor={id}>
          {label}
          {required && <span className="text-danger">*</span>}
        </label>
      )}

      <label htmlFor={id} className="videoUploader">
        {previewUrl ? (
          <video
            src={previewUrl}
            className={`uploadedVideo ${videoClassName || ''}`.trim()}
            controls
          />
        ) : (
          <div className="text-center">
            <img
              src={svgIcons.UploadIcon}
              className="mx-auto"
              alt="Upload Icon"
            />
            <p className="text-center">{placeholder}</p>
          </div>
        )}
      </label>

      <div className="d-none">
        <input
          name={name}
          id={id}
          type="file"
          accept="video/*"
          className="d-none"
          onChange={handleVideoChange}
        />
      </div>

      {error && <div className="text-danger">{error}</div>}
    </div>
  );
};

export default CustomVideoUploader;
