/**
 * Generates the QR code that goes on the physical game box.
 *
 *   npm run generate-qr -- https://your-app.vercel.app
 *
 * Writes a print-ready PNG and an SVG to /public/qr/. The SVG is the one to
 * hand to a printer — it scales to any box size without pixelation.
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import QRCode from "qrcode";

const OUTPUT_DIR = path.join(process.cwd(), "public", "qr");

async function main() {
  const url = process.argv[2] || process.env.NEXT_PUBLIC_APP_URL;

  if (!url) {
    console.error(
      'Usage: npm run generate-qr -- "https://your-app.vercel.app"\n' +
        "(or set NEXT_PUBLIC_APP_URL in your environment)",
    );
    process.exit(1);
  }

  try {
    new URL(url);
  } catch {
    console.error(`Not a valid URL: ${url}`);
    process.exit(1);
  }

  await mkdir(OUTPUT_DIR, { recursive: true });

  // High error correction so the code still scans with a logo sticker over a
  // corner, or with a scuff from the box being handled.
  const options = { errorCorrectionLevel: "H" as const, margin: 2 };

  const pngPath = path.join(OUTPUT_DIR, "tcg-rules-assistant.png");
  const svgPath = path.join(OUTPUT_DIR, "tcg-rules-assistant.svg");

  await QRCode.toFile(pngPath, url, { ...options, type: "png", width: 1024 });
  await writeFile(svgPath, await QRCode.toString(url, { ...options, type: "svg" }), "utf8");

  console.log(`\nQR code generated for: ${url}`);
  console.log(`  ${path.relative(process.cwd(), pngPath)}  (1024×1024 PNG)`);
  console.log(`  ${path.relative(process.cwd(), svgPath)}  (vector — use this for print)\n`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
