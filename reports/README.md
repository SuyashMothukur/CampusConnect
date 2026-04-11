# Analytics Reports

Admin-only analytics dashboard accessible via the Reports page. All four reports use joins, aggregation, and GROUP BY clauses and are visible only to `admin` users.

---

## Report 1: Top Skill Categories by Request Volume

Shows session request counts per skill category, broken down by status (accepted, pending, declined).

```sql
SELECT sc.name AS category,
       COUNT(sr.id) AS total_requests,
       SUM(CASE WHEN sr.status = 'accepted' THEN 1 ELSE 0 END) AS accepted,
       SUM(CASE WHEN sr.status = 'pending'  THEN 1 ELSE 0 END) AS pending,
       SUM(CASE WHEN sr.status = 'declined' THEN 1 ELSE 0 END) AS declined
FROM skill_category sc
LEFT JOIN skill_offering so ON so.category_id = sc.id
LEFT JOIN session_request sr ON sr.offering_id = so.id
GROUP BY sc.id, sc.name
ORDER BY total_requests DESC;
```

---

## Report 2: Provider Ratings & Completed Sessions

Average star rating, total reviews, and completed sessions per provider. Excludes providers with no reviews.

```sql
SELECT up.display_name AS provider,
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
ORDER BY avg_rating DESC, total_reviews DESC;
```

---

## Report 3: Monthly Session Activity

Session volume grouped by month for the last 12 months, with completed and cancelled counts.

```sql
SELECT DATE_FORMAT(s.scheduled_at, '%Y-%m') AS month,
       COUNT(*) AS total_sessions,
       SUM(CASE WHEN s.status = 'completed' THEN 1 ELSE 0 END) AS completed,
       SUM(CASE WHEN s.status = 'cancelled' THEN 1 ELSE 0 END) AS cancelled
FROM session s
GROUP BY month
ORDER BY month DESC
LIMIT 12;
```

---

## Report 4: Moderation Reports

All user-filed moderation reports with reporter name, subject, reason, and status.

```sql
SELECT r.id, r.subject_type, r.subject_id, r.reason, r.status, r.created_at,
       up.display_name AS reporter_name
FROM report r
JOIN user_profile up ON up.user_id = r.reporter_id
ORDER BY r.id ASC;
```

---

All queries are in `server/src/controllers/reportsController.js`. API endpoints:

| Endpoint | Report |
|---|---|
| `GET /api/reports/top-skills` | Skill demand by category |
| `GET /api/reports/provider-ratings` | Provider ratings |
| `GET /api/reports/session-activity` | Monthly session trends |
| `GET /api/reports/flags` | Moderation reports |