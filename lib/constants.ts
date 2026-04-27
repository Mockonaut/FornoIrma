// Durate token (ms)
export const EMAIL_VERIFICATION_EXPIRY_MS = 24 * 60 * 60 * 1000; // 24 ore
export const PASSWORD_RESET_EXPIRY_MS = 60 * 60 * 1000;           // 1 ora
export const PASSWORD_RESET_COOLDOWN_MS = 10 * 60 * 1000;         // 10 minuti tra un reset e l'altro

// Immagini prodotto
export const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
export const MAX_IMAGE_SIZE_LABEL = "5 MB";
export const ALLOWED_IMAGE_MIMES = ["image/jpeg", "image/png", "image/webp"] as const;
export const ALLOWED_IMAGE_EXTS = ["jpg", "jpeg", "png", "webp"] as const;

// Prenotazioni
export const DEFAULT_MAX_ORDERS_PER_SLOT = 20;
