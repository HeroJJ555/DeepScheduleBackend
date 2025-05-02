import { getUserById, updateUser, inviteUser } from '../services/userService.js';

/** GET /users/me */
export async function getMe(req, res, next) {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: 'Brak tokenu' });
    const user = await getUserById(userId);
    return res.json(user);
  } catch (err) {
    next(err);
  }
}

/** PUT /users/me */
export async function updateMe(req, res, next) {
  try {
    // Używaj req.user.id a nie req.user.userId
    const updated = await updateUser(req.user.id, req.body);
    res.json(updated);
  } catch (e) {
    next(e);
  }
}

/** POST /users/invite */
export async function inviteUserController(req, res, next) {
  try {
    await inviteUser(req.body, req.user);
    res.json({ message: 'Zaproszenie wysłane' });
  } catch (e) {
    next(e);
  }
}
