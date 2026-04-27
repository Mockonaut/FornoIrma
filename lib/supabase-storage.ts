import { createClient } from "@supabase/supabase-js";

const BUCKET = "product-images";

function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Supabase Storage env vars not set");
  return createClient(url, key);
}

const ALLOWED_MIMES = ["image/jpeg", "image/png", "image/webp"];
const ALLOWED_EXTS = ["jpg", "jpeg", "png", "webp"];
const MAX_SIZE_BYTES = 5 * 1024 * 1024;

export async function uploadProductImage(
  productId: string,
  file: File
): Promise<string> {
  if (!ALLOWED_MIMES.includes(file.type)) throw new Error("Tipo file non consentito. Usa JPEG, PNG o WebP.");
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
  if (!ALLOWED_EXTS.includes(ext)) throw new Error("Estensione file non consentita.");
  if (file.size > MAX_SIZE_BYTES) throw new Error("Il file supera il limite di 5 MB.");

  const supabase = getAdminClient();
  const safePath = `${productId}/${Date.now()}.${ext}`;

  const bytes = await file.arrayBuffer();
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(safePath, bytes, { contentType: file.type, upsert: true });

  if (error) throw new Error(error.message);

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(safePath);
  return data.publicUrl;
}

export async function deleteProductImage(url: string): Promise<void> {
  const supabase = getAdminClient();
  // Estrai il path dall'URL pubblico
  const marker = `/${BUCKET}/`;
  const idx = url.indexOf(marker);
  if (idx === -1) return;
  const path = url.slice(idx + marker.length);
  await supabase.storage.from(BUCKET).remove([path]);
}
