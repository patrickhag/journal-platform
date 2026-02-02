# Journal Platform

A Next.js 15 app for running a scholarly journal workflow: public site, submissions, peer review, editorial roles, and publishing. The codebase includes protected areas for authors, reviewers, editors, and staff editors, plus automation for email notifications and content distribution.

## Tech Stack

- Next.js App Router, React 18, TypeScript
- Drizzle ORM + Postgres (Neon serverless driver)
- NextAuth (credentials provider)
- Tailwind CSS + Radix UI components
- Email: Resend + Nodemailer (Gmail transport)
- File uploads: Cloudinary

## Local Setup

1. Install dependencies:
   - `pnpm install` (preferred if you follow `pnpm-lock.yaml`)
   - or `npm install`
2. Create a `.env` file (see Environment Variables below).
3. Start the dev server:
   - `pnpm dev` or `npm run dev`

App runs at `http://localhost:3000`.

## Environment Variables

Required values referenced in the codebase:

```
DATABASE_URL=
NEXT_PUBLIC_URL=
NEXTAUTH_SECRET='
NEXTAUTH_URL=
AUTH_SECRET=
SECRET=
AUTH_TRUST_HOST=
AUTH_URL=
ADMIN_EMAIL=
BLOB_READ_WRITE_TOKEN=

EMAIL_USER=
EMAIL_PASS=

EDITOR_IN_CHIEF_NAME=
EDITOR_IN_CHIEF_EMAIL=
EDITOR_IN_CHIEF_ID=
CHIEF_EDITOR_EMAIL=
RESEND_API_KEY=
RESEND_SENDER=
```

Notes:

- `NEXT_PUBLIC_URL` is used to build canonical links, sitemap, emails, and OAI-PMH responses.
- `EMAIL_USER` / `EMAIL_PASS` are used by Nodemailer for Gmail-based sending.

## Scripts

- `dev`: Next.js dev server (`next dev --turbo`)
- `build`: Production build
- `start`: Serve production build
- `lint`: Next.js lint
- `format`: Prettier

## Project Structure (high level)

- `src/app`: App Router pages and route handlers
  - Public pages: `articles`, `collections`, `editorial-board`, `manuals`, `search-articles`
  - Protected areas: `src/app/(protected)` with role-specific sections (`author`, `reviewer`, `editor`, etc.)
  - API routes: `src/app/api`
- `src/db`: Drizzle schema + database client
- `src/components`: UI components and React Email templates
- `src/actions`: Server actions

## Notable Functionality

- Role-based access flows for authors, reviewers, associate editors, staff editors, and chief-editors
- Email notifications for invitations, reviews, revisions, and status changes
- OAI-PMH endpoint at `/api/oai` for metadata harvesting
- Public sitemap generation via `sitemap.ts`

## Database

- Drizzle config: `drizzle.config.ts`
- Schema: `src/db/schema.ts`
- Client: `src/db/db.ts`

## Email

- Resend API and Gmail SMTP (Nodemailer) are both configured.
- Email templates live under `src/components/emails` and `src/lib/emailTransporter.tsx`.

## Deployment

Standard Next.js deployment. Ensure all env vars are set and database connectivity is available.
