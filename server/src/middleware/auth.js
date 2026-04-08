import jwt from 'jsonwebtoken';
import { sendError } from '../utils/http.js';

const JWT_SECRET = process.env.JWT_SECRET || 'campusconnect-dev-secret-change-in-prod';

export function requireAuth(req, res, next) {
  const header = req.headers['authorization'] || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return sendError(res, 401, 'Not authenticated.');
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    return sendError(res, 401, 'Session expired or invalid. Please log in again.');
  }
}

export function requireAdmin(req, res, next) {
  if (!req.user) return sendError(res, 401, 'Not authenticated.');
  if (req.user.role !== 'admin') return sendError(res, 403, 'Admin access required.');
  next();
}

export function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '8h' });
}
