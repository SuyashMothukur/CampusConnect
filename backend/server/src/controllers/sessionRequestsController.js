import { pool, query } from '../db.js';
import { sendError, sendOk } from '../utils/http.js';

const STATUS = new Set(['pending', 'accepted', 'declined', 'cancelled']);

export async function listSessionRequests(req, res) {
  try {
    const rows = await query(
      `SELECT sr.id, sr.requester_id, sr.offering_id, sr.status, sr.notes, sr.created_at,
              req.display_name AS requester_name,
              so.title AS offering_title,
              prov.display_name AS provider_name
       FROM session_request sr
       JOIN user_profile req ON req.user_id = sr.requester_id
       JOIN skill_offering so ON so.id = sr.offering_id
       JOIN user_profile prov ON prov.user_id = so.user_id
       ORDER BY sr.id ASC`
    );
    return sendOk(res, rows);
  } catch (err) {
    console.error('listSessionRequests', err);
    return sendError(res, 500, 'Could not load session requests.');
  }
}

export async function getSessionRequest(req, res) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) {
    return sendError(res, 400, 'Invalid id.');
  }
  try {
    const rows = await query(
      `SELECT sr.id, sr.requester_id, sr.offering_id, sr.status, sr.notes, sr.created_at,
              req.display_name AS requester_name,
              so.title AS offering_title,
              prov.display_name AS provider_name
       FROM session_request sr
       JOIN user_profile req ON req.user_id = sr.requester_id
       JOIN skill_offering so ON so.id = sr.offering_id
       JOIN user_profile prov ON prov.user_id = so.user_id
       WHERE sr.id = ?`,
      [id]
    );
    if (!rows.length) {
      return sendError(res, 404, 'Session request not found.');
    }
    return sendOk(res, rows[0]);
  } catch (err) {
    console.error('getSessionRequest', err);
    return sendError(res, 500, 'Could not load session request.');
  }
}

export async function createSessionRequest(req, res) {
  const { requester_id, offering_id, status, notes } = req.body || {};
  if (!Number.isInteger(Number(requester_id)) || Number(requester_id) < 1) {
    return sendError(res, 400, 'Valid requester_id is required.');
  }
  if (!Number.isInteger(Number(offering_id)) || Number(offering_id) < 1) {
    return sendError(res, 400, 'Valid offering_id is required.');
  }
  let st = 'pending';
  if (status !== undefined && status !== null && status !== '') {
    if (!STATUS.has(String(status))) {
      return sendError(res, 400, 'Invalid status.');
    }
    st = status;
  }

  try {
    const [result] = await pool.execute(
      `INSERT INTO session_request (requester_id, offering_id, status, notes)
       VALUES (?, ?, ?, ?)`,
      [requester_id, offering_id, st, notes || null]
    );
    const rows = await query(
      `SELECT sr.id, sr.requester_id, sr.offering_id, sr.status, sr.notes, sr.created_at,
              req.display_name AS requester_name,
              so.title AS offering_title,
              prov.display_name AS provider_name
       FROM session_request sr
       JOIN user_profile req ON req.user_id = sr.requester_id
       JOIN skill_offering so ON so.id = sr.offering_id
       JOIN user_profile prov ON prov.user_id = so.user_id
       WHERE sr.id = ?`,
      [result.insertId]
    );
    return sendOk(res, rows[0], 201);
  } catch (err) {
    if (err.code === 'ER_NO_REFERENCED_ROW_2') {
      return sendError(res, 400, 'Invalid requester or offering reference.');
    }
    console.error('createSessionRequest', err);
    return sendError(res, 500, 'Could not create session request.');
  }
}

export async function updateSessionRequest(req, res) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) {
    return sendError(res, 400, 'Invalid id.');
  }
  const { status, notes } = req.body || {};
  const fields = [];
  const vals = [];
  if (status !== undefined) {
    if (!STATUS.has(String(status))) {
      return sendError(res, 400, 'Invalid status.');
    }
    fields.push('status = ?');
    vals.push(status);
  }
  if (notes !== undefined) {
    fields.push('notes = ?');
    vals.push(notes);
  }
  if (!fields.length) {
    return sendError(res, 400, 'No fields to update.');
  }
  vals.push(id);
  try {
    const [result] = await pool.execute(
      `UPDATE session_request SET ${fields.join(', ')} WHERE id = ?`,
      vals
    );
    if (result.affectedRows === 0) {
      return sendError(res, 404, 'Session request not found.');
    }
    const rows = await query(
      `SELECT sr.id, sr.requester_id, sr.offering_id, sr.status, sr.notes, sr.created_at,
              req.display_name AS requester_name,
              so.title AS offering_title,
              prov.display_name AS provider_name
       FROM session_request sr
       JOIN user_profile req ON req.user_id = sr.requester_id
       JOIN skill_offering so ON so.id = sr.offering_id
       JOIN user_profile prov ON prov.user_id = so.user_id
       WHERE sr.id = ?`,
      [id]
    );
    return sendOk(res, rows[0]);
  } catch (err) {
    console.error('updateSessionRequest', err);
    return sendError(res, 500, 'Could not update session request.');
  }
}

export async function deleteSessionRequest(req, res) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) {
    return sendError(res, 400, 'Invalid id.');
  }
  try {
    const [result] = await pool.execute(`DELETE FROM session_request WHERE id = ?`, [id]);
    if (result.affectedRows === 0) {
      return sendError(res, 404, 'Session request not found.');
    }
    return sendOk(res, { deleted: true, id });
  } catch (err) {
    console.error('deleteSessionRequest', err);
    return sendError(res, 500, 'Could not delete session request.');
  }
}
