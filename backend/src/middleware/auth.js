import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/index.js';

export default function authMiddleware(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Brak tokenu' });
  }
  const token = auth.slice(7);
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = { id: payload.userId, email: payload.email };
    //Debug console.log('Authenticated userId =', req.user.id);
    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Niepoprawny token' });
  }
}
