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
      className="btn-ghost relative flex items-center justify-center w-8 h-8"
      aria-label={count > 0 ? `${count} notifiche non lette` : "Notifiche"}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
        <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
      </svg>
      {count > 0 && (
        <span
          className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 rounded-full flex items-center justify-center text-[10px] font-black px-1"
          style={{ background: "var(--accent)", color: "var(--background)" }}
        >
          {count > 9 ? "9+" : count}
        </span>
      )}
    </Link>
  );
}
