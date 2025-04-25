import * as userService from '../services/userService.js';

/**
 * GET /users/me
 */
export async function getMe(req, res, next) {
  try {
    const user = await userService.getUserById(req.user.userId);
    res.json(user);
  } catch (e) {
    next(e);
  }
}

/**
 * PUT /users/me
 */
export async function updateMe(req, res, next) {
  try {
    const user = await userService.updateUser(req.user.userId, req.body);
    res.json(user);
  } catch (e) {
    next(e);
  }
}

/**
 * POST /users/invite
 */
export async function inviteUser(req, res, next) {
  try {
    await userService.inviteUser(req.body, req.user);
    res.json({ message: 'Zaproszenie wysłane' });
  } catch (e) {
    next(e);
  }
}