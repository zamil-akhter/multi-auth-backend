# multi-auth-backend

A complete, production-style authentication system built from scratch — covering multi-device session management, access/refresh token rotation, security hardening, and advanced auth features like 2FA and OAuth.

This project is built to go deep on authentication as a core backend engineering skill, not just wire up a login form. Every phase below builds on the last.

## Tech Stack

- **Runtime/Framework:** Node.js, NestJS
- **Database:** MongoDB (primary data), Redis (sessions, token blacklist, rate limiting)
- **Auth:** JWT (access tokens), rotating refresh tokens, bcrypt/argon2 password hashing
- **Other:** class-validator (input validation), NestJS Throttler (rate limiting), Passport (OAuth strategies)

## Features

- Signup / login / logout
- Multi-device session tracking (device name, IP, user-agent, last active)
- Logout from a specific device
- Logout from all devices
- Access + refresh token issuance with rotation on every refresh
- Refresh token reuse detection (auto-revokes session family on theft signal)
- Rate limiting and account lockout on repeated failed logins
- Auth event audit log
- Email verification and password reset flows
- 2FA (TOTP) with backup codes
- OAuth login (Google, GitHub)
- Role-based access control (RBAC)
- Admin endpoints for user/session management

## Project Phases

| Phase | Focus                                                                   |
| ----- | ----------------------------------------------------------------------- |
| 1     | Core auth — signup, login, logout, current user                         |
| 2     | Multi-device session management, token rotation                         |
| 3     | Security hardening — rate limiting, lockout, reuse detection, audit log |
| 4     | Email verification, password reset, password change                     |
| 5     | 2FA (TOTP), OAuth (Google/GitHub), RBAC                                 |
| 6     | Admin endpoints, health checks, production readiness                    |

## API Endpoints

### Phase 1 — Core Auth

```
POST   /auth/signup
POST   /auth/login
POST   /auth/logout
GET    /auth/me
```

### Phase 2 — Multi-Device Sessions

```
POST   /auth/refresh
GET    /auth/sessions
DELETE /auth/sessions/:sessionId
DELETE /auth/sessions
DELETE /auth/sessions/others
```

### Phase 3 — Security Hardening

```
GET    /auth/audit-log
POST   /auth/token/revoke
GET    /auth/security/alerts
```

### Phase 4 — Verification & Recovery

```
POST   /auth/verify-email
POST   /auth/resend-verification
POST   /auth/forgot-password
POST   /auth/reset-password
PATCH  /auth/change-password
```

### Phase 5 — Advanced Auth

```
POST   /auth/2fa/setup
POST   /auth/2fa/verify
POST   /auth/2fa/disable
POST   /auth/2fa/backup-codes
POST   /auth/login/2fa

GET    /auth/oauth/google
GET    /auth/oauth/google/callback
GET    /auth/oauth/github
GET    /auth/oauth/github/callback

GET    /users/:id/roles
PATCH  /users/:id/roles
```

### Phase 6 — Admin

```
GET    /admin/users
GET    /admin/users/:id/sessions
DELETE /admin/users/:id/sessions
GET    /admin/audit-log
GET    /health
```

## Project Structure

```
multi-auth-backend/
├── src/
│   ├── auth/
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── auth.module.ts
│   │   ├── strategies/         # JWT, Google, GitHub strategies
│   │   ├── guards/             # JwtAuthGuard, RolesGuard, etc.
│   │   └── dto/
│   ├── sessions/
│   │   ├── sessions.controller.ts
│   │   ├── sessions.service.ts
│   │   └── sessions.module.ts
│   ├── users/
│   │   ├── users.controller.ts
│   │   ├── users.service.ts
│   │   └── users.module.ts
│   ├── common/
│   │   ├── interceptors/
│   │   ├── filters/
│   │   └── decorators/
│   ├── config/
│   └── main.ts
├── test/
├── .env.example
├── package.json
└── README.md
```

## Environment Variables

```
# App
PORT=3000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/multi_auth

# Redis
REDIS_URL=redis://localhost:6379

# JWT
JWT_ACCESS_SECRET=
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_SECRET=
JWT_REFRESH_EXPIRY=7d

# Email
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASSWORD=

# OAuth
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
```

## Getting Started

```bash
# Clone the repo
git clone https://github.com/<your-username>/multi-auth-backend.git
cd multi-auth-backend

# Install dependencies
npm install

# Copy env file and fill in values
cp .env.example .env

# Start in dev mode
npm run start:dev
```

## Security Notes

- Passwords are hashed with bcrypt/argon2 — never stored or logged in plaintext.
- Access tokens are short-lived (15 min) and stateless; refresh tokens are long-lived, stored (hashed) server-side, and rotated on every use.
- Refresh token reuse is treated as a theft signal and revokes the affected session family.
- All auth endpoints are rate-limited; repeated failed logins trigger temporary account lockout.

## Roadmap / Related Repos

- `multi-auth-frontend` — React client consuming this API (planned)

## License

MIT
