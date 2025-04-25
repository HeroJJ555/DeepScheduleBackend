import jwt from 'jsonwebtoken';
import config from '../config/index.js';

export default function authMiddleware(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ error: 'Brak tokenu' });
  const [, token] = authHeader.split(' ');
  if (!token) return res.status(401).json({ error: 'Nieprawidłowy format tokenu' });
  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ error: 'Token nieważny lub przeterminowany' });
  }
}