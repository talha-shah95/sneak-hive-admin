import React, { useState } from "react";
import CustomModal from "../Components/CustomModal";
import { useNavigate } from "react-router-dom";

const MODAL_STEPS = {
  INITIAL: 0,
  REASON_INPUT: 1,
  SUCCESS: 2,
};

const withModal = (WrappedComponent) => {
  return (props) => {
    console.log("WrappedComponent", WrappedComponent);
    const [modalState, setModalState] = useState({
      currentStep: MODAL_STEPS.INITIAL,
      show: false,
      success: false,
      heading: "",
      action: null,
      showReason: false,
      reasonValue: "",
      errorMessage: "",
      alert: false,
      isLoading: false, // ✅ Add this
    });

    const navigate = useNavigate();

    const reasonModal = (
      heading,
      action,
      success = false,
      showReason = false,
      // eslint-disable-next-line no-unused-vars
      navigateTo = null
    ) => {
      setModalState({
        currentStep: MODAL_STEPS.INITIAL,
        show: true,
        success,
        heading,
        action,
        showReason,
        reasonValue: "",
        errorMessage: "",
        // navigateTo
      });
    };

    const showModal = (
      heading,
      action,
      success = false,
      navigateTo = null,
      navigateState = null,
      alert = false
    ) => {
      setModalState({
        heading,
        action,
        success,
        show: true,
        navigateTo,
        navigateState,
        alert,
      });
    };

    const handleModalClose = () => {
      // Store navigation info before updating state to avoid timing issues
      const { navigateTo, navigateState } = modalState;

      // Close the modal
      setModalState((prev) => ({ ...prev, show: false, action: null }));

      // Navigate if a destination is provided
      if (navigateTo) {
        // Add a small delay to ensure the modal is closed before navigation
        setTimeout(() => {
          navigate(navigateTo, {
            state: navigateState,
          });
        }, 100);
      }
    };

    const handleReasonChange = (e) => {
      setModalState((prev) => ({
        ...prev,
        reasonValue: e.target.value,
        errorMessage: "",
      }));
    };

    const handleSubmit = () => {
      if (modalState.currentStep === MODAL_STEPS.INITIAL) {
        setModalState((prev) => ({
          ...prev,
          currentStep: MODAL_STEPS.REASON_INPUT,
        }));
      } else if (modalState.currentStep === MODAL_STEPS.REASON_INPUT) {
        if (modalState.reasonValue.trim() === "") {
          setModalState((prev) => ({
            ...prev,
            errorMessage: "Reason is required.",
          }));
          return;
        }
        if (modalState.action) {
          modalState.action(modalState.reasonValue);
        }
        setModalState((prev) => ({
          ...prev,
          currentStep: MODAL_STEPS.SUCCESS,
        }));
      }
    };

    const handleAction = async () => {
      try {
        setModalState((prev) => ({ ...prev, isLoading: true }));

        if (modalState.showReason) {
          handleSubmit(); // this handles reason + validation + calling action
        } else if (modalState.action) {
          await modalState.action(); // ✅ This should return a Promise
        }
      } catch (err) {
        console.error("Error in handleAction", err);
      } finally {
        setModalState((prev) => ({ ...prev, isLoading: false }));
      }
    };
    return (
      <>
        <WrappedComponent
          {...props}
          showModal={showModal}
          reasonModal={reasonModal}
        />
        <CustomModal
          show={modalState.show}
          close={handleModalClose}
          action={handleAction}
          heading={modalState.heading}
          success={modalState.success}
          showReason={modalState.currentStep === MODAL_STEPS.REASON_INPUT}
          onChange={handleReasonChange}
          value={modalState.reasonValue}
          reasonLabel={"Please provide a reason"}
          reasonPlaceholder={"Enter reason here..."}
          btnText={"Submit"}
          errorMessage={modalState.errorMessage}
          alert={modalState.alert}
          loading={modalState.isLoading} // ✅ Pass loading to modal
        />
      </>
    );
  };
};

export default withModal;
