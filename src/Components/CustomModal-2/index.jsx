import React from 'react';
import { Modal } from 'react-bootstrap';

import CustomButton from '../CustomButton';
import { images } from '../../assets/images';

import './style.css';

const CustomModal = ({
  show,
  size,
  close,
  success,
  showReason,
  noButton,
  alert,
  heading,
  para,
  reasonLabel,
  reasonPlaceholder,
  errorMessage,
  children,
  action,
  btnText,
  onChangeModal,
  value,
  loading,
}) => {
  return (
    <Modal
      className="site-modal"
      show={show}
      size={size}
      centered
      onHide={close}
    >
      <button className="closeButton" onClick={close}>
        <img src={images.modalCloseCross} alt="close" className="mb-0" />
      </button>
      <Modal.Body className="text-center">
        {success ? (
          <img src={images.modalTick} alt="check" className="modal-icon mb-0" />
        ) : showReason || noButton ? (
          ''
        ) : alert ? (
          <img
            src={images.modalCaution}
            alt="alert"
            className="modal-icon mb-0"
          />
        ) : (
          <img
            src={images.modalQuestion}
            alt="question"
            className="modal-icon mb-0"
          />
        )}
        <div className="modalContent">
          {heading && (
            <h2 className="modalHeading">{showReason ? '' : heading}</h2>
          )}
          {para && <p className="modalpara">{para}</p>}
          {showReason && (
            <div className="modalReason my-3 text-start">
              <label className="mainLabel">{reasonLabel}</label>
              <textarea
                className="mainInput"
                placeholder={reasonPlaceholder}
                rows="4"
                onChange={onChangeModal}
                value={value}
              ></textarea>
              {errorMessage && (
                <p className="text-danger">{errorMessage}</p> // Display error message
              )}
            </div>
          )}
          {children}
          {success ? (
            <CustomButton
              onClick={close}
              className="btnBlueBG px-5"
              text="Ok"
            />
          ) : showReason ? (
            <div className="d-flex align-items-center mt-4 justify-content-center gap-2">
              <CustomButton
                onClick={action} // Ensure this is a function
                variant="btnBlueBG"
                text={btnText}
              />
              <CustomButton
                onClick={close}
                variant="btngrayBG ms-2 px-5"
                className="secondaryButton"
                text="Cancel"
              />
            </div>
          ) : alert ? (
            <>
              <CustomButton
                onClick={close}
                className="btnBlueBG px-5"
                text="Ok"
              />
            </>
          ) : noButton ? (
            ''
          ) : (
            <div className="d-flex align-items-center mt-4 justify-content-center gap-2">
              <CustomButton
                onClick={action} // Ensure this is a function
                variant="btnBlueBG px-5"
                disabled={loading}
                text={loading ? 'Loading...' : 'Yes'} // ✅ Toggle based on loading
                className="me-2"
              />
              <CustomButton
                onClick={close}
                variant="btngrayBG px-5"
                className="secondaryButton"
                text="No"
              />
            </div>
          )}
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default CustomModal;
