import { prisma } from '../db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from '../config/index.js';
import { sendEmail } from '../utils/email.js';

const SALT_ROUNDS = 10;
const RESET_TOKEN_EXP = '1h'; // 1 godzina

/**
 * Tworzy użytkownika, hashuje hasło i (opcjonalnie) przypisuje do szkoły.
 */
export async function registerUser({ email, password, name, schoolId }) {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    const err = new Error('Użytkownik o tym adresie już istnieje');
    err.statusCode = 400;
    throw err;
  }
  const hash = await bcrypt.hash(password, SALT_ROUNDS);
  const user = await prisma.user.create({
    data: {
      email,
      password: hash,
      name,
      schools: schoolId
        ? { create: { schoolId, role: 'ADMIN' } }
        : undefined
    },
    include: { schools: true }
  });
  return user;
}

/**
 * Weryfikuje e-mail i hasło, zwraca { user, token }.
 */
export async function authenticateUser({ email, password }) {
  const user = await prisma.user.findUnique({
    where: { email },
    include: { schools: true }
  });
  if (!user) {
    const err = new Error('Nieprawidłowy email lub hasło');
    err.statusCode = 401;
    throw err;
  }
  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    const err = new Error('Nieprawidłowy email lub hasło');
    err.statusCode = 401;
    throw err;
  }
  // payload JWT: userId, email, role, schoolIds
  const payload = {
    userId: user.id,
    email: user.email,
    role: user.role,
    schoolIds: user.schools.map(su => su.schoolId)
  };
  const token = jwt.sign(payload, config.jwtSecret, { expiresIn: '8h' });
  return { user, token };
}

/**
 * Generuje token resetu hasła i wysyła e-mail z linkiem.
 */
export async function sendPasswordReset(email) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    // zamiast ujawniać, że nie ma konta, odsyłamy OK
    return;
  }
  const token = jwt.sign(
    { userId: user.id },
    config.jwtSecret,
    { expiresIn: RESET_TOKEN_EXP }
  );
  const resetLink = `https://twoj-frontend/reset-password?token=${token}`;
  await sendEmail(
    email,
    'Reset hasła',
    `Kliknij w link, aby zresetować hasło: ${resetLink}`
  );
}

/**
 * Potwierdza reset: weryfikuje token, zmienia hasło.
 */
export async function confirmPasswordReset(token, newPassword) {
  let payload;
  try {
    payload = jwt.verify(token, config.jwtSecret);
  } catch {
    const err = new Error('Token resetujący nieważny lub wygasł');
    err.statusCode = 400;
    throw err;
  }
  const hash = await bcrypt.hash(newPassword, SALT_ROUNDS);
  await prisma.user.update({
    where: { id: payload.userId },
    data: { password: hash }
  });
}
