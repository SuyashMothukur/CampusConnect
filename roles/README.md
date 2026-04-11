# Team roles and contributions

## Phase 6 — Final Implementation

---

### Parth Mehta

I led the Phase 6 implementation end to end. I designed and built the complete JWT-based authentication system — signup, login, logout, change-password, and the /me endpoint — along with the AuthContext provider that manages token state across the frontend. I identified and fixed the critical plaintext password vulnerability from Phase 5, integrating bcrypt hashing into both the create and update user flows, and I restructured the GitHub repository and wrote the main README to meet Phase 6 requirements.


---

### Anurag Pokala

In Phase 6, I built the session requests controller and the corresponding frontend page, implementing the full create, read, update, and delete flow for session requests including status management across pending, accepted, declined, and cancelled states. I also wrote and tested the parameterized SQL queries that power the session request and skill offering endpoints, ensuring all inputs were sanitized and that foreign key relationships were correctly enforced.

---

### Donald Manka

In Phase 6, I built the availability and reviews pages on the frontend, implementing the full CRUD interface for both. I also wrote the seed data in seed.sql, populating all major tables with realistic sample records to support testing and demonstration of the application's functionality across all features.

---

### Suyash Mothukuri

In Phase 6, I designed and implemented the four analytics report queries in reportsController.js — covering skill demand, provider ratings, monthly session activity, and moderation reports — using complex joins, conditional aggregation, and GROUP BY clauses. I also built the Reports page in React to display these results clearly for administrators, and I set up and maintained the GitHub repository throughout the project.

---

### Generative AI (Claude / ChatGPT)

Used throughout the project to assist with writing, code review, debugging, and documentation refinement. All final decisions, implementations, and written content were reviewed and edited by team members.