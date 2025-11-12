'use strict';

/**
 * Computes skip/limit and builds pagination metadata.
 */

// PUBLIC_INTERFACE
function getPagination(page = 1, limit = 20) {
  /** Returns skip and limit values for Mongo queries. */
  const safePage = Math.max(1, Number(page) || 1);
  const safeLimit = Math.min(100, Math.max(1, Number(limit) || 20));
  const skip = (safePage - 1) * safeLimit;
  return { skip, limit: safeLimit, page: safePage };
}

// PUBLIC_INTERFACE
function buildPageMeta(total, page, limit) {
  /** Builds pagination meta object. */
  const pages = Math.max(1, Math.ceil(total / limit));
  return {
    total,
    page,
    limit,
    pages,
    hasNext: page < pages,
    hasPrev: page > 1,
  };
}

module.exports = { getPagination, buildPageMeta };
