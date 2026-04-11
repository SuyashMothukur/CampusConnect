import { query } from '../db.js';
import { sendError, sendOk } from '../utils/http.js';

// GET /api/reports/flags  — moderation reports (admin only)
export async function listReports(req, res) {
  try {
    const rows = await query(
      `SELECT r.id, r.subject_type, r.subject_id, r.reason, r.status, r.created_at,
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

// GET /api/reports/top-skills  — top skill categories by session request volume
export async function topSkills(req, res) {
  try {
    const rows = await query(
      `SELECT sc.name AS category,
              COUNT(sr.id) AS total_requests,
              SUM(CASE WHEN sr.status = 'accepted' THEN 1 ELSE 0 END) AS accepted,
              SUM(CASE WHEN sr.status = 'pending'  THEN 1 ELSE 0 END) AS pending,
              SUM(CASE WHEN sr.status = 'declined' THEN 1 ELSE 0 END) AS declined
       FROM skill_category sc
       LEFT JOIN skill_offering so ON so.category_id = sc.id
       LEFT JOIN session_request sr ON sr.offering_id = so.id
       GROUP BY sc.id, sc.name
       ORDER BY total_requests DESC`
    );
    return sendOk(res, rows);
  } catch (err) {
    console.error('topSkills', err);
    return sendError(res, 500, 'Could not load skill report.');
  }
}

// GET /api/reports/provider-ratings  — average rating per provider
export async function providerRatings(req, res) {
  try {
    const rows = await query(
      `SELECT up.display_name AS provider,
              COUNT(rv.id) AS total_reviews,
              ROUND(AVG(rv.rating), 2) AS avg_rating,
              COUNT(DISTINCT s.id) AS sessions_completed
       FROM user_account ua
       JOIN user_profile up ON up.user_id = ua.id
       LEFT JOIN skill_offering so ON so.user_id = ua.id
       LEFT JOIN session_request sr ON sr.offering_id = so.id
       LEFT JOIN session s ON s.request_id = sr.id AND s.status = 'completed'
       LEFT JOIN review rv ON rv.reviewee_id = ua.id
       GROUP BY ua.id, up.display_name
       HAVING total_reviews > 0
       ORDER BY avg_rating DESC, total_reviews DESC`
    );
    return sendOk(res, rows);
  } catch (err) {
    console.error('providerRatings', err);
    return sendError(res, 500, 'Could not load provider ratings report.');
  }
}

// GET /api/reports/session-activity  — monthly session activity
export async function sessionActivity(req, res) {
  try {
    const rows = await query(
      `SELECT DATE_FORMAT(s.scheduled_at, '%Y-%m') AS month,
              COUNT(*) AS total_sessions,
              SUM(CASE WHEN s.status = 'completed' THEN 1 ELSE 0 END) AS completed,
              SUM(CASE WHEN s.status = 'cancelled' THEN 1 ELSE 0 END) AS cancelled
       FROM session s
       GROUP BY month
       ORDER BY month DESC
       LIMIT 12`
    );
    return sendOk(res, rows);
  } catch (err) {
    console.error('sessionActivity', err);
    return sendError(res, 500, 'Could not load session activity report.');
  }
}
