import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

const publicDir = path.resolve(process.cwd(), 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// 1. Create Brand SVG icon
const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#022c22" />
      <stop offset="50%" stop-color="#064e3b" />
      <stop offset="100%" stop-color="#020617" />
    </linearGradient>
    <linearGradient id="accent" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#34d399" />
      <stop offset="100%" stop-color="#06b6d4" />
    </linearGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="16" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>
  <!-- Background -->
  <rect width="512" height="512" rx="128" fill="url(#bg)" stroke="#10b981" stroke-opacity="0.3" stroke-width="8" />
  
  <!-- Outer Glow Circle -->
  <circle cx="256" cy="256" r="180" fill="none" stroke="url(#accent)" stroke-width="4" stroke-opacity="0.4" stroke-dasharray="12 12" />
  
  <!-- Sound Waves (Left) -->
  <path d="M 120 220 Q 90 256 120 292" fill="none" stroke="url(#accent)" stroke-width="12" stroke-linecap="round" opacity="0.8" />
  <path d="M 90 190 Q 50 256 90 322" fill="none" stroke="url(#accent)" stroke-width="10" stroke-linecap="round" opacity="0.5" />

  <!-- Sound Waves (Right) -->
  <path d="M 392 220 Q 422 256 392 292" fill="none" stroke="url(#accent)" stroke-width="12" stroke-linecap="round" opacity="0.8" />
  <path d="M 422 190 Q 462 256 422 322" fill="none" stroke="url(#accent)" stroke-width="10" stroke-linecap="round" opacity="0.5" />

  <!-- Center Kannada 'ಕ' Letter -->
  <text x="256" y="320" font-family="'Noto Sans Kannada', sans-serif" font-size="220" font-weight="bold" fill="url(#accent)" text-anchor="middle" filter="url(#glow)">ಕ</text>
  
  <!-- Subtitle -->
  <text x="256" y="440" font-family="sans-serif" font-size="26" font-weight="600" fill="#a7f3d0" text-anchor="middle" letter-spacing="4">VOICE OF KANNADA</text>
</svg>`;

fs.writeFileSync(path.join(publicDir, 'icon.svg'), svgContent, 'utf-8');

// Function to generate raw PNG file with RGBA pixels
function createPng(width, height, r, g, b) {
  // Simple PNG encoder in pure node
  function crc32(buf) {
    let table = [];
    for (let n = 0; n < 256; n++) {
      let c = n;
      for (let k = 0; k < 8; k++) {
        if (c & 1) c = 0xedb88320 ^ (c >>> 1);
        else c = c >>> 1;
      }
      table[n] = c;
    }
    let c = 0xffffffff;
    for (let i = 0; i < buf.length; i++) {
      c = table[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
    }
    return (c ^ 0xffffffff) >>> 0;
  }

  function chunk(type, data) {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length, 0);
    const typeBuf = Buffer.from(type, 'ascii');
    const crcBuf = Buffer.alloc(4);
    const crc = crc32(Buffer.concat([typeBuf, data]));
    crcBuf.writeUInt32BE(crc, 0);
    return Buffer.concat([len, typeBuf, data, crcBuf]);
  }

  // PNG header
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // 8 bits per sample
  ihdrData[9] = 6; // color type RGBA
  ihdrData[10] = 0; // compression
  ihdrData[11] = 0; // filter
  ihdrData[12] = 0; // interlace
  const ihdrChunk = chunk('IHDR', ihdrData);

  // Scanlines: filter byte (0) + width * 4 (RGBA)
  const scanlineLength = 1 + width * 4;
  const rawData = Buffer.alloc(height * scanlineLength);

  const cx = width / 2;
  const cy = height / 2;
  const maxR = width * 0.45;

  for (let y = 0; y < height; y++) {
    const rowOffset = y * scanlineLength;
    rawData[rowOffset] = 0; // Filter None
    for (let x = 0; x < width; x++) {
      const pxOffset = rowOffset + 1 + x * 4;
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < maxR) {
        // Emerald/Teal gradient center
        const ratio = dist / maxR;
        rawData[pxOffset] = Math.round(r * (1 - ratio * 0.4));
        rawData[pxOffset + 1] = Math.round(g * (1 - ratio * 0.3));
        rawData[pxOffset + 2] = Math.round(b * (1 - ratio * 0.2));
        rawData[pxOffset + 3] = 255;
      } else {
        // Dark navy slate
        rawData[pxOffset] = 2;
        rawData[pxOffset + 1] = 6;
        rawData[pxOffset + 2] = 23;
        rawData[pxOffset + 3] = 255;
      }
    }
  }

  const compressedData = zlib.deflateSync(rawData);
  const idatChunk = chunk('IDAT', compressedData);
  const iendChunk = chunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

const png192 = createPng(192, 192, 16, 185, 129); // #10b981 emerald
const png512 = createPng(512, 512, 16, 185, 129);
const applePng = createPng(180, 180, 6, 78, 59);

fs.writeFileSync(path.join(publicDir, 'pwa-192x192.png'), png192);
fs.writeFileSync(path.join(publicDir, 'pwa-512x512.png'), png512);
fs.writeFileSync(path.join(publicDir, 'pwa-maskable-512x512.png'), png512);
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), applePng);
fs.writeFileSync(path.join(publicDir, 'favicon.ico'), png192);

console.log('PWA icons successfully generated in /public!');
