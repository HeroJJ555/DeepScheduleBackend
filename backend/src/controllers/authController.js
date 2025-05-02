import * as authService from "../services/authService.js";
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/index.js';

const prisma = new PrismaClient();
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
    const { email, password } = req.body;

    // Znajdź użytkownika po emailu
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Nieprawidłowe dane logowania' });
    }

    // Sprawdź hasło
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ error: 'Nieprawidłowe dane logowania' });
    }

    // Wygeneruj token JWT z userId
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '8h' }
    );

    // Zwróć token i podstawowe dane użytkownika
    return res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      }
    });
  } catch (err) {
    next(err);
  }
}
/**
 * POST /auth/password-reset/request
 */
export async function passwordResetRequest(req, res, next) {
  try {
    await authService.sendPasswordReset(req.body.email);
    res.json({
      message: "Jeśli konto istnieje, wysłaliśmy link do resetu hasła",
    });
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
    res.json({ message: "Hasło zostało pomyślnie zresetowane" });
  } catch (e) {
    next(e);
  }
}
