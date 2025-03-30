"use client";

import { useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { NewspaperIcon } from "@heroicons/react/24/outline";
import { TopProgressBar } from "../components/TopProgress";
import { GoogleIcon } from "./components/GoogleIcon";

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
              <GoogleIcon />
            </div>
          </button>
        </div>
      </div>
    </>
  );
}
