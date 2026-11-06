/** A profile photo never needs more than this, even on a large screen */
const MAX_SIDE_PX = 512;

/** JPEG quality: small file, still sharp at avatar size */
const JPEG_QUALITY = 0.85;

/** Files this small are sent as they are */
const SKIP_BELOW_BYTES = 100 * 1024;

function toBlob(
  canvas: HTMLCanvasElement,
  type: string,
  quality: number,
): Promise<Blob | null> {
  return new Promise((resolve) => canvas.toBlob(resolve, type, quality));
}

function withJpegName(name: string): string {
  const dot = name.lastIndexOf(".");
  return `${dot > 0 ? name.slice(0, dot) : name}.jpg`;
}

/**
 * Shrinks a profile photo before it is sent: at most 512 px on the longest
 * side, as a JPEG. A 2 MB PNG becomes about 100 KB, so the upload is fast even
 * on a slow connection. If anything goes wrong, the original file is returned
 * and the upload works as before.
 */
export async function prepareProfileImage(file: File): Promise<File> {
  if (!file.type.startsWith("image/") || file.size <= SKIP_BELOW_BYTES)
    return file;

  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(
      1,
      MAX_SIDE_PX / Math.max(bitmap.width, bitmap.height),
    );
    const width = Math.max(1, Math.round(bitmap.width * scale));
    const height = Math.max(1, Math.round(bitmap.height * scale));

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext("2d");
    if (!context) {
      bitmap.close();
      return file;
    }

    // JPEG has no transparency: a transparent PNG would turn black without this
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, width, height);
    context.drawImage(bitmap, 0, 0, width, height);
    bitmap.close();

    const blob = await toBlob(canvas, "image/jpeg", JPEG_QUALITY);
    if (!blob || blob.size >= file.size) return file;

    return new File([blob], withJpegName(file.name), {
      type: "image/jpeg",
      lastModified: Date.now(),
    });
  } catch {
    return file;
  }
}
