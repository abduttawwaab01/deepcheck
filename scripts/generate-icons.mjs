import sharp from "sharp";
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const svg = readFileSync(join(__dirname, "..", "public", "icons", "icon.svg"), "utf-8");

const sizes = [48, 72, 96, 128, 192, 384, 512];
const outDir = join(__dirname, "..", "public", "icons");

for (const size of sizes) {
  await sharp(Buffer.from(svg))
    .resize(size, size)
    .png()
    .toFile(join(outDir, `icon-${size}x${size}.png`));
  console.log(`Generated icon-${size}x${size}.png`);
}

// Apple icon (180x180)
await sharp(Buffer.from(svg))
  .resize(180, 180)
  .png()
  .toFile(join(__dirname, "..", "public", "apple-icon.png"));
console.log("Generated apple-icon.png");

// Favicon (32x32)
await sharp(Buffer.from(svg))
  .resize(32, 32)
  .png()
  .toFile(join(__dirname, "..", "public", "favicon.png"));
console.log("Generated favicon.png");