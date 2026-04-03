# CampusConnect

Full-stack demo: **React (Vite)** + **Express** + **MySQL**. The UI performs real CRUD against the database through a JSON REST API.

## Prerequisites

- **Node.js** 18+
- **MySQL** 8.x or 9.x (schema uses a `CHECK` constraint on review ratings; use MySQL 8.0.16+ or equivalent)

## Start (commands in order)

1. `brew services start mysql`
2. `mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS campusconnect CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"`
3. `mysql -u root -p campusconnect < server/sql/schema.sql`
4. `mysql -u root -p campusconnect < server/sql/seed.sql`
5. `cp server/.env.example server/.env`
6. `npm run install:all`
7. `npm run dev`

---

## Demo checklist

- **Dashboard**: counts come from live `COUNT(*)` queries.
- **Users**: search/filter, create, edit, delete (with confirmation). Deletes cascade related rows where foreign keys define `ON DELETE CASCADE`.
- **Skill Offerings**, **Session Requests**, **Reviews**: full CRUD with success/error messages and loading states.
- **Availability**, **Sessions**, **Reports**: read-only lists backed by MySQL (extend with POST/PUT/DELETE when you need them).

After inserts/updates/deletes, refresh the Dashboard or revisit a list to show that the GUI and database stay in sync.

## Project layout

- `server/` — Express app (`src/routes`, `src/controllers`, `src/db.js`), SQL under `server/sql/`
- `client/` — Vite + React app (`src/pages`, `src/components`, `src/api/client.js`)

## Production build (optional)

```bash
cd client && npm run build
```

Serve the `client/dist` folder with any static host; configure that host to forward `/api` to your Express server, or set `VITE_*` / full API URL if you add a production base URL later.




Script

Hi, this is our Phase 5 demonstration for CampusConnect.

CampusConnect is a database driven web application that allows university students to exchange skills and request help from peers. The goal of the system is to replace informal methods like group chats or word of mouth with a structured platform where users can manage profiles, list skills, schedule sessions, and leave reviews.

In this demo, I’ll show the system, the database connection, and how we can perform insert, update, and delete operations through the interface.

The application uses React for the frontend, Node.js with Express for the backend, and MySQL as the database. The frontend communicates with the backend through API calls, and the backend handles all database operations.

Here is our database. We have multiple tables representing the main entities of the system, including users, profiles, skill offerings, availability slots, session requests, sessions, reviews, messages, and reports. Each table is connected using primary and foreign keys. For example, skill offerings are linked to users, session requests connect requesters and providers, and reviews are tied to completed sessions. The database is populated with sample data so we can demonstrate real interactions.

Now I’ll show that our application is successfully connected to the database. When we interact with the interface, the frontend sends requests to the backend, and the backend executes SQL queries on the MySQL database. All changes we make through the UI are immediately reflected in the database.

I’ll start by demonstrating an insert operation. Here on this page, I can create a new record using this form. I’ll enter the required details and submit. As you can see, the new record appears in the table. This confirms that the data was successfully inserted into the database.

Next, I’ll demonstrate an update operation. I’ll select an existing record and edit it. After modifying the values, I submit the form. The updated data is immediately reflected here in the interface, which shows that the system correctly updates records in the database.

Now I’ll demonstrate a delete operation. I’ll select a record and remove it. The record is now removed from the table. This confirms that the delete operation is working and the database is updated accordingly.

In summary, our application successfully demonstrates full database integration with a working React interface. We are able to perform insert, update, delete, and read operations through the GUI, and all changes are reflected in the MySQL database.

Thank you.
