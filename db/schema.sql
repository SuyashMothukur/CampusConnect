-- CampusConnect MySQL schema
-- Run after creating database: CREATE DATABASE campusconnect CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

SET NAMES utf8mb4;

CREATE TABLE user_account (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('student','admin') NOT NULL DEFAULT 'student',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_profile (
  user_id INT UNSIGNED PRIMARY KEY,
  display_name VARCHAR(120) NOT NULL,
  bio TEXT,
  campus VARCHAR(120),
  major VARCHAR(120),
  CONSTRAINT fk_profile_user FOREIGN KEY (user_id) REFERENCES user_account(id) ON DELETE CASCADE
);

CREATE TABLE skill_category (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  description TEXT
);

CREATE TABLE skill_offering (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id INT UNSIGNED NOT NULL,
  category_id INT UNSIGNED NOT NULL,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  rate_per_hour DECIMAL(10,2) NULL,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  CONSTRAINT fk_offering_user FOREIGN KEY (user_id) REFERENCES user_account(id) ON DELETE CASCADE,
  CONSTRAINT fk_offering_category FOREIGN KEY (category_id) REFERENCES skill_category(id)
);

CREATE TABLE availability_slot (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id INT UNSIGNED NOT NULL,
  day_of_week TINYINT NOT NULL COMMENT '0=Sunday ... 6=Saturday',
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  CONSTRAINT fk_avail_user FOREIGN KEY (user_id) REFERENCES user_account(id) ON DELETE CASCADE
);

CREATE TABLE session_request (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  requester_id INT UNSIGNED NOT NULL,
  offering_id INT UNSIGNED NOT NULL,
  status ENUM('pending','accepted','declined','cancelled') NOT NULL DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_req_requester FOREIGN KEY (requester_id) REFERENCES user_account(id) ON DELETE CASCADE,
  CONSTRAINT fk_req_offering FOREIGN KEY (offering_id) REFERENCES skill_offering(id) ON DELETE CASCADE
);

CREATE TABLE session (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  request_id INT UNSIGNED NOT NULL,
  scheduled_at DATETIME NOT NULL,
  duration_minutes INT UNSIGNED NOT NULL DEFAULT 60,
  status ENUM('scheduled','completed','cancelled') NOT NULL DEFAULT 'scheduled',
  UNIQUE KEY uq_session_request (request_id),
  CONSTRAINT fk_session_request FOREIGN KEY (request_id) REFERENCES session_request(id) ON DELETE CASCADE
);

CREATE TABLE message_thread (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  session_id INT UNSIGNED NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_thread_session FOREIGN KEY (session_id) REFERENCES session(id) ON DELETE CASCADE
);

CREATE TABLE message (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  thread_id INT UNSIGNED NOT NULL,
  sender_id INT UNSIGNED NOT NULL,
  body TEXT NOT NULL,
  sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_msg_thread FOREIGN KEY (thread_id) REFERENCES message_thread(id) ON DELETE CASCADE,
  CONSTRAINT fk_msg_sender FOREIGN KEY (sender_id) REFERENCES user_account(id) ON DELETE CASCADE
);

CREATE TABLE review (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  session_id INT UNSIGNED NOT NULL,
  reviewer_id INT UNSIGNED NOT NULL,
  reviewee_id INT UNSIGNED NOT NULL,
  rating TINYINT UNSIGNED NOT NULL,
  comment TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_rev_session FOREIGN KEY (session_id) REFERENCES session(id) ON DELETE CASCADE,
  CONSTRAINT fk_rev_reviewer FOREIGN KEY (reviewer_id) REFERENCES user_account(id) ON DELETE CASCADE,
  CONSTRAINT fk_rev_reviewee FOREIGN KEY (reviewee_id) REFERENCES user_account(id) ON DELETE CASCADE,
  CONSTRAINT chk_rating CHECK (rating BETWEEN 1 AND 5)
);

CREATE TABLE report (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  reporter_id INT UNSIGNED NOT NULL,
  subject_type VARCHAR(50) NOT NULL,
  subject_id INT UNSIGNED NOT NULL,
  reason TEXT NOT NULL,
  status ENUM('open','resolved','dismissed') NOT NULL DEFAULT 'open',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_report_reporter FOREIGN KEY (reporter_id) REFERENCES user_account(id) ON DELETE CASCADE
);

CREATE INDEX idx_offering_user ON skill_offering(user_id);
CREATE INDEX idx_request_status ON session_request(status);
CREATE INDEX idx_session_scheduled ON session(scheduled_at);
