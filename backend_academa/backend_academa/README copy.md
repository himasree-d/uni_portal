# Academa Backend

## Quick Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Edit .env — set your DB password if needed
The .env file is already configured for user `himasree` with no password.
If you created `academa_admin` with password `Academa@2024`, update it:
```
DB_USER=himasree
DB_PASSWORD=
```

### 3. Create a fresh database and run schema
```bash
# In terminal:
psql postgres
```
```sql
CREATE DATABASE academa_lms;
\q
```
```bash
psql -U himasree -d academa_lms -f schema.sql
```

### 4. Update .env DB_NAME
```
DB_NAME=academa_lms
```

### 5. Start server
```bash
npm run dev
```
Server runs on http://localhost:5001

---

## Login Credentials (password = `password` for all)

| Role    | Email                    |
|---------|--------------------------|
| Admin   | admin@academa.edu        |
| Faculty | rajesh@academa.edu       |
| Faculty | priya@academa.edu        |
| Student | arjun@academa.edu        |
| Student | priyasingh@academa.edu   |
