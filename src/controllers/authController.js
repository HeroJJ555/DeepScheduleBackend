import * as authService from '../services/authService.js';

/**
 * POST /auth/register
 */
export async function register(req, res, next) {
  try {
    const user = await authService.registerUser(req.body);
    // nie odsyłamy hasła
    res.status(201).json({ id: user.id, email: user.email, name: user.name });
  } catch (e) {
    next(e);
  }
}

/**
 * POST /auth/login
 */
export async function login(req, res, next) {
  try {
    const { user, token } = await authService.authenticateUser(req.body);
    res.json({
      token,
      user: { id: user.id, email: user.email, name: user.name, role: user.role }
    });
  } catch (e) {
    next(e);
  }
}

/**
 * POST /auth/password-reset/request
 */
export async function passwordResetRequest(req, res, next) {
  try {
    await authService.sendPasswordReset(req.body.email);
    res.json({ message: 'Jeśli konto istnieje, wysłaliśmy link do resetu hasła' });
  } catch (e) {
    next(e);
  }
}

/**
 * POST /auth/password-reset/confirm
 */
export async function passwordResetConfirm(req, res, next) {
  try {
    const { token, newPassword } = req.body;
    await authService.confirmPasswordReset(token, newPassword);
    res.json({ message: 'Hasło zostało pomyślnie zresetowane' });
  } catch (e) {
    next(e);
  }
}
