import { query } from '../db.js';
import { sendError, sendOk } from '../utils/http.js';

/** List sessions with linked request and offering context (read-only + for review form dropdowns). */
export async function listSessions(req, res) {
  try {
    const rows = await query(
      `SELECT s.id, s.request_id, s.scheduled_at, s.duration_minutes, s.status,
              sr.requester_id, sr.offering_id, sr.status AS request_status,
              so.title AS offering_title
       FROM session s
       JOIN session_request sr ON sr.id = s.request_id
       JOIN skill_offering so ON so.id = sr.offering_id
       ORDER BY s.scheduled_at DESC`
    );
    return sendOk(res, rows);
  } catch (err) {
    console.error('listSessions', err);
    return sendError(res, 500, 'Could not load sessions.');
  }
}
