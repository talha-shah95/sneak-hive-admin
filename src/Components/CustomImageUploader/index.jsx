import React from 'react';

import { images } from '../../assets/images';
import { svgIcons } from '../../assets/images';

import './style.css';
import { RiCloseLine } from 'react-icons/ri';
import { showToast } from '../CustomToast';

const CustomImageUploader = ({
  label,
  labelClassName,
  imageClassName,
  id,
  name,
  required,
  error,
  value,
  onChange,
  multiple = false,
  placeholder = 'Upload Image',
  maxImages = 3,
}) => {
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      onChange && onChange(e);
    }
  };
  const handleImageChangeMultiple = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > maxImages) {
      showToast(`You can only upload ${maxImages} images`, 'error');
      return;
    }
    if (files.length > 0) {
      onChange && onChange(files);
    }
  };

  const handleRemoveImage = (e, index) => {
    e.stopPropagation();
    const updatedValue = value.filter((_, i) => i !== index);
    onChange && onChange(updatedValue);
  };

  return (
    <div className="inputWrapper">
      {label && (
        <label className={`mainLabel ${labelClassName}`} htmlFor={id}>
          {label}
          {required && <span className="text-danger">*</span>}
        </label>
      )}
      {multiple ? (
        <div className="row mt-2">
          {value &&
            value.length > 0 &&
            value?.map((image, index) => (
              <div className="col-4" key={index}>
                <div
                  className="position-relative squareImageWrapper .rounded mb-2"
                  key={index}
                >
                  <img
                    src={
                      image
                        ? URL.createObjectURL(image)
                        : images.userPlaceholder
                    }
                    alt={id}
                    className={`uploadedImage squareImage ${imageClassName}`}
                  />
                  <div
                    className="removeImage position-absolute top-0 end-0"
                    onClick={(e) => handleRemoveImage(e, index)}
                  >
                    <RiCloseLine
                      size={20}
                      className="cursor-pointer bgRed colorWhite rounded-circle p-1"
                    />
                  </div>
                </div>
              </div>
            ))}
          <div className="col-12">
            <label htmlFor={id} className="imageUploader">
              <div className="text-center">
                <img
                  src={svgIcons.UploadIcon}
                  className="mx-auto"
                  alt="Upload Icon"
                />
                <p className="text-center">{placeholder}</p>
              </div>
            </label>
          </div>
        </div>
      ) : (
        <>
          <label htmlFor={id} className="imageUploader">
            {value ? (
              <>
                <img
                  src={
                    typeof value === 'string' ? value : value ? URL.createObjectURL(value) : images.userPlaceholder
                  }
                  // src={images.userPlaceholder}
                  alt={id}
                  className={`uploadedImage ${imageClassName}`}
                />
              </>
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
        </>
      )}

      <div className="d-none">
        <input
          name={name}
          id={id}
          type="file"
          multiple={multiple}
          accept="image/*"
          className="d-none"
          onChange={multiple ? handleImageChangeMultiple : handleImageChange}
        />
      </div>
      {error && <div className="text-danger">{error}</div>}
    </div>
  );
};

export default CustomImageUploader;
