import { createClient } from "@supabase/supabase-js";

const BUCKET = "product-images";

function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Supabase Storage env vars not set");
  return createClient(url, key);
}

export async function uploadProductImage(
  productId: string,
  file: File
): Promise<string> {
  const supabase = getAdminClient();
  const ext = file.name.split(".").pop() ?? "jpg";
  const path = `${productId}/${Date.now()}.${ext}`;

  const bytes = await file.arrayBuffer();
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, bytes, { contentType: file.type, upsert: true });

  if (error) throw new Error(error.message);

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
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
