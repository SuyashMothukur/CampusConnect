# Team roles and contributions
# Team Roles and Contributions

## Phase 6 — Final Implementation

---

### Parth Mehta

Parth led the Phase 6 implementation end to end. He designed and built the complete JWT-based authentication system, including the signup, login, logout, change-password, and `/me` endpoints in the Express backend, along with the corresponding React pages (Login, Signup, ChangePassword) and the `AuthContext` provider that manages token state across the frontend. He identified and fixed the critical plaintext password vulnerability carried over from Phase 5, integrating bcrypt hashing (12 salt rounds) into both the create and update user flows. He restructured the GitHub repository to meet Phase 6 requirements, wrote the main `README.md`, and set up the required folder structure. Throughout Phase 6, Parth served as the integration point for the team, ensuring all components worked correctly together before submission.

---

### Anurag Pokala

Anurag contributed to the database design foundations that made Phase 6 possible. In Phase 2, he completed the entity and relationship definitions and led the conversion of the conceptual ER diagram into the logical ER diagram in Phase 3, ensuring all entities had properly identified primary and foreign keys. In Phase 6, Anurag contributed to backend API development, helping extend and test the session request and offering controllers to ensure they correctly enforced the authentication and authorization requirements introduced in this phase. He also reviewed the final report for accuracy and completeness.

---

### Donald Manka

Donald contributed to the structural and design foundations across multiple phases. He developed the real-world entities list in Phase 1, worked on the ER diagram in Phase 2, and produced the relational schema diagram in Phase 3 that served as the blueprint for the MySQL implementation. In Phase 6, Donald took responsibility for the frontend CRUD interface improvements, ensuring that the Skill Offerings, Availability, and Session Requests pages correctly handled all four operations with proper success and error states. He also gathered and organized the sample data screenshots required for the final report.

---

### Suyash Mothukuri

Suyash owns the GitHub repository and was instrumental in the Phase 5 demonstration, building the initial mock application that connected the React frontend to the MySQL database through the Node.js backend. This foundation — the working Express server structure, the mysql2 connection pool, and the basic CRUD controller pattern — made Phase 6 possible. In Phase 6, Suyash led the analytics reporting work, designing and implementing the four SQL report queries in `reportsController.js` using complex joins, conditional aggregation, and GROUP BY clauses, and building the Reports page in React to visualize results for administrators.

---

### Generative AI (Claude / ChatGPT)

Used throughout the project to assist with writing, code review, debugging, and documentation refinement. All final decisions, implementations, and written content were reviewed and edited by team members.