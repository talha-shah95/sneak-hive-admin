/* eslint-disable react-refresh/only-export-components */
import React from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./style.css";

const CustomToast = () => {
  return (
    <ToastContainer
      theme="light"
      pauseOnHover
      position="top-right"
      toastClassName={"customToast"}
    />
  );
};

export const showToast = (message, type) => {
  if (type == "success") {
    toast.success(message);
  } else if (type == "error") {
    toast.error(message);
  } else if (type == "info") {
    toast.info(message);
  } else {
    toast(message);
  }
};

export default CustomToast;
