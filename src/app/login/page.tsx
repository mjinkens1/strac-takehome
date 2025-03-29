"use client";

import { useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/");
    }
  }, [status, router]);

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="flex flex-col gap-4 items-center rounded-xl border bg-background p-10 shadow-md">
        <h1 className="mb-6 text-center text-2xl font-semibold">
          Log in with Google
        </h1>
        <button
          onClick={() => signIn("google", { callbackUrl: "/" })}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
        >
          Sign in with Google
        </button>
      </div>
    </div>
  );
}
