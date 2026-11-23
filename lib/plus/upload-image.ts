/**
 * Make a picked photo safe to upload. The server's image library cannot decode iPhone HEIC/HEIF photos,
 * and Safari hands those over as-is from the Photos library. The browser can draw them, so we re-encode
 * to JPEG here. Large photos are also shrunk (the server resizes to 1600px anyway) so uploads stay fast
 * on mobile data. JPEG/PNG/WebP under the size limit pass through untouched.
 */
const PASS_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_PASS_BYTES = 4 * 1024 * 1024;
const MAX_EDGE = 2400;

function isHeic(file: File): boolean {
  const type = (file.type || "").toLowerCase();
  return type.includes("heic") || type.includes("heif") || /\.(heic|heif)$/i.test(file.name);
}

async function decode(file: File): Promise<{ draw: CanvasImageSource; width: number; height: number; close: () => void }> {
  if (typeof createImageBitmap === "function") {
    try {
      const bmp = await createImageBitmap(file, { imageOrientation: "from-image" });
      return { draw: bmp, width: bmp.width, height: bmp.height, close: () => bmp.close() };
    } catch {
      /* Safari can fail createImageBitmap on HEIC; fall back to <img>. */
    }
  }
  const url = URL.createObjectURL(file);
  try {
    const img = new Image();
    img.decoding = "async";
    img.src = url;
    await img.decode();
    return { draw: img, width: img.naturalWidth, height: img.naturalHeight, close: () => URL.revokeObjectURL(url) };
  } catch (error) {
    URL.revokeObjectURL(url);
    throw error;
  }
}

export async function prepareImageForUpload(file: File): Promise<File> {
  const type = (file.type || "").toLowerCase();
  if (PASS_TYPES.includes(type) && file.size <= MAX_PASS_BYTES && !isHeic(file)) return file;
  if (typeof document === "undefined") return file;
  let source: Awaited<ReturnType<typeof decode>>;
  try {
    source = await decode(file);
  } catch {
    return file; // the browser cannot read it either; let the server give its own message
  }
  try {
    const scale = Math.min(1, MAX_EDGE / Math.max(source.width, source.height));
    const w = Math.max(1, Math.round(source.width * scale));
    const h = Math.max(1, Math.round(source.height * scale));
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;
    ctx.drawImage(source.draw, 0, 0, w, h);
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.88));
    if (!blob) return file;
    const name = (file.name || "photo").replace(/\.[^.]+$/, "") + ".jpg";
    return new File([blob], name, { type: "image/jpeg", lastModified: Date.now() });
  } finally {
    source.close();
  }
}
