import { prisma } from '../db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from '../config/index.js';
import { sendEmail } from '../utils/email.js';

const SALT_ROUNDS = 10;
const INVITATION_EXP = '7d'; // ważność linku zaproszenia

/**
 * Pobiera dane użytkownika wraz z przypisaniami do szkół.
 */
export async function getUserById(userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      schools: {
        select: {
          role: true,
          school: {
            select: { id: true, name: true }
          }
        }
      }
    }
  });
  if (!user) {
    const err = new Error('Użytkownik nie znaleziony');
    err.statusCode = 404;
    throw err;
  }
  return user;
}

/**
 * Aktualizuje dane aktualnego użytkownika (imię i/lub hasło).
 */
export async function updateUser(userId, { name, password }) {
  const data = {};
  if (name) data.name = name;
  if (password) {
    data.password = await bcrypt.hash(password, SALT_ROUNDS);
  }
  const user = await prisma.user.update({
    where: { id: userId },
    data,
    select: { id: true, email: true, name: true, role: true }
  });
  return user;
}

/**
 * Zaprasza istniejącego lub nowego użytkownika do szkoly.
 */
export async function inviteUser({ email, role, schoolId }, inviter) {
  // check czy user istnieje => jesli tak to: dodaj relacje
  const existing = await prisma.user.findUnique({ where: { email } });

  if (existing) {
    // check czy ma juz szkole
    const link = await prisma.schoolOnUser.findUnique({
      where: { userId_schoolId: { userId: existing.id, schoolId } }
    });
    if (link) {
      const err = new Error('Użytkownik już ma dostęp do tej placówki');
      err.statusCode = 400;
      throw err;
    }
    await prisma.schoolOnUser.create({
      data: { userId: existing.id, schoolId, role }
    });
    await sendEmail(
      email,
      'Zaproszenie do placówki',
      `Zostałeś dodany do placówki (ID: ${schoolId}) jako ${role}.`
    );
    return;
  }

  // Nowy user
  const token = jwt.sign({ email, role, schoolId }, config.jwtSecret, {
    expiresIn: INVITATION_EXP
  });
  const linkUrl = `https://twoj-frontend/register?inviteToken=${token}`;
  await sendEmail(
    email,
    'Zaproszenie do rejestracji',
    `Otrzymałeś zaproszenie do placówki (ID: ${schoolId}) jako ${role}.\n` +
    `Zarejestruj się, używając tego linku: ${linkUrl}`
  );
}