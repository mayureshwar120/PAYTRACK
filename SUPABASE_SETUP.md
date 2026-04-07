# PayTrack + Supabase — setup guide

This app uses **Supabase** for **authentication** (email/password) and a **Postgres** database. **Row Level Security (RLS)** ensures each signed-in user only reads and writes **their own** rows.

---

## 1. Create a Supabase project

1. Go to [https://supabase.com](https://supabase.com) and sign in.
2. Click **New project**, choose org, name, database password, and region.
3. Wait until the project finishes provisioning.

---

## 2. Create database tables and policies

1. In the Supabase dashboard, open **SQL Editor**.
2. Click **New query**.
3. Copy the full contents of:

   `supabase/migrations/20250405120000_initial_schema.sql`

4. Paste into the editor and click **Run**.

You should see **Success**. This creates:

| Table | Purpose |
|--------|--------|
| `profiles` | One row per user (budget, display name, role, institution, email copy). |
| `categories` | User-defined categories for expenses/income. |
| `transactions` | Expenses and income (`kind` = `expense` or `income`). |
| `savings_goals` | Savings goals with target and saved amounts. |

It also:

- Enables **RLS** on all tables with policies so `auth.uid()` matches `id` or `user_id`.
- Adds a **trigger** on `auth.users` to insert a `profiles` row when someone signs up.

### If the trigger fails to run

Postgres may expect `EXECUTE FUNCTION` instead of `EXECUTE PROCEDURE`. In that case, in SQL Editor run:

```sql
drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
```

---

## 3. Get API keys for the frontend

1. In the dashboard: **Project Settings** (gear) → **API**.
2. Copy:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon public** key → `VITE_SUPABASE_ANON_KEY`  
     (Use the **anon** key in the browser — never the **service_role** key in client code.)

---

## 4. Configure environment variables locally

1. In the project root (next to `package.json`), create a file named **`.env`** (not committed to git).
2. Add:

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

3. You can copy from **`.env.example`** and fill in real values.

4. Restart the dev server after changing `.env`:

```bash
npm run dev
```

Vite only exposes variables that start with `VITE_`.

---

## 5. Auth settings (recommended for development)

For quick local testing you can relax email confirmation:

1. **Authentication** → **Providers** → **Email** — enable email provider.
2. **Authentication** → **Providers** → **Email** (or **Auth** → **Email templates**) — optionally **disable “Confirm email”** for dev so sign-up logs in immediately.

For production, keep **email confirmation** enabled and handle the “check your email” flow in the UI (the Sign up page already shows a message when no session is returned).

---

## 6. Run the app

```bash
npm install
npm run dev
```

1. Open the app, go to **Sign up**, create an account.
2. You should land on the dashboard; default **categories** are created on first load.
3. Add **expenses** / **income**, **budget** in Settings, **goals** under **Goals**, and **profile** on the Profile page — all stored under your user in Supabase.

---

## 7. Security notes

- **RLS** is enforced in the database; the anon key is safe in the browser **only** with correct policies.
- Do **not** put the **service_role** key in the React app.
- Users can only `select`/`insert`/`update`/`delete` rows where `user_id` (or `id` for `profiles`) equals their `auth.uid()`.

---

## 8. Optional: Supabase CLI migrations

If you use the [Supabase CLI](https://supabase.com/docs/guides/cli), you can link the project and run:

```bash
supabase db push
```

…instead of pasting SQL manually. The migration file in `supabase/migrations/` is the source of truth for the schema.

---

## Troubleshooting

| Issue | What to check |
|--------|----------------|
| “Supabase is not configured” | `.env` exists, keys correct, dev server restarted. |
| Sign up works but no data | RLS policies and trigger; confirm SQL ran without errors. |
| Duplicate category / unique errors | Category names are unique per user; pick a different name. |
| CORS / network errors | URL must match your Supabase project URL exactly. |

For more detail, see [Supabase Auth](https://supabase.com/docs/guides/auth) and [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security).
