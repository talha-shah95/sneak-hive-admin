import React, { useEffect, useState } from 'react';

import { showToast } from '../CustomToast';

import { images } from '../../assets/images';
import { svgIcons } from '../../assets/images';

import { RiCloseLine } from 'react-icons/ri';

import './style.css';

const CustomMultiImageUploader = ({
  label,
  labelClassName,
  imageClassName,
  id,
  name,
  required,
  error,
  value,
  onChange,
  placeholder = 'Upload Image',
  maxImages = 3,
}) => {
  const [uploadedImages, setUploadedImages] = useState([]);

  useEffect(() => {
    if (value) {
      setUploadedImages(value);
    }
  }, [value]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (uploadedImages.length >= maxImages) {
        showToast(`You can only upload ${maxImages} images`, 'error');
        return;
      } else {
        const tempImages = [...uploadedImages];
        tempImages.push(file);
        // setUploadedImages();
        onChange && onChange(tempImages);
      }
    }
  };

  const handleRemoveImage = (e, index) => {
    e.stopPropagation();
    const updatedValue = uploadedImages.filter((_, i) => i !== index);
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
      <div className="row mt-2">
        {uploadedImages &&
          uploadedImages.length > 0 &&
          uploadedImages?.map((image, index) => (
            <div className="col-4" key={index}>
              <div className="position-relative rounded mb-2" key={index}>
                <div className="squareImageWrapper">
                  <img
                    src={
                      image
                        ? image?.media_path || URL.createObjectURL(image)
                        : images.userPlaceholder
                    }
                    alt={id}
                    className={`uploadedImage squareImage ${imageClassName}`}
                  />
                </div>
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

      <div className="d-none">
        <input
          name={name}
          id={id}
          type="file"
          multiple
          accept="image/*"
          className="d-none"
          onChange={handleImageChange}
        />
      </div>
      {error && <div className="text-danger">{error}</div>}
    </div>
  );
};

export default CustomMultiImageUploader;
