/**
 * Parse page/limit from a query string with sane bounds.
 * @param {object} query - req.query
 * @param {object} [options]
 * @param {number} [options.defaultLimit=20]
 * @param {number} [options.maxLimit=100]
 * @returns {{ page: number, limit: number, skip: number }}
 */
const getPagination = (query, { defaultLimit = 20, maxLimit = 100 } = {}) => {
  const page = Math.max(parseInt(query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(query.limit, 10) || defaultLimit, 1), maxLimit);
  return { page, limit, skip: (page - 1) * limit };
};

module.exports = { getPagination };
