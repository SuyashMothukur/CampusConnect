import { query } from '../db.js';
import { sendError, sendOk } from '../utils/http.js';

export async function listAvailability(req, res) {
  try {
    const rows = await query(
      `SELECT a.id, a.user_id, a.day_of_week, a.start_time, a.end_time,
              up.display_name AS user_name
       FROM availability_slot a
       JOIN user_profile up ON up.user_id = a.user_id
       ORDER BY a.user_id, a.day_of_week, a.start_time`
    );
    return sendOk(res, rows);
  } catch (err) {
    console.error('listAvailability', err);
    return sendError(res, 500, 'Could not load availability.');
  }
}
