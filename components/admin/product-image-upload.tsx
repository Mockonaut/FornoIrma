"use client";

import { useRef, useState, useTransition } from "react";
import Image from "next/image";
import { upsertProductImageAction } from "@/lib/actions";

interface Props {
  productId: string;
  currentImageUrl: string | null;
  productName: string;
}

export function ProductImageUpload({ productId, currentImageUrl, productName }: Props) {
  const [preview, setPreview] = useState<string | null>(currentImageUrl);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validazione client-side
    if (!file.type.startsWith("image/")) {
      setError("Solo file immagine (JPG, PNG, WebP)");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Dimensione massima: 5 MB");
      return;
    }

    setError(null);
    setPreview(URL.createObjectURL(file));

    const formData = new FormData();
    formData.append("productId", productId);
    formData.append("file", file);

    startTransition(async () => {
      const result = await upsertProductImageAction(formData);
      if (result?.error) setError(result.error);
    });
  }

  return (
    <div className="flex items-center gap-4">
      {/* Thumbnail */}
      <div
        className="relative shrink-0 rounded-lg overflow-hidden"
        style={{ width: 56, height: 56, background: "var(--sand)" }}
      >
        {preview ? (
          <Image src={preview} alt={productName} fill className="object-cover" sizes="56px" />
        ) : (
          <div className="w-full h-full flex items-center justify-center" style={{ color: "var(--muted)" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="3" width="18" height="18" rx="2"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <path d="m21 15-5-5L5 21"/>
            </svg>
          </div>
        )}
        {isPending && (
          <div className="absolute inset-0 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.4)" }}>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>

      {/* Azioni */}
      <div className="flex flex-col gap-1 min-w-0">
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={isPending}
          className="btn-ghost text-xs py-1 px-3 whitespace-nowrap"
        >
          {preview ? "Cambia foto" : "Carica foto"}
        </button>
        {error && <p className="text-xs" style={{ color: "var(--accent)" }}>{error}</p>}
        {isPending && <p className="text-xs" style={{ color: "var(--muted)" }}>Caricamento…</p>}
      </div>
    </div>
  );
}
