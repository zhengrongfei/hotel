export const REGEX = {
  CHARS_SPACE: /^(?=.*[a-zA-Z ])[a-zA-Z ]+$/,
  CHARS_NUMS: /^(?=.*[0-9])(?=.*[a-zA-Z])[a-zA-Z0-9]+$/,
  INT_POSITIVE: /^[0-9]+$/,
  INT: /^0$|^-?[1-9]\d*(\.\d+)?$/
}