export const splitStringToArray = (value: string, separator: string = " ") => {
  if (value === "undefined" || value === "null") return [];
  return value.split(separator);
};
