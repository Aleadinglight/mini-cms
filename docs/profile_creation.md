# Supabase Automatic Profile Creation

This setup automatically creates a user profile in the `public.profiles` table whenever a new user is added to the `auth.users` table in Supabase.

## Implementation

The following SQL script sets up the necessary function and trigger:

```sql
-- Function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$;

-- Trigger to execute the function on new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

## How it works

1. The `handle_new_user()` function is set up to insert a new row into the `public.profiles` table.
2. The function uses `SECURITY DEFINER` to run with elevated permissions.
3. A trigger `on_auth_user_created` is created on the `auth.users` table.
4. Whenever a new user is added to `auth.users`, the trigger automatically executes `handle_new_user()`.
5. This inserts a new profile with the same `id` as the newly created user.

## Setup

1. Ensure you have a `public.profiles` table with an `id` column of type UUID.
2. Run the SQL script in your Supabase SQL editor or via any PostgreSQL client connected to your Supabase database.

## Notes

- Adjust the `INSERT` statement in the function if your `profiles` table has additional required columns.
- Ensure proper permissions and RLS policies are set on the `profiles` table as needed for your application.