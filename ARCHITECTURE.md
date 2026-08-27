# Edu Sphare production architecture

Edu Sphare is a multi-school SaaS. A school is the tenant boundary: it is resolved from the canonical slug, and the backend always derives the tenant from the authenticated session rather than trusting browser-supplied tenant IDs.

## Runtime design

`frontend/` is the Next.js UI and browser-facing edge. `backend/` is the API boundary; it owns sessions, permissions, validation, audit events, and all PostgreSQL access. Deploy them behind the same HTTPS domain (for example, `app.edusphare.in` and `app.edusphare.in/api`) so the `HttpOnly`, `Secure`, `SameSite=Lax` session cookie is first-party.

PostgreSQL is the system of record. Its migration creates a `school_id` on tenant-owned records and forces row-level security. Repositories run inside `db.withTenant()`, which sets the database-local tenant context before a query. This is defense in depth: API checks and database policies must agree.

## Security controls included

- Passwords are salted with scrypt and a secret pepper; the API never returns password hashes or session tokens.
- Session tokens are opaque, hashed at rest, expire, and can be revoked at logout. Credentials receive a generic error to prevent account enumeration.
- Role permissions are checked server-side. Finance cannot write attendance/grades; hiding a button is never treated as permission.
- The audit log is append-only at the database level. Grades, attendance, payments, refunds, payroll, role changes, and exports should all write an audit event in the same transaction as their change.
- Uploaded documents are metadata only until object storage upload, malware scan, and signed-download support are added. Never serve raw storage keys to browsers.

## Local development

1. Copy `backend/.env.example` to `backend/.env`, set a unique `PASSWORD_PEPPER`, and start Postgres with `docker compose up -d`.
2. From `backend/`, run `npm install`, then `npm run db:migrate`, then `npm run dev`.
3. Copy `.env.example` to `frontend/.env.local`, set `NEXT_PUBLIC_DEFAULT_SCHOOL_SLUG` if useful, then run `npm run dev` from `frontend/`.

The migration intentionally has no demo users. For local development only, `npm run seed:demo` creates isolated demo accounts; the script is blocked when `NODE_ENV=production`.

## Delivery sequence

1. Add the bootstrap/invitation and password-reset email workflows, Redis-backed rate limiting, and MFA for finance/admin roles.
2. Replace each static portal module with a protected API workflow, starting with attendance, enrollment, invoices/payments, then grades and payroll.
3. Add object storage with asynchronous malware scanning; connect a payment provider using idempotency keys and webhooks.
4. Add integration tests against a disposable PostgreSQL instance, staging environment, backups/restore drills, error monitoring, and data-retention/export procedures.
