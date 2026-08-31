# EduSphere — Backend Authentication & RBAC API

Production-ready Authentication and Role-Based Access Control (RBAC) implementation for EduSphere school management platform.

---

## 🏗 Architecture Overview

```text
                Next.js / React (Client)
                          │
                          │ HTTPS (Authorization: Bearer <JWT>, HttpOnly Cookie)
                          ▼
                   Express.js (API)
              ┌───────────┴───────────┐
              │                       │
      Authentication (JWT)           RBAC (Middleware)
      - bcrypt (12 rounds)           - Student (/api/student/*)
      - Access JWT (15m)             - Teacher (/api/teacher/*)
      - Refresh Rotation             - Finance (/api/finance/*)
      - Reuse / Theft Detection      - Admin (/api/admin/*)
              │                       │
              └───────────┬───────────┘
                          │
                          ▼
                Supabase PostgreSQL
              ┌───────────┴───────────┐
            users              refresh_tokens
```

---

## 🚀 Key Features

* **Short-Lived Access JWT**: Signed with `JWT_ACCESS_SECRET`, expires in 15 minutes. Contains minimal claims (`sub: user.id`).
* **Refresh Token Rotation**: Hashed (SHA-256) in PostgreSQL, delivered via secure `HttpOnly` cookie.
* **Theft / Reuse Detection**: Refresh tokens belong to a `family_id`. Reusing an already rotated/revoked token immediately revokes the entire token family.
* **Role-Based Access Control**:
  * Roles: `student`, `teacher`, `finance_manager`, `admin`.
  * Public registration endpoint (`/api/auth/register`) strictly defaults to `student` (prevents privilege escalation).
  * Privileged accounts can only be created via `/api/admin/users`.
  * Dynamic live DB verification ensures deactivations take effect immediately.
* **Rate Limiting**: Brute-force protection on `/login`, `/register`, and `/refresh`.
* **Robust Error Handling & Validation**: Input validation with Zod, generic error responses to prevent account enumeration.

---

## 📁 File Structure

```text
backend/
├── src/
│   ├── config/
│   │   ├── env.js
│   │   ├── database.js
│   │   └── cors.js
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── student.controller.js
│   │   ├── teacher.controller.js
│   │   ├── finance.controller.js
│   │   └── admin.controller.js
│   ├── services/
│   │   ├── auth.service.js
│   │   ├── student.service.js
│   │   ├── teacher.service.js
│   │   ├── finance.service.js
│   │   └── admin.service.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── student.routes.js
│   │   ├── teacher.routes.js
│   │   ├── finance.routes.js
│   │   └── admin.routes.js
│   ├── middleware/
│   │   ├── auth.middleware.js
│   │   ├── role.middleware.js
│   │   ├── error.middleware.js
│   │   ├── rateLimit.middleware.js
│   │   └── validate.middleware.js
│   ├── validators/
│   │   ├── auth.validator.js
│   │   ├── student.validator.js
│   │   ├── teacher.validator.js
│   │   ├── finance.validator.js
│   │   └── admin.validator.js
│   ├── utils/
│   │   ├── jwt.js
│   │   ├── password.js
│   │   ├── refreshToken.js
│   │   ├── apiError.js
│   │   └── logger.js
│   ├── constants/
│   │   ├── roles.js
│   │   └── httpStatus.js
│   ├── app.js
│   └── index.js
├── tests/
│   ├── auth/
│   │   ├── register.test.js
│   │   ├── login.test.js
│   │   ├── refresh.test.js
│   │   └── logout.test.js
│   └── middleware/
│       ├── auth.middleware.test.js
│       └── role.middleware.test.js
├── migrations/
│   └── 001_auth_schema.sql
├── scripts/
│   └── test-auth.js
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

---

## 🛠 Database Migration

To run the SQL migration on your Supabase PostgreSQL instance:

```bash
npm run migrate
```

---

## 🧪 Running Tests

Run the comprehensive Jest test suite:
```bash
npm test
```

Run the end-to-end verification script:
```bash
npm run test:auth
```

---

## 📡 API Endpoints

### 1. Register (Public - Student only)
* **`POST /api/auth/register`**
* **Body:**
  ```json
  {
    "email": "student@example.com",
    "password": "StrongPassword123!",
    "firstName": "John",
    "lastName": "Doe"
  }
  ```

### 2. Login
* **`POST /api/auth/login`**
* **Body:**
  ```json
  {
    "email": "student@example.com",
    "password": "StrongPassword123!"
  }
  ```
* **Response:**
  ```json
  {
    "success": true,
    "message": "Login successful",
    "user": {
      "id": "uuid",
      "email": "student@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "student"
    },
    "accessToken": "ey..."
  }
  ```
  *(Refresh token is sent via secure `HttpOnly` cookie)*

### 3. Refresh Access Token
* **`POST /api/auth/refresh`**
* Uses `refreshToken` cookie. Rotates refresh token and returns a new access token.

### 4. Current User Profile
* **`GET /api/auth/me`**
* **Header:** `Authorization: Bearer <accessToken>`

### 5. Logout
* **`POST /api/auth/logout`**
* Revokes refresh token in database and clears cookie.

### 6. Admin User Creation (Privileged)
* **`POST /api/admin/users`**
* **Header:** `Authorization: Bearer <adminAccessToken>`
* **Body:**
  ```json
  {
    "email": "teacher@school.com",
    "password": "StrongPassword123!",
    "firstName": "Jane",
    "lastName": "Smith",
    "role": "teacher"
  }
  ```

---

## 💻 Next.js Frontend Integration Guide

1. **Storing Access Token**:
   * Keep the `accessToken` in JavaScript memory (React state / Context / Zustand / Redux).
   * **Never** store access or refresh tokens in `localStorage` or `sessionStorage`.

2. **CORS & Cookies**:
   * Use `credentials: 'include'` with `fetch` or `withCredentials: true` with Axios on all API requests.

3. **Auto Refresh Interceptor**:
   ```javascript
   import axios from 'axios';

   const api = axios.create({
     baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000',
     withCredentials: true,
   });

   let memoryAccessToken = null;

   export const setAccessToken = (token) => {
     memoryAccessToken = token;
   };

   api.interceptors.request.use((config) => {
     if (memoryAccessToken) {
       config.headers.Authorization = `Bearer ${memoryAccessToken}`;
     }
     return config;
   });

   api.interceptors.response.use(
     (response) => response,
     async (error) => {
       const originalRequest = error.config;
       if (error.response?.status === 401 && !originalRequest._retry) {
         originalRequest._retry = true;
         try {
           const { data } = await axios.post(
             `${api.defaults.baseURL}/api/auth/refresh`,
             {},
             { withCredentials: true }
           );
           setAccessToken(data.accessToken);
           originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
           return api(originalRequest);
         } catch (refreshError) {
           setAccessToken(null);
           window.location.href = '/login';
           return Promise.reject(refreshError);
         }
       }
       return Promise.reject(error);
     }
   );

   export default api;
   ```
