// export const imageTypes = ["png", "jpg", "jpeg", "webp", "gif"];
// export const documentTypes = ["pdf", "txt", "json"];

import moment from "moment-timezone";

export const isNullOrEmpty = (variable) => {
  return (
    variable == null ||
    variable == undefined ||
    variable == "" ||
    (Array.isArray(variable) && variable.length == 0) || // Check if it's an empty array
    (typeof variable == "object" &&
      !Array.isArray(variable) &&
      Object.keys(variable).length === 0) // Check if it's an empty object (and not an array)
  );
};

export const dateFormat = (data) => {
  if (data) {
    return moment(data).local().format("MM/DD/YYYY");
  } else {
    return "-";
  }
};