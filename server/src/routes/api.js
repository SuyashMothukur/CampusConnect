import express from 'express';
import * as users from '../controllers/usersController.js';
import * as offerings from '../controllers/offeringsController.js';
import * as sessionRequests from '../controllers/sessionRequestsController.js';
import * as reviews from '../controllers/reviewsController.js';
import * as stats from '../controllers/statsController.js';
import * as sessions from '../controllers/sessionsController.js';
import * as availability from '../controllers/availabilityController.js';
import * as reports from '../controllers/reportsController.js';

const router = express.Router();

router.get('/stats', stats.getStats);

router.get('/categories', offerings.listCategories);

router.get('/users', users.listUsers);
router.get('/users/:id', users.getUser);
router.post('/users', users.createUser);
router.put('/users/:id', users.updateUser);
router.delete('/users/:id', users.deleteUser);

router.get('/offerings', offerings.listOfferings);
router.get('/offerings/:id', offerings.getOffering);
router.post('/offerings', offerings.createOffering);
router.put('/offerings/:id', offerings.updateOffering);
router.delete('/offerings/:id', offerings.deleteOffering);

router.get('/session-requests', sessionRequests.listSessionRequests);
router.get('/session-requests/:id', sessionRequests.getSessionRequest);
router.post('/session-requests', sessionRequests.createSessionRequest);
router.put('/session-requests/:id', sessionRequests.updateSessionRequest);
router.delete('/session-requests/:id', sessionRequests.deleteSessionRequest);

router.get('/reviews', reviews.listReviews);
router.get('/reviews/:id', reviews.getReview);
router.post('/reviews', reviews.createReview);
router.put('/reviews/:id', reviews.updateReview);
router.delete('/reviews/:id', reviews.deleteReview);

router.get('/sessions', sessions.listSessions);
router.get('/availability', availability.listAvailability);
router.get('/reports', reports.listReports);

export default router;
