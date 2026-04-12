"use client";

import { useEffect, useState } from "react";
import { getOpenStatus } from "@/lib/utils";

type OpeningHour = { day: string; hours: string };

function computeStatus(hours: OpeningHour[]) {
  return getOpenStatus(hours, new Date());
}

export function OpenStatusBadge({
  openingHours,
  size = "sm",
}: {
  openingHours: OpeningHour[];
  size?: "sm" | "md";
}) {
  const [status, setStatus] = useState(() => computeStatus(openingHours));

  useEffect(() => {
    // Refresh every 30 seconds — snappy at opening/closing transitions
    const id = setInterval(() => setStatus(computeStatus(openingHours)), 30_000);
    return () => clearInterval(id);
  }, [openingHours]);

  const dot = status.open ? "bg-emerald-500" : "bg-rose-400";
  const textColor = status.open ? "#166534" : "#9f1239";
  const bg = status.open ? "#dcfce7" : "#fff1f2";

  if (size === "sm") {
    return (
      <span
        className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold"
        style={{ background: bg, color: textColor }}
      >
        <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
        {status.label}
        {status.nextChange && (
          <span className="font-normal opacity-70">
            · {status.open ? "chiude" : "apre"} alle {status.nextChange}
          </span>
        )}
      </span>
    );
  }

  return (
    <div
      className="inline-flex items-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-semibold"
      style={{ background: bg, color: textColor }}
    >
      <span className={`h-2.5 w-2.5 rounded-full ${dot} animate-pulse`} />
      <span>{status.label}</span>
      {status.nextChange && (
        <span className="font-normal opacity-70">
          — {status.open ? "chiude" : "apre"} alle {status.nextChange}
        </span>
      )}
    </div>
  );
}
