import { pool, query } from '../db.js';
import { sendError, sendOk } from '../utils/http.js';

export async function listReviews(req, res) {
  try {
    const rows = await query(
      `SELECT r.id, r.session_id, r.reviewer_id, r.reviewee_id, r.rating, r.comment, r.created_at,
              rev.display_name AS reviewer_name,
              revw.display_name AS reviewee_name,
              s.scheduled_at AS session_scheduled_at,
              s.status AS session_status
       FROM review r
       JOIN user_profile rev ON rev.user_id = r.reviewer_id
       JOIN user_profile revw ON revw.user_id = r.reviewee_id
       JOIN session s ON s.id = r.session_id
       ORDER BY r.id ASC`
    );
    return sendOk(res, rows);
  } catch (err) {
    console.error('listReviews', err);
    return sendError(res, 500, 'Could not load reviews.');
  }
}

export async function getReview(req, res) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) {
    return sendError(res, 400, 'Invalid id.');
  }
  try {
    const rows = await query(
      `SELECT r.id, r.session_id, r.reviewer_id, r.reviewee_id, r.rating, r.comment, r.created_at,
              rev.display_name AS reviewer_name,
              revw.display_name AS reviewee_name,
              s.scheduled_at AS session_scheduled_at,
              s.status AS session_status
       FROM review r
       JOIN user_profile rev ON rev.user_id = r.reviewer_id
       JOIN user_profile revw ON revw.user_id = r.reviewee_id
       JOIN session s ON s.id = r.session_id
       WHERE r.id = ?`,
      [id]
    );
    if (!rows.length) {
      return sendError(res, 404, 'Review not found.');
    }
    return sendOk(res, rows[0]);
  } catch (err) {
    console.error('getReview', err);
    return sendError(res, 500, 'Could not load review.');
  }
}

export async function createReview(req, res) {
  const { session_id, reviewer_id, reviewee_id, rating, comment } = req.body || {};
  if (!Number.isInteger(Number(session_id)) || Number(session_id) < 1) {
    return sendError(res, 400, 'Valid session_id is required.');
  }
  if (!Number.isInteger(Number(reviewer_id)) || Number(reviewer_id) < 1) {
    return sendError(res, 400, 'Valid reviewer_id is required.');
  }
  if (!Number.isInteger(Number(reviewee_id)) || Number(reviewee_id) < 1) {
    return sendError(res, 400, 'Valid reviewee_id is required.');
  }
  const r = Number(rating);
  if (!Number.isInteger(r) || r < 1 || r > 5) {
    return sendError(res, 400, 'Rating must be an integer between 1 and 5.');
  }

  try {
    const [result] = await pool.execute(
      `INSERT INTO review (session_id, reviewer_id, reviewee_id, rating, comment)
       VALUES (?, ?, ?, ?, ?)`,
      [session_id, reviewer_id, reviewee_id, r, comment || null]
    );
    const rows = await query(
      `SELECT r.id, r.session_id, r.reviewer_id, r.reviewee_id, r.rating, r.comment, r.created_at,
              rev.display_name AS reviewer_name,
              revw.display_name AS reviewee_name,
              s.scheduled_at AS session_scheduled_at,
              s.status AS session_status
       FROM review r
       JOIN user_profile rev ON rev.user_id = r.reviewer_id
       JOIN user_profile revw ON revw.user_id = r.reviewee_id
       JOIN session s ON s.id = r.session_id
       WHERE r.id = ?`,
      [result.insertId]
    );
    return sendOk(res, rows[0], 201);
  } catch (err) {
    if (err.code === 'ER_NO_REFERENCED_ROW_2') {
      return sendError(res, 400, 'Invalid session or user reference.');
    }
    if (err.code === 'ER_CHECK_CONSTRAINT_VIOLATED' || err.errno === 3819) {
      return sendError(res, 400, 'Rating must be between 1 and 5.');
    }
    console.error('createReview', err);
    return sendError(res, 500, 'Could not create review.');
  }
}

export async function updateReview(req, res) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) {
    return sendError(res, 400, 'Invalid id.');
  }
  const { session_id, reviewer_id, reviewee_id, rating, comment } = req.body || {};
  const fields = [];
  const vals = [];
  if (session_id !== undefined) {
    if (!Number.isInteger(Number(session_id)) || Number(session_id) < 1) {
      return sendError(res, 400, 'Invalid session_id.');
    }
    fields.push('session_id = ?');
    vals.push(session_id);
  }
  if (reviewer_id !== undefined) {
    if (!Number.isInteger(Number(reviewer_id)) || Number(reviewer_id) < 1) {
      return sendError(res, 400, 'Invalid reviewer_id.');
    }
    fields.push('reviewer_id = ?');
    vals.push(reviewer_id);
  }
  if (reviewee_id !== undefined) {
    if (!Number.isInteger(Number(reviewee_id)) || Number(reviewee_id) < 1) {
      return sendError(res, 400, 'Invalid reviewee_id.');
    }
    fields.push('reviewee_id = ?');
    vals.push(reviewee_id);
  }
  if (rating !== undefined) {
    const r = Number(rating);
    if (!Number.isInteger(r) || r < 1 || r > 5) {
      return sendError(res, 400, 'Rating must be an integer between 1 and 5.');
    }
    fields.push('rating = ?');
    vals.push(r);
  }
  if (comment !== undefined) {
    fields.push('comment = ?');
    vals.push(comment);
  }
  if (!fields.length) {
    return sendError(res, 400, 'No fields to update.');
  }
  vals.push(id);
  try {
    const [result] = await pool.execute(
      `UPDATE review SET ${fields.join(', ')} WHERE id = ?`,
      vals
    );
    if (result.affectedRows === 0) {
      return sendError(res, 404, 'Review not found.');
    }
    const rows = await query(
      `SELECT r.id, r.session_id, r.reviewer_id, r.reviewee_id, r.rating, r.comment, r.created_at,
              rev.display_name AS reviewer_name,
              revw.display_name AS reviewee_name,
              s.scheduled_at AS session_scheduled_at,
              s.status AS session_status
       FROM review r
       JOIN user_profile rev ON rev.user_id = r.reviewer_id
       JOIN user_profile revw ON revw.user_id = r.reviewee_id
       JOIN session s ON s.id = r.session_id
       WHERE r.id = ?`,
      [id]
    );
    return sendOk(res, rows[0]);
  } catch (err) {
    if (err.code === 'ER_NO_REFERENCED_ROW_2') {
      return sendError(res, 400, 'Invalid reference.');
    }
    console.error('updateReview', err);
    return sendError(res, 500, 'Could not update review.');
  }
}

export async function deleteReview(req, res) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) {
    return sendError(res, 400, 'Invalid id.');
  }
  try {
    const [result] = await pool.execute(`DELETE FROM review WHERE id = ?`, [id]);
    if (result.affectedRows === 0) {
      return sendError(res, 404, 'Review not found.');
    }
    return sendOk(res, { deleted: true, id });
  } catch (err) {
    console.error('deleteReview', err);
    return sendError(res, 500, 'Could not delete review.');
  }
}
