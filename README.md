# Portfolio

A portfolio site for a full-stack product engineer. Next.js App Router, TypeScript, Tailwind, `motion` for scroll animation, `next-themes` for dark mode, and a real guestbook on libSQL (Turso in production, a local file in development).

## Run it

```bash
npm install
npm run dev
```

Open http://localhost:3000. The guestbook creates `local.db` in the project root on first use; it is git-ignored.

Other scripts:

| Script              | What it does                                        |
| ------------------- | --------------------------------------------------- |
| `npm run build`     | Production build                                    |
| `npm run lint`      | ESLint                                              |
| `npm run typecheck` | `tsc --noEmit`                                      |
| `npm run db:push`   | Push the Drizzle schema to the configured database  |
| `npm run db:studio` | Browse the database with Drizzle Studio             |

## Make it yours

Every word and image on the site comes from the files in `content/`. Nothing personal lives in the components.

| File                    | What to change                                                                    |
| ----------------------- | --------------------------------------------------------------------------------- |
| `content/profile.ts`    | Name, title, bio, facts, email, links, employers, the three hero photos, travel   |
| `content/projects.ts`   | Case studies. Each becomes a card on the home page and a page at `/work/[slug]`   |
| `content/snippets.ts`   | The snippets wall. UI snippets take an image; backend snippets take a code block  |
| `content/playground.ts` | Experiments. The first six show on the home page; all of them at `/playground`    |
| `content/timeline.ts`   | Work history for the "work log" tab                                               |
| `content/music.ts`      | Playlist name and tracks for the "music" tab                                      |
| `content/chatbot.ts`    | Questions and answers for the "ask me" tab                                        |

Images: put files in `public/` and set `src` on the matching entry (for example `src: "/photos/me.jpg"`). Anywhere `src` is missing, a placeholder frame is drawn instead. Drop your resume at `public/resume.pdf` or change `resume_href` in `content/profile.ts`.

Colours and fonts are set in `app/globals.css` (`:root` and `.dark`) and `app/layout.tsx`.

## Guestbook and deployment

The guestbook uses Drizzle ORM over libSQL. With no environment variables it writes to `file:local.db` on your machine. On Vercel, leave those variables unset and the wall stays empty instead of opening a local file the server cannot use. For a shared wall, create a database on [Turso](https://turso.tech) and set:

```
TURSO_DATABASE_URL=libsql://your-db-name.turso.io
TURSO_AUTH_TOKEN=...
GUESTBOOK_SALT=any-random-string
```

See `.env.example`. Tables are created automatically on first use; you can also run `npm run db:push` to create them ahead of time.

Visitors sign by drawing on a pad. The strokes are stored as JSON and drawn back as SVG, so nothing they draw is treated as text. Validation and a one-minute per-visitor cooldown run on the server in `app/actions/guestbook.ts`. Visitor IPs are stored only as salted hashes.

## Motion and accessibility

- The preloader shows once per browser session and is skipped entirely when `prefers-reduced-motion` is set.
- The pinned work rail only exists on screens 1024px and wider without reduced motion; everywhere else the same cards stack vertically. A "skip to snippets" link is visible the whole time the rail is pinned.
- Every tab, filter, and dialog is keyboard operable. The about tabs mirror their state into the URL hash so each one can be linked to (for example `/#music`).
