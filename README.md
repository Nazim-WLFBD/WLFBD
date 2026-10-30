# We Learn French BD — website

Next.js 15 site in English and Bangla (`/en`, `/bn`): courses, schedule, CRS calculator, quizzes and mock tests, recorded courses with bKash payment, student accounts, and an admin portal.

## Run it on your computer

```bash
npm install
npm run dev
```

Open http://localhost:3000. Without Firebase settings the public site works with its built-in content; login, saving and the admin portal show a "coming soon" notice.

## Go live (one-time setup)

### 1. Firebase (free Spark plan)
1. Create a project at https://console.firebase.google.com.
2. **Authentication → Sign-in method**: enable **Email/Password** and **Google**. Add your domain under **Authorized domains**.
3. **Firestore Database → Create database** (production mode).
4. **Project settings → Your apps → Web (</>)**: copy the config values into the `NEXT_PUBLIC_FIREBASE_*` variables.
5. **Project settings → Service accounts → Generate new private key**: paste the whole JSON (one line) into `FIREBASE_SERVICE_ACCOUNT`.
6. Publish the security rules and index:
   ```bash
   npx firebase login
   npx firebase deploy --only firestore --project YOUR_PROJECT_ID
   ```

### 2. Email (Gmail)
Turn on 2-step verification on the sending Gmail, create an **App Password**, and set `SMTP_USER` / `SMTP_PASS`. Without it, the site still works; emails are just skipped.

### 3. Hosting on Vercel (free)
1. Push this folder to a GitHub repository and import it at https://vercel.com/new.
2. Add every variable from `.env.example` under **Settings → Environment Variables**.
3. Deploy, then add your domain (welearnfrenchbd.com) under **Settings → Domains**.

### 4. First login as admin
Sign in with **Google** using one of the `SUPER_ADMIN_EMAILS` (Google accounts count as verified). The shield icon in the header opens **/admin**. From there:
- **Recorded courses → Import built-in courses**, then replace the placeholder YouTube links with your real lesson videos.
- **FAQ / Reviews / Batches → Import built-in** to start editing them.
- **Payments**: check each TrxID in the bKash app, then Approve (unlocks the course and emails the student).

## Useful commands

| Command | What it does |
|---|---|
| `npm run dev` | Local development server |
| `npm run build` | Production build |
| `npm run lint` | Code checks |
| `npm run seed` | Copies built-in batches, FAQ, reviews and recorded courses into Firestore (only fills empty collections) |
| `npm run emulators` | Local Firebase for testing without a real project (needs Java 17+). Copy `.env.emulator` to `.env.local` first. |

## Where things live
- Course, FAQ, review, quiz and schedule content: `src/data/`
- Page text in both languages: `src/content/`
- Contact numbers, social links, Facebook Pixel: `src/lib/brand.ts`
- Security rules: `firestore.rules`
