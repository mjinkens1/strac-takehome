'use client';

import { NewspaperIcon } from '@heroicons/react/24/outline';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { TopProgressBar } from '../components/TopProgress';
import { GoogleIcon } from './components/GoogleIcon';

export default function LoginPage() {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated') {
      router.replace('/');
    }
  }, [status, router]);

  if ((status !== 'authenticated' && status === 'loading') || status === 'authenticated') {
    return <TopProgressBar loading />;
  }

  return (
    <>
      <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--background)] px-4 text-[var(--foreground)]">
        <div className="mb-20 flex items-center gap-4">
          <NewspaperIcon className="mt-1 size-10" color="var(--gradient-start)" />
          <h1 className="gradient-text text-center text-5xl font-semibold">Strac Takehome</h1>
        </div>

        <div className="w-full max-w-sm rounded-2xl border border-[var(--color-card-border)] bg-[var(--color-card-bg)] p-8 shadow-xl backdrop-blur-md">
          <h2 className="mb-6 text-center text-3xl font-semibold">Welcome</h2>
          <p className="mb-8 text-center text-sm text-gray-500">
            Sign in to your account to access your documents.
          </p>
          <button
            onClick={() => signIn('google', { callbackUrl: '/' })}
            className="relative w-full rounded-lg bg-[var(--accent)] py-3 font-medium text-black transition-all hover:bg-[var(--accent-hover)]"
          >
            <span className="block text-center">Continue with Google</span>
            <div className="absolute top-1/2 right-4 h-5 w-5 -translate-y-1/2">
              <GoogleIcon />
            </div>
          </button>
        </div>
      </div>
    </>
  );
}
