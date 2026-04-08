import express from 'express';
import * as auth from '../controllers/authController.js';
import * as users from '../controllers/usersController.js';
import * as offerings from '../controllers/offeringsController.js';
import * as sessionRequests from '../controllers/sessionRequestsController.js';
import * as reviews from '../controllers/reviewsController.js';
import * as stats from '../controllers/statsController.js';
import * as sessions from '../controllers/sessionsController.js';
import * as availability from '../controllers/availabilityController.js';
import * as reports from '../controllers/reportsController.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// ── Auth (public) ────────────────────────────────────────────────────────────
router.post('/auth/signup', auth.signup);
router.post('/auth/login', auth.login);
router.post('/auth/logout', auth.logout);

// ── Auth (protected) ─────────────────────────────────────────────────────────
router.get('/auth/me', requireAuth, auth.me);
router.post('/auth/change-password', requireAuth, auth.changePassword);

// ── Stats (protected) ────────────────────────────────────────────────────────
router.get('/stats', requireAuth, stats.getStats);

// ── Categories (protected, read-only for all roles) ──────────────────────────
router.get('/categories', requireAuth, offerings.listCategories);

// ── Users (admin only) ───────────────────────────────────────────────────────
router.get('/users', requireAuth, requireAdmin, users.listUsers);
router.get('/users/:id', requireAuth, requireAdmin, users.getUser);
router.post('/users', requireAuth, requireAdmin, users.createUser);
router.put('/users/:id', requireAuth, requireAdmin, users.updateUser);
router.delete('/users/:id', requireAuth, requireAdmin, users.deleteUser);

// ── Skill Offerings (protected) ───────────────────────────────────────────────
router.get('/offerings', requireAuth, offerings.listOfferings);
router.get('/offerings/:id', requireAuth, offerings.getOffering);
router.post('/offerings', requireAuth, offerings.createOffering);
router.put('/offerings/:id', requireAuth, offerings.updateOffering);
router.delete('/offerings/:id', requireAuth, offerings.deleteOffering);

// ── Session Requests (protected) ─────────────────────────────────────────────
router.get('/session-requests', requireAuth, sessionRequests.listSessionRequests);
router.get('/session-requests/:id', requireAuth, sessionRequests.getSessionRequest);
router.post('/session-requests', requireAuth, sessionRequests.createSessionRequest);
router.put('/session-requests/:id', requireAuth, sessionRequests.updateSessionRequest);
router.delete('/session-requests/:id', requireAuth, sessionRequests.deleteSessionRequest);

// ── Reviews (protected) ───────────────────────────────────────────────────────
router.get('/reviews', requireAuth, reviews.listReviews);
router.get('/reviews/:id', requireAuth, reviews.getReview);
router.post('/reviews', requireAuth, reviews.createReview);
router.put('/reviews/:id', requireAuth, reviews.updateReview);
router.delete('/reviews/:id', requireAuth, reviews.deleteReview);

// ── Sessions & Availability (protected) ───────────────────────────────────────
router.get('/sessions', requireAuth, sessions.listSessions);
router.get('/availability', requireAuth, availability.listAvailability);

// ── Reports / Analytics (admin only) ─────────────────────────────────────────
router.get('/reports/flags', requireAuth, requireAdmin, reports.listReports);
router.get('/reports/top-skills', requireAuth, requireAdmin, reports.topSkills);
router.get('/reports/provider-ratings', requireAuth, requireAdmin, reports.providerRatings);
router.get('/reports/session-activity', requireAuth, requireAdmin, reports.sessionActivity);

export default router;
