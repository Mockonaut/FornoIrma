"use client";

import { signOut } from "next-auth/react";

export function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/" })}
      className="btn-secondary text-xs px-4 py-2"
    >
      Esci
    </button>
  );
}
