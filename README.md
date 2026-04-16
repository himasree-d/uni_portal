# 🎓 uni_portal — Academa University Intranet Portal

A full-stack university intranet portal built with React and Spring Boot.  
**Status: 🚧 Work in Progress**

---

## Overview

uni_portal (Academa) is a role-based university management system designed to streamline academic operations for students, faculty, and admins. The project is currently under active development.

## Project Structure
```
uni_portal/
├── frontend_academa/    # React frontend
├── backend_academa/     # Node.js backend
├── .gitignore
└── LICENSE
```
## Tech Stack

| Layer     | Technology              |
|-----------|-------------------------|
| Frontend  | React, JavaScript       |
| Backend   | Node.js                 |
| Database  | MySQL / PostgreSQL (WIP)|
| Auth      | JWT (planned)           |

## Current Progress

- [x] Frontend structure set up
- [x] Backend structure set up
- [ ] Database integration (in progress)
- [x] REST API endpoints
- [x] Authentication & role-based access
- [x] Student dashboard
- [x] Faculty dashboard
- [x] Admin dashboard

## Getting Started

> ⚠️ The project is not fully functional yet. DB integration is still pending.

### Frontend

```bash
cd frontend_academa
npm install
npm start
```

### Backend

```bash
cd backend_academa
npm install
npm run dev
```

> Make sure to configure your database connection in `application.properties` before running the backend.

## Planned Features

- Role-based dashboards (Student, Faculty, Admin)
- Course and assignment management
- Announcements and notifications
- Chat with student or faculty
- Secure JWT authentication


## License

Licensed under the [MIT License](LICENSE).
