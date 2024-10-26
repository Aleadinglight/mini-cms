'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export const login = async (formData: FormData) => {
  const supabase = createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    throw new Error(error.message);
  } else {
    return true;
  }
}

export const signup = async (formData: FormData) => {
  const supabase = createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { data: { user }, error } = await supabase.auth.signUp(data)

  if (error) {
    throw new Error(error.message)
  }

  return true
}

export const logout = async () => {
  const supabase = createClient();
  await supabase.auth.signOut();

  return redirect("/auth");
};