import { query } from '../db.js';
import { sendError, sendOk } from '../utils/http.js';

export async function listReports(req, res) {
  try {
    const rows = await query(
      `SELECT r.id, r.reporter_id, r.subject_type, r.subject_id, r.reason, r.status, r.created_at,
              up.display_name AS reporter_name
       FROM report r
       JOIN user_profile up ON up.user_id = r.reporter_id
       ORDER BY r.id ASC`
    );
    return sendOk(res, rows);
  } catch (err) {
    console.error('listReports', err);
    return sendError(res, 500, 'Could not load reports.');
  }
}
