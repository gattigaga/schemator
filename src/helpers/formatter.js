/**
 * Make capital string
 *
 * @param {string} words String you want to capitalize
 * @returns {string} Capitalized string
 */
export const capitalize = words =>
  words.charAt(0).toUpperCase() + words.substr(1);

/**
 * Change label field type into Laravel migration field type
 *
 * @param {string} type Field type
 * @returns {string} Laravel field type
 */
export const convertType = type => {
  const camelize = (word, index) => {
    if (index > 0) {
      return capitalize(word);
    }

    return word;
  };

  const result = type
    .toLowerCase()
    .split("_")
    .map(camelize)
    .join("");

  return result;
};
