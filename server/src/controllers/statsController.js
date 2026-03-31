import { query } from '../db.js';
import { sendError, sendOk } from '../utils/http.js';

export async function getStats(req, res) {
  try {
    const users = await query(`SELECT COUNT(*) AS c FROM user_account`);
    const offerings = await query(`SELECT COUNT(*) AS c FROM skill_offering`);
    const requests = await query(`SELECT COUNT(*) AS c FROM session_request`);
    const reviews = await query(`SELECT COUNT(*) AS c FROM review`);
    const sessions = await query(`SELECT COUNT(*) AS c FROM session`);
    return sendOk(res, {
      total_users: Number(users[0].c),
      total_offerings: Number(offerings[0].c),
      total_session_requests: Number(requests[0].c),
      total_reviews: Number(reviews[0].c),
      total_sessions: Number(sessions[0].c),
    });
  } catch (err) {
    console.error('getStats', err);
    return sendError(res, 500, 'Could not load dashboard stats.');
  }
}
