/**
 * Wraps an async function and handles any errors that occur during execution
 * @param {Function} fn - The async function to wrap
 * @returns {Function} Express middleware function
 */
module.exports = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};
