/**
 * Check whether the requesting user owns a resource or is an admin.
 * @param {ObjectId|string} resourceUserId - The user id stored on the resource.
 * @param {object} user - The authenticated user (req.user).
 * @returns {boolean}
 */
const isOwnerOrAdmin = (resourceUserId, user) =>
  resourceUserId.toString() === user.id || user.role === 'admin';

module.exports = { isOwnerOrAdmin };
