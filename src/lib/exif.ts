/**
 * Liest die Aufnahmezeit (EXIF DateTimeOriginal, sonst DateTime) aus einer JPEG-Datei.
 * Die Bildunterschrift der Fotopaare nennt diese Uhrzeit (C5), wenn `uhrzeit` in den
 * Projektdaten leer ist. Bewusst ohne Bibliothek: nur TIFF-Header und zwei IFDs.
 */
export function exifZeit(buf: Uint8Array): string | null {
  const view = new DataView(buf.buffer, buf.byteOffset, buf.byteLength);
  if (view.getUint16(0) !== 0xffd8) return null; // kein JPEG
  let off = 2;
  while (off + 4 < buf.length) {
    if (buf[off] !== 0xff) return null;
    const marker = buf[off + 1];
    const len = view.getUint16(off + 2);
    if (marker === 0xe1 && String.fromCharCode(...buf.subarray(off + 4, off + 10)) === 'Exif\0\0') {
      return ausTiff(buf.subarray(off + 10, off + 2 + len));
    }
    if (marker === 0xda) return null; // Bilddaten beginnen, kein EXIF
    off += 2 + len;
  }
  return null;
}

/** Aus einem TIFF-Block (beginnt mit II* oder MM*). */
export function ausTiff(tiff: Uint8Array): string | null {
  const v = new DataView(tiff.buffer, tiff.byteOffset, tiff.byteLength);
  const le = tiff[0] === 0x49; // 'I'
  const u16 = (o: number) => v.getUint16(o, le);
  const u32 = (o: number) => v.getUint32(o, le);
  const ascii = (o: number, n: number) => String.fromCharCode(...tiff.subarray(o, o + n)).replace(/\0+$/, '');

  const lies = (ifd: number): Map<number, string | number> => {
    const tags = new Map<number, string | number>();
    if (ifd <= 0 || ifd + 2 > tiff.length) return tags;
    const n = u16(ifd);
    for (let i = 0; i < n; i++) {
      const e = ifd + 2 + i * 12;
      if (e + 12 > tiff.length) break;
      const tag = u16(e);
      const typ = u16(e + 2);
      const anzahl = u32(e + 4);
      if (typ === 2) tags.set(tag, ascii(anzahl <= 4 ? e + 8 : u32(e + 8), anzahl));
      else if (typ === 4) tags.set(tag, u32(e + 8));
    }
    return tags;
  };

  const ifd0 = lies(u32(4));
  const exifZeiger = ifd0.get(0x8769);
  const exif = typeof exifZeiger === 'number' ? lies(exifZeiger) : new Map();
  const wert = exif.get(0x9003) ?? ifd0.get(0x0132); // DateTimeOriginal, sonst DateTime
  const m = typeof wert === 'string' ? wert.match(/^\d{4}:\d{2}:\d{2} (\d{2}):(\d{2})/) : null;
  return m ? `${m[1]}:${m[2]}` : null;
}
