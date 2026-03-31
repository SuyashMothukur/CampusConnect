import { pool, query } from '../db.js';
import { sendError, sendOk } from '../utils/http.js';

export async function listCategories(req, res) {
  try {
    const rows = await query(
      `SELECT id, name, description FROM skill_category ORDER BY name ASC`
    );
    return sendOk(res, rows);
  } catch (err) {
    console.error('listCategories', err);
    return sendError(res, 500, 'Could not load categories.');
  }
}

export async function listOfferings(req, res) {
  try {
    const rows = await query(
      `SELECT so.id, so.user_id, so.category_id, so.title, so.description,
              so.rate_per_hour, so.is_active,
              sc.name AS category_name,
              up.display_name AS provider_name
       FROM skill_offering so
       JOIN skill_category sc ON sc.id = so.category_id
       JOIN user_profile up ON up.user_id = so.user_id
       ORDER BY so.id ASC`
    );
    return sendOk(res, rows);
  } catch (err) {
    console.error('listOfferings', err);
    return sendError(res, 500, 'Could not load offerings.');
  }
}

export async function getOffering(req, res) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) {
    return sendError(res, 400, 'Invalid offering id.');
  }
  try {
    const rows = await query(
      `SELECT so.id, so.user_id, so.category_id, so.title, so.description,
              so.rate_per_hour, so.is_active,
              sc.name AS category_name,
              up.display_name AS provider_name
       FROM skill_offering so
       JOIN skill_category sc ON sc.id = so.category_id
       JOIN user_profile up ON up.user_id = so.user_id
       WHERE so.id = ?`,
      [id]
    );
    if (!rows.length) {
      return sendError(res, 404, 'Offering not found.');
    }
    return sendOk(res, rows[0]);
  } catch (err) {
    console.error('getOffering', err);
    return sendError(res, 500, 'Could not load offering.');
  }
}

export async function createOffering(req, res) {
  const { user_id, category_id, title, description, rate_per_hour, is_active } = req.body || {};
  if (!Number.isInteger(Number(user_id)) || Number(user_id) < 1) {
    return sendError(res, 400, 'Valid user_id is required.');
  }
  if (!Number.isInteger(Number(category_id)) || Number(category_id) < 1) {
    return sendError(res, 400, 'Valid category_id is required.');
  }
  if (!title || typeof title !== 'string' || !title.trim()) {
    return sendError(res, 400, 'Title is required.');
  }
  const active = is_active === false || is_active === 0 ? 0 : 1;
  let rate = null;
  if (rate_per_hour !== undefined && rate_per_hour !== null && rate_per_hour !== '') {
    const n = Number(rate_per_hour);
    if (Number.isNaN(n) || n < 0) {
      return sendError(res, 400, 'rate_per_hour must be a non-negative number.');
    }
    rate = n;
  }

  try {
    const [result] = await pool.execute(
      `INSERT INTO skill_offering (user_id, category_id, title, description, rate_per_hour, is_active)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        user_id,
        category_id,
        title.trim(),
        description || null,
        rate,
        active,
      ]
    );
    const rows = await query(
      `SELECT so.id, so.user_id, so.category_id, so.title, so.description,
              so.rate_per_hour, so.is_active,
              sc.name AS category_name,
              up.display_name AS provider_name
       FROM skill_offering so
       JOIN skill_category sc ON sc.id = so.category_id
       JOIN user_profile up ON up.user_id = so.user_id
       WHERE so.id = ?`,
      [result.insertId]
    );
    return sendOk(res, rows[0], 201);
  } catch (err) {
    if (err.code === 'ER_NO_REFERENCED_ROW_2') {
      return sendError(res, 400, 'Invalid user or category reference.');
    }
    console.error('createOffering', err);
    return sendError(res, 500, 'Could not create offering.');
  }
}

export async function updateOffering(req, res) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) {
    return sendError(res, 400, 'Invalid offering id.');
  }
  const { user_id, category_id, title, description, rate_per_hour, is_active } = req.body || {};

  const fields = [];
  const vals = [];
  if (user_id !== undefined) {
    if (!Number.isInteger(Number(user_id)) || Number(user_id) < 1) {
      return sendError(res, 400, 'Invalid user_id.');
    }
    fields.push('user_id = ?');
    vals.push(user_id);
  }
  if (category_id !== undefined) {
    if (!Number.isInteger(Number(category_id)) || Number(category_id) < 1) {
      return sendError(res, 400, 'Invalid category_id.');
    }
    fields.push('category_id = ?');
    vals.push(category_id);
  }
  if (title !== undefined) {
    if (typeof title !== 'string' || !title.trim()) {
      return sendError(res, 400, 'Title cannot be empty.');
    }
    fields.push('title = ?');
    vals.push(title.trim());
  }
  if (description !== undefined) {
    fields.push('description = ?');
    vals.push(description);
  }
  if (rate_per_hour !== undefined) {
    if (rate_per_hour === null || rate_per_hour === '') {
      fields.push('rate_per_hour = NULL');
    } else {
      const n = Number(rate_per_hour);
      if (Number.isNaN(n) || n < 0) {
        return sendError(res, 400, 'rate_per_hour must be a non-negative number.');
      }
      fields.push('rate_per_hour = ?');
      vals.push(n);
    }
  }
  if (is_active !== undefined) {
    fields.push('is_active = ?');
    vals.push(is_active === false || is_active === 0 ? 0 : 1);
  }

  if (!fields.length) {
    return sendError(res, 400, 'No fields to update.');
  }

  vals.push(id);
  try {
    const [result] = await pool.execute(
      `UPDATE skill_offering SET ${fields.join(', ')} WHERE id = ?`,
      vals
    );
    if (result.affectedRows === 0) {
      return sendError(res, 404, 'Offering not found.');
    }
    const rows = await query(
      `SELECT so.id, so.user_id, so.category_id, so.title, so.description,
              so.rate_per_hour, so.is_active,
              sc.name AS category_name,
              up.display_name AS provider_name
       FROM skill_offering so
       JOIN skill_category sc ON sc.id = so.category_id
       JOIN user_profile up ON up.user_id = so.user_id
       WHERE so.id = ?`,
      [id]
    );
    return sendOk(res, rows[0]);
  } catch (err) {
    if (err.code === 'ER_NO_REFERENCED_ROW_2') {
      return sendError(res, 400, 'Invalid user or category reference.');
    }
    console.error('updateOffering', err);
    return sendError(res, 500, 'Could not update offering.');
  }
}

export async function deleteOffering(req, res) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) {
    return sendError(res, 400, 'Invalid offering id.');
  }
  try {
    const [result] = await pool.execute(`DELETE FROM skill_offering WHERE id = ?`, [id]);
    if (result.affectedRows === 0) {
      return sendError(res, 404, 'Offering not found.');
    }
    return sendOk(res, { deleted: true, id });
  } catch (err) {
    console.error('deleteOffering', err);
    return sendError(res, 500, 'Could not delete offering.');
  }
}
