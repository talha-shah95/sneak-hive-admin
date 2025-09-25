import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';

import useModalStore from '../../Store/ModalStore';
import CustomButton from '../CustomButton';

import { images } from '../../assets/images';

import './style.css';
import { PulseLoader } from 'react-spinners';
import { FaTimes } from 'react-icons/fa';

const typeConfig = {
  success: {
    variant: 'success',
    icon: images.modalTick,
  },
  question: {
    variant: 'question',
    icon: images.modalQuestion,
  },
  info: {
    variant: 'info',
    icon: images.modalCaution,
  },
};

const CustomModal = () => {
  const {
    isOpen,
    type,
    modalProps: {
      title,
      message,
      continueText,
      cancelText,
      onContinue,
      onCancel,
      showImage = true,
      hideClose = false,
      children,
    },
    closeModal,
  } = useModalStore();

  // const config = typeConfig[type] || typeConfig['info'];
  const config = typeConfig[type];
  const [isLoading, setIsLoading] = useState(false);

  const handleClose = async () => {
    if (onCancel) {
      await onCancel();
    }
    closeModal();
  };

  const handleContinue = async () => {
    setIsLoading(true);
    try {
      if (onContinue) {
        await onContinue();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
      // closeModal();
    }
  };

  return (
    <Modal
      show={isOpen}
      centered
      onHide={closeModal}
      aria-modal="true"
      role="dialog"
    >
      {!hideClose && (
        <div>
          <div className="d-flex justify-content-end">
            <button
              className="closeButton notButton rounded-circle flexCentered mt-2 me-2 p-1"
              onClick={closeModal}
            >
              <FaTimes size={20} />
            </button>
          </div>
        </div>
      )}
      <Modal.Body className={`mb-3 text-center`}>
        {children ? (
          <div className={`modalInputs ${hideClose ? 'pt-4' : ''}`}>
            {showImage && (
              <div className="text-center d-flex justify-content-center">
                <div className="modalImageWrapper rounded-circle flexCentered">
                  <img src={config?.icon} alt="" loading="lazy" />
                </div>
              </div>
            )}
            {title && (
              <div className="pt-3 text-center">
                <h4 className="modalTitle text-uppercase">{title}</h4>
              </div>
            )}
            {children}
          </div>
        ) : (
          <div
            className={`flexCentered flex-column ${hideClose ? 'pt-4' : ''}`}
          >
            {showImage && (
              <div className="text-center d-flex justify-content-center">
                <div className="modalImageWrapper rounded-circle flexCentered">
                  <img src={config?.icon} alt="" loading="lazy" />
                </div>
              </div>
            )}
            <div className="modalContent">
              {title && (
                <div className="pt-3 text-center">
                  <h4 className="modalTitle text-uppercase">{title}</h4>
                </div>
              )}
              {message && <p className="modalText">{message}</p>}
            </div>
            {isLoading ? (
              <div className="d-flex justify-content-center">
                <PulseLoader
                  size={8}
                  color={'var(--primaryColor)'}
                  style={{ height: 22 }}
                />
              </div>
            ) : (
              <>
                {(continueText || cancelText) && (
                  <div className="d-flex align-content-center justify-content-center pt-3 gap-2">
                    {continueText && (
                      <CustomButton
                        type="button"
                        // className="modal-btn"
                        variant={'primary'}
                        text={continueText}
                        onClick={handleContinue}
                        loading={isLoading}
                        disabled={isLoading}
                      />
                    )}
                    {cancelText && (
                      <CustomButton
                        type="button"
                        text={cancelText}
                        variant={'secondary'}
                        // className="modalSecondaryButton modal-btn"
                        onClick={handleClose}
                        loading={isLoading}
                        disabled={isLoading}
                      />
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default CustomModal;
