'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import PageHeader from './ui/PageHeader';
import { inputClass } from '@/lib/styles/input';

export default function LoginForm() {
  const [username, setUsername] = useState('');
  const [sesame, setSesame] = useState('');
  const [error, setError] = useState('');
  const [isEntering, setIsEntering] = useState(false);

  const router = useRouter();

  const handleLogin = async () => {
    setError('');
    setIsEntering(true);

    // get email by username
    const { data, error } = await supabase
      .from('users')
      .select('id, email')
      .eq('username', username)
      .single();

    console.log('Login query result:', { data, error });

    if (error || !data) {
      setError('查無此使用者');
      setIsEntering(false);
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
      setIsEntering(false);
      return;
    }

    await supabase.auth.updateUser({
      data: {
        userId: String(data.id),
      },
    });
    setIsEntering(false);
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-zinc-100 flex justify-center items-start pt-30 px-6">
      <div className="w-full max-w-6xl">
        <PageHeader />
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleLogin();
          }}
          className="w-80 rounded-md bg-white p-6 shadow space-y-3"
        >
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value.toLowerCase())}
            placeholder="輸入帳號"
            className={inputClass}
          />
          <input
            type="password"
            value={sesame}
            onChange={(e) => setSesame(e.target.value)}
            placeholder="輸入密碼"
            className={inputClass}
          />

          {error && <p className=" text-sm text-red-500">{error}</p>}

          <button
            type="submit"
            disabled={isEntering}
            className="w-full px-4 py-2 rounded-md bg-pink-500 text-white transition cursor-pointer
              hover:bg-pink-400
              disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-pink-400"
          >
            {isEntering ? '驗證中...' : '進入'}
          </button>
        </form>
      </div>
    </div>
  );
}
