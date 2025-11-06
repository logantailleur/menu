# Vercel Deployment Guide

This guide will help you set up your environment variables correctly for Vercel deployment.

## Required Environment Variables

You need to set the following environment variables in your Vercel project:

### 1. Database Connection (`DATABASE_URL`)

**For Supabase (Recommended):**

1. Go to your Supabase project dashboard
2. Navigate to **Settings** → **Database**
3. Scroll down to **Connection string** section
4. **IMPORTANT:** Select **Connection pooling** mode (not Direct connection)
5. Copy the connection string in **URI** format
6. It should look like:
   ```
   postgresql://postgres.xxxxx:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres
   ```
   - Port `6543` indicates connection pooling (required for serverless)
   - Port `5432` is direct connection (not recommended for Vercel)

**Why Connection Pooling?**
- Vercel runs serverless functions that create many short-lived connections
- Direct connections can exhaust your database connection limit
- Connection pooling reuses connections efficiently

### 2. Supabase Client Variables

**For Client-Side (Required):**
- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
  - Found in: **Settings** → **API** → **Project URL**
  - Example: `https://xxxxx.supabase.co`

- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous/public key
  - Found in: **Settings** → **API** → **anon/public** key
  - This is safe to expose to the browser

## Setting Environment Variables in Vercel

1. Go to your Vercel project dashboard
2. Click on **Settings** → **Environment Variables**
3. Add each variable:
   - **Key**: `DATABASE_URL`
   - **Value**: Your connection string (from step above)
   - **Environment**: Select all (Production, Preview, Development)
4. Repeat for `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## After Adding Variables

1. **Redeploy your application** for changes to take effect
   - Go to **Deployments** tab
   - Click the three dots (⋯) on the latest deployment
   - Select **Redeploy**

## Troubleshooting

### Error: "prepared statement 's0' already exists"

This error occurs when using Prisma with PgBouncer (Supabase's connection pooler) in transaction pooling mode. Prisma uses prepared statements by default, but PgBouncer doesn't maintain session state between transactions.

**Solution:**
The application automatically adds the required parameters to your connection string:
- `pgbouncer=true` - Tells Prisma to disable prepared statements
- `connection_limit=1` - Optimizes for serverless environments

**If you still see this error:**
1. Make sure your `DATABASE_URL` includes `?pgbouncer=true` (the app will add it automatically if missing)
2. Verify you're using the connection pooler (port 6543), not direct connection (port 5432)
3. Redeploy your application after updating environment variables

### Error: "Tenant or user not found" or "FATAL"

This error means your `DATABASE_URL` is incorrect or missing.

**Common causes:**
1. ❌ Using direct connection (port 5432) instead of pooler (port 6543)
2. ❌ Wrong password in connection string
3. ❌ Missing `DATABASE_URL` environment variable
4. ❌ Connection string not copied correctly
5. ❌ Special characters in password not URL-encoded

**Your connection string should look like:**
```
postgresql://postgres.xxxxx:[PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true
```

**Important notes:**
- If your password contains special characters (like `@`, `#`, `%`, `&`, etc.), they must be URL-encoded in the connection string
  - `@` becomes `%40`
  - `#` becomes `%23`
  - `%` becomes `%25`
  - `&` becomes `%26`
- The `?pgbouncer=true` parameter is optional but recommended
- Make sure there are no extra spaces or line breaks in the connection string

**Fix:**
1. Verify you're using the **Connection pooling** string from Supabase
2. Double-check the password is correct and URL-encoded if needed
3. Make sure `DATABASE_URL` is set in Vercel environment variables (check all environments: Production, Preview, Development)
4. In Vercel, go to Settings → Environment Variables and verify the value is exactly as copied
5. Redeploy after adding/updating variables
6. Check Vercel function logs for more detailed error messages

### Error: "Missing Supabase environment variables"

This means `NEXT_PUBLIC_SUPABASE_URL` or `NEXT_PUBLIC_SUPABASE_ANON_KEY` is missing.

**Fix:**
1. Add both variables to Vercel environment variables
2. Make sure they're prefixed with `NEXT_PUBLIC_` (required for client-side access)
3. Redeploy your application

## Verification

After deployment, check your Vercel function logs:
1. Go to **Deployments** tab
2. Click on your latest deployment
3. Click **Functions** tab to see serverless function logs
4. Look for any connection errors or missing variable warnings

## Security Notes

- ✅ `NEXT_PUBLIC_*` variables are safe to expose to the browser
- ❌ Never expose `DATABASE_URL` to the client (it doesn't have `NEXT_PUBLIC_` prefix)
- ✅ Use connection pooling for serverless environments
- ✅ Keep your database password secure and never commit it to git

