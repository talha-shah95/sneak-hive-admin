export const generatePromoCode = ({
  lettersCount,
  digitsCount,
  withHyphen = false,
}) => {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const digits = '0123456789';

  const getRandomChars = (source, length) =>
    Array.from({ length }, () =>
      source.charAt(Math.floor(Math.random() * source.length))
    ).join('');

  const randomLetters = getRandomChars(letters, lettersCount);
  const randomDigits = getRandomChars(digits, digitsCount);

  return withHyphen
    ? `${randomLetters}-${randomDigits}`
    : randomLetters + randomDigits;
};
