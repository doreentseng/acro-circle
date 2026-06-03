'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function LoginForm() {
  const [username, setUsername] = useState('');
  const [sesame, setSesame] = useState('');
  const [error, setError] = useState('');

  const router = useRouter();

  async function handleLogin() {
    setError('');

    // get email by username
    const { data, error } = await supabase
      .from('users')
      .select('id, email')
      .eq('username', username)
      .single();

    console.log('Login query result:', { data, error });

    if (error || !data) {
      setError('查無此使用者');
      return;
    }
    console.log('Found data:', data);

    // login with email and password
    const { data: authData, error: authError } =
      await supabase.auth.signInWithPassword({
        email: data.email,
        password: sesame,
      });
    console.log('authData1:', authData);

    if (authError) {
      setError('密碼錯誤');
      return;
    }

    await supabase.auth.updateUser({
      data: {
        userId: String(data.id),
      },
    });

    router.push('/dashboard');
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleLogin();
      }}
      className="w-80 rounded-xl bg-white p-6 shadow"
    >
      <h1 className="mb-4 text-lg font-semibold">Acro Circle</h1>

      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="輸入帳號"
        className="w-full rounded border px-3 py-2 mb-2"
      />

      <input
        type="password"
        value={sesame}
        onChange={(e) => setSesame(e.target.value)}
        placeholder="輸入密碼"
        className="w-full rounded border px-3 py-2"
      />

      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}

      <button
        onClick={handleLogin}
        className="mt-4 w-full rounded bg-zinc-900 py-2 text-white"
      >
        進入
      </button>
    </form>
  );
}
