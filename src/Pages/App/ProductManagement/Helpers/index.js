export const availabilityTextFormatter = (text) => {
  console.log('text', text);
  if (text) {
    return text
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (char) => char.toUpperCase());
  }
  return '';
};
