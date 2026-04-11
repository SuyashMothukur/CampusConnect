-- Sample data for CampusConnect demo
SET NAMES utf8mb4;

INSERT INTO user_account (id, email, password_hash, role) VALUES
(1, 'alex.chen@university.edu', '$2a$10$demoHashedPasswordPlaceholder', 'student'),
(2, 'jordan.lee@university.edu', '$2a$10$demoHashedPasswordPlaceholder', 'student'),
(3, 'sam.taylor@university.edu', '$2a$10$demoHashedPasswordPlaceholder', 'student'),
(4, 'riley.morgan@university.edu', '$2a$10$demoHashedPasswordPlaceholder', 'student'),
(5, 'casey.nguyen@university.edu', '$2a$10$demoHashedPasswordPlaceholder', 'admin');

INSERT INTO user_profile (user_id, display_name, bio, campus, major) VALUES
(1, 'Alex Chen', 'CS junior. Love algorithms and tutoring.', 'North Quad', 'Computer Science'),
(2, 'Jordan Lee', 'Design + front-end. Figma enthusiast.', 'Arts Building', 'Graphic Design'),
(3, 'Sam Taylor', 'Physics TA. Patient explainer.', 'Science Hall', 'Physics'),
(4, 'Riley Morgan', 'Stats and R for social science projects.', 'Liberal Arts', 'Statistics'),
(5, 'Casey Nguyen', 'CampusConnect moderator.', 'Student Union', 'Information Systems');

INSERT INTO skill_category (id, name, description) VALUES
(1, 'Programming', 'Code, debugging, and software concepts'),
(2, 'Design', 'UI/UX, visual design, tools'),
(3, 'STEM', 'Math, science, lab help'),
(4, 'Writing', 'Essays, research, editing'),
(5, 'Languages', 'Conversation and grammar');

INSERT INTO skill_offering (id, user_id, category_id, title, description, rate_per_hour, is_active) VALUES
(1, 1, 1, 'Python & Data Structures', 'Help with homework and interview prep.', 25.00, 1),
(2, 1, 1, 'Git & GitHub basics', 'Branches, PRs, and clean commits.', 20.00, 1),
(3, 2, 2, 'Portfolio critique', 'Feedback on layout, typography, and accessibility.', 18.00, 1),
(4, 3, 3, 'Mechanics problem sets', 'Walkthroughs for intro physics.', 22.00, 1),
(5, 4, 3, 'Intro Statistics with R', 'Tidyverse and hypothesis tests.', 24.00, 1),
(6, 2, 4, 'Resume & cover letter polish', 'Concise writing for internships.', 15.00, 1);

INSERT INTO availability_slot (user_id, day_of_week, start_time, end_time) VALUES
(1, 1, '14:00:00', '18:00:00'),
(1, 3, '16:00:00', '20:00:00'),
(2, 2, '10:00:00', '14:00:00'),
(3, 4, '13:00:00', '17:00:00'),
(4, 5, '09:00:00', '12:00:00');

INSERT INTO session_request (id, requester_id, offering_id, status, notes) VALUES
(1, 2, 1, 'accepted', 'Need help before midterm next week.'),
(2, 3, 3, 'pending', 'Portfolio review before career fair.'),
(3, 4, 4, 'declined', 'Schedule conflict on my side.'),
(4, 1, 5, 'pending', 'R dplyr help for final project.'),
(5, 5, 2, 'accepted', 'Git workshop for club members.');

INSERT INTO session (request_id, scheduled_at, duration_minutes, status) VALUES
(1, '2026-04-02 15:00:00', 60, 'scheduled'),
(5, '2026-04-05 17:00:00', 45, 'scheduled');

INSERT INTO message_thread (session_id) VALUES (1), (2);

INSERT INTO message (thread_id, sender_id, body, sent_at) VALUES
(1, 2, 'Thanks for accepting — see you Tuesday!', '2026-03-28 10:00:00'),
(1, 1, 'Sounds good. Bring your assignment PDF.', '2026-03-28 10:05:00'),
(2, 5, 'Can we record the session for the club?', '2026-03-29 09:00:00'),
(2, 1, 'Yes, as long as it stays internal.', '2026-03-29 09:10:00');

INSERT INTO review (session_id, reviewer_id, reviewee_id, rating, comment) VALUES
(1, 2, 1, 5, 'Clear explanations and great prep for the exam.');

INSERT INTO report (reporter_id, subject_type, subject_id, reason, status) VALUES
(3, 'session_request', 3, 'Duplicate request by mistake', 'resolved'),
(4, 'skill_offering', 5, 'Description outdated — contact info wrong', 'open');
