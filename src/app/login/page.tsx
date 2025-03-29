"use client";

import { useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { NewspaperIcon } from "@heroicons/react/24/outline";
import { TopProgressBar } from "../components/TopProgress";

export default function LoginPage() {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/");
    }
  }, [status, router]);

  return (
    <>
      <TopProgressBar loading={status === "loading"} />
      <div className="flex flex-col min-h-screen items-center justify-center bg-[var(--background)] text-[var(--foreground)] px-4">
        <div className="flex items-center mb-20 gap-4">
          <NewspaperIcon
            className="size-10 mt-1"
            color="var(--gradient-start)"
          />
          <h1 className="text-5xl font-semibold text-center gradient-text">
            Strac Takehome
          </h1>
        </div>

        <div className="w-full max-w-sm rounded-2xl border border-[var(--color-card-border)] bg-[var(--color-card-bg)] shadow-xl backdrop-blur-md p-8">
          <h2 className="text-3xl font-semibold text-center mb-6">Welcome</h2>
          <p className="text-center text-sm text-gray-500 mb-8">
            Sign in to your account to access your documents.
          </p>
          <button
            onClick={() => signIn("google", { callbackUrl: "/" })}
            className="relative w-full bg-[var(--accent)] text-black font-medium py-3 rounded-lg hover:bg-[var(--accent-hover)] transition-all"
          >
            <span className="block text-center">Continue with Google</span>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24"
                viewBox="0 0 24 24"
                width="24"
              >
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
                <path d="M1 1h22v22H1z" fill="none" />
              </svg>
            </div>
          </button>
        </div>
      </div>
    </>
  );
}
