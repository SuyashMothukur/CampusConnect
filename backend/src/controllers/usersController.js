import bcrypt from 'bcrypt';
import { pool, query } from '../db.js';
import { sendError, sendOk } from '../utils/http.js';

const SALT_ROUNDS = 12;

export async function listUsers(req, res) {
  try {
    const rows = await query(
      `SELECT ua.id, ua.email, ua.role, ua.created_at,
              up.display_name, up.bio, up.campus, up.major
       FROM user_account ua
       LEFT JOIN user_profile up ON up.user_id = ua.id
       ORDER BY ua.id ASC`
    );
    return sendOk(res, rows);
  } catch (err) {
    console.error('listUsers', err);
    return sendError(res, 500, 'Could not load users.');
  }
}

export async function getUser(req, res) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) {
    return sendError(res, 400, 'Invalid user id.');
  }
  try {
    const rows = await query(
      `SELECT ua.id, ua.email, ua.role, ua.created_at,
              up.display_name, up.bio, up.campus, up.major
       FROM user_account ua
       LEFT JOIN user_profile up ON up.user_id = ua.id
       WHERE ua.id = ?`,
      [id]
    );
    if (!rows.length) {
      return sendError(res, 404, 'User not found.');
    }
    return sendOk(res, rows[0]);
  } catch (err) {
    console.error('getUser', err);
    return sendError(res, 500, 'Could not load user.');
  }
}

export async function createUser(req, res) {
  const { email, password, display_name, bio, campus, major, role } = req.body || {};
  if (!email || typeof email !== 'string' || !email.trim()) {
    return sendError(res, 400, 'Email is required.');
  }
  if (!password || typeof password !== 'string' || !password.length) {
    return sendError(res, 400, 'Password is required.');
  }
  if (!display_name || typeof display_name !== 'string' || !display_name.trim()) {
    return sendError(res, 400, 'Display name is required.');
  }
  const safeRole = role === 'admin' ? 'admin' : 'student';
  const password_hash = await bcrypt.hash(password, SALT_ROUNDS);

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const [result] = await connection.execute(
      `INSERT INTO user_account (email, password_hash, role) VALUES (?, ?, ?)`,
      [email.trim().toLowerCase(), password_hash, safeRole]
    );
    const userId = result.insertId;
    await connection.execute(
      `INSERT INTO user_profile (user_id, display_name, bio, campus, major)
       VALUES (?, ?, ?, ?, ?)`,
      [
        userId,
        display_name.trim(),
        bio || null,
        campus || null,
        major || null,
      ]
    );
    await connection.commit();
    const rows = await query(
      `SELECT ua.id, ua.email, ua.role, ua.created_at,
              up.display_name, up.bio, up.campus, up.major
       FROM user_account ua
       JOIN user_profile up ON up.user_id = ua.id
       WHERE ua.id = ?`,
      [userId]
    );
    return sendOk(res, rows[0], 201);
  } catch (err) {
    await connection.rollback();
    if (err.code === 'ER_DUP_ENTRY') {
      return sendError(res, 409, 'That email is already registered.');
    }
    console.error('createUser', err);
    return sendError(res, 500, 'Could not create user.');
  } finally {
    connection.release();
  }
}

export async function updateUser(req, res) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) {
    return sendError(res, 400, 'Invalid user id.');
  }
  const { email, password, display_name, bio, campus, major, role } = req.body || {};
  if (email !== undefined && (typeof email !== 'string' || !email.trim())) {
    return sendError(res, 400, 'Email cannot be empty.');
  }
  if (display_name !== undefined && (typeof display_name !== 'string' || !display_name.trim())) {
    return sendError(res, 400, 'Display name cannot be empty.');
  }

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const [existing] = await connection.execute(
      `SELECT id FROM user_account WHERE id = ?`,
      [id]
    );
    if (!existing.length) {
      await connection.rollback();
      return sendError(res, 404, 'User not found.');
    }

    if (email || password || role) {
      const fields = [];
      const vals = [];
      if (email) {
        fields.push('email = ?');
        vals.push(email.trim().toLowerCase());
      }
      if (password) {
        fields.push('password_hash = ?');
        vals.push(await bcrypt.hash(password, SALT_ROUNDS));
      }
      if (role) {
        fields.push('role = ?');
        vals.push(role === 'admin' ? 'admin' : 'student');
      }
      if (fields.length) {
        vals.push(id);
        await connection.execute(
          `UPDATE user_account SET ${fields.join(', ')} WHERE id = ?`,
          vals
        );
      }
    }

    if (
      display_name !== undefined ||
      bio !== undefined ||
      campus !== undefined ||
      major !== undefined
    ) {
      const pFields = [];
      const pVals = [];
      if (display_name !== undefined) {
        pFields.push('display_name = ?');
        pVals.push(display_name.trim());
      }
      if (bio !== undefined) {
        pFields.push('bio = ?');
        pVals.push(bio);
      }
      if (campus !== undefined) {
        pFields.push('campus = ?');
        pVals.push(campus);
      }
      if (major !== undefined) {
        pFields.push('major = ?');
        pVals.push(major);
      }
      if (pFields.length) {
        pVals.push(id);
        await connection.execute(
          `UPDATE user_profile SET ${pFields.join(', ')} WHERE user_id = ?`,
          pVals
        );
      }
    }

    await connection.commit();
    const rows = await query(
      `SELECT ua.id, ua.email, ua.role, ua.created_at,
              up.display_name, up.bio, up.campus, up.major
       FROM user_account ua
       LEFT JOIN user_profile up ON up.user_id = ua.id
       WHERE ua.id = ?`,
      [id]
    );
    return sendOk(res, rows[0]);
  } catch (err) {
    await connection.rollback();
    if (err.code === 'ER_DUP_ENTRY') {
      return sendError(res, 409, 'That email is already in use.');
    }
    console.error('updateUser', err);
    return sendError(res, 500, 'Could not update user.');
  } finally {
    connection.release();
  }
}

export async function deleteUser(req, res) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) {
    return sendError(res, 400, 'Invalid user id.');
  }
  try {
    const [result] = await pool.execute(`DELETE FROM user_account WHERE id = ?`, [id]);
    if (result.affectedRows === 0) {
      return sendError(res, 404, 'User not found.');
    }
    return sendOk(res, { deleted: true, id });
  } catch (err) {
    console.error('deleteUser', err);
    return sendError(res, 500, 'Could not delete user.');
  }
}
