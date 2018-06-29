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

/**
 * Convert from Camel Case string to Snake Case
 *
 * @param {string} words Camel case string
 * @returns {string} Snake case string
 */
export const toSnakeCase = words => {
  const replacer = $1 => "_" + $1.toLowerCase();
  const result = words.replace(/([A-Z])/g, replacer);
  const pattern = /_*/;

  if (pattern.test(result)) {
    return result.slice(1);
  }

  return result;
};
