import bcrypt from 'bcrypt';
import { pool, query } from '../db.js';
import { sendError, sendOk } from '../utils/http.js';
import { signToken } from '../middleware/auth.js';

const SALT_ROUNDS = 12;

// POST /api/auth/signup
export async function signup(req, res) {
  const { email, password, display_name, bio, campus, major } = req.body || {};

  if (!email || typeof email !== 'string' || !email.trim())
    return sendError(res, 400, 'Email is required.');
  if (!password || typeof password !== 'string' || password.length < 8)
    return sendError(res, 400, 'Password must be at least 8 characters.');
  if (!display_name || typeof display_name !== 'string' || !display_name.trim())
    return sendError(res, 400, 'Display name is required.');

  const password_hash = await bcrypt.hash(password, SALT_ROUNDS);
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const [result] = await connection.execute(
      `INSERT INTO user_account (email, password_hash, role) VALUES (?, ?, 'student')`,
      [email.trim().toLowerCase(), password_hash]
    );
    const userId = result.insertId;
    await connection.execute(
      `INSERT INTO user_profile (user_id, display_name, bio, campus, major) VALUES (?, ?, ?, ?, ?)`,
      [userId, display_name.trim(), bio || null, campus || null, major || null]
    );
    await connection.commit();

    const rows = await query(
      `SELECT ua.id, ua.email, ua.role, up.display_name, up.bio, up.campus, up.major
       FROM user_account ua JOIN user_profile up ON up.user_id = ua.id WHERE ua.id = ?`,
      [userId]
    );
    const user = rows[0];
    const token = signToken({ id: user.id, email: user.email, role: user.role });
    return sendOk(res, { token, user }, 201);
  } catch (err) {
    await connection.rollback();
    if (err.code === 'ER_DUP_ENTRY') return sendError(res, 409, 'That email is already registered.');
    console.error('signup', err);
    return sendError(res, 500, 'Could not create account.');
  } finally {
    connection.release();
  }
}

// POST /api/auth/login
export async function login(req, res) {
  const { email, password } = req.body || {};
  if (!email || !password) return sendError(res, 400, 'Email and password are required.');

  try {
    const rows = await query(
      `SELECT ua.id, ua.email, ua.password_hash, ua.role, up.display_name
       FROM user_account ua LEFT JOIN user_profile up ON up.user_id = ua.id
       WHERE ua.email = ?`,
      [email.trim().toLowerCase()]
    );
    if (!rows.length) return sendError(res, 401, 'Invalid email or password.');

    const user = rows[0];
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return sendError(res, 401, 'Invalid email or password.');

    const token = signToken({ id: user.id, email: user.email, role: user.role });
    return sendOk(res, {
      token,
      user: { id: user.id, email: user.email, role: user.role, display_name: user.display_name },
    });
  } catch (err) {
    console.error('login', err);
    return sendError(res, 500, 'Login failed.');
  }
}

// POST /api/auth/logout  (client just drops the token, this is a confirmation endpoint)
export async function logout(req, res) {
  return sendOk(res, { message: 'Logged out successfully.' });
}

// POST /api/auth/change-password  (requires auth)
export async function changePassword(req, res) {
  const { current_password, new_password } = req.body || {};
  if (!current_password || !new_password)
    return sendError(res, 400, 'Current and new password are required.');
  if (new_password.length < 8)
    return sendError(res, 400, 'New password must be at least 8 characters.');

  try {
    const rows = await query(
      `SELECT id, password_hash FROM user_account WHERE id = ?`,
      [req.user.id]
    );
    if (!rows.length) return sendError(res, 404, 'User not found.');

    const match = await bcrypt.compare(current_password, rows[0].password_hash);
    if (!match) return sendError(res, 401, 'Current password is incorrect.');

    const new_hash = await bcrypt.hash(new_password, SALT_ROUNDS);
    await query(`UPDATE user_account SET password_hash = ? WHERE id = ?`, [new_hash, req.user.id]);
    return sendOk(res, { message: 'Password updated successfully.' });
  } catch (err) {
    console.error('changePassword', err);
    return sendError(res, 500, 'Could not update password.');
  }
}

// GET /api/auth/me  (returns current user info from token)
export async function me(req, res) {
  try {
    const rows = await query(
      `SELECT ua.id, ua.email, ua.role, ua.created_at, up.display_name, up.bio, up.campus, up.major
       FROM user_account ua LEFT JOIN user_profile up ON up.user_id = ua.id WHERE ua.id = ?`,
      [req.user.id]
    );
    if (!rows.length) return sendError(res, 404, 'User not found.');
    return sendOk(res, rows[0]);
  } catch (err) {
    console.error('me', err);
    return sendError(res, 500, 'Could not load user.');
  }
}
