import Link from "next/link";
import { prisma } from "@/lib/prisma";

interface Props {
  userId: string;
}

export async function NotificationBell({ userId }: Props) {
  const count = await prisma.notification.count({
    where: { userId, isRead: false },
  });

  return (
    <Link
      href="/notifiche"
      className="relative flex items-center gap-1.5 px-2 py-1.5 rounded-full transition-colors hover:bg-[var(--sand)]"
      aria-label={count > 0 ? `${count} notifiche non lette` : "Notifiche"}
    >
      {/* Campanella */}
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/>
        <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>
      </svg>
      {count > 0 && (
        <>
          <span
            className="text-xs font-bold hidden sm:inline"
            style={{ color: "var(--accent)" }}
          >
            {count > 9 ? "9+" : count}
          </span>
          {/* Pallino su mobile */}
          <span
            className="sm:hidden absolute top-0.5 right-0.5 w-2 h-2 rounded-full"
            style={{ background: "var(--accent)" }}
          />
        </>
      )}
    </Link>
  );
}
