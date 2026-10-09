/** EXIF-Aufnahmezeit für die Bildunterschrift der Fotopaare (C5) */
import { describe, expect, it } from 'vitest';
import sharp from 'sharp';
import { exifZeit } from '@/lib/exif';

describe('exifZeit', () => {
  it('liest DateTimeOriginal aus einem JPEG', async () => {
    const jpeg = await sharp({ create: { width: 8, height: 8, channels: 3, background: '#888' } })
      .withExif({ IFD0: { Make: 'Test' }, IFD2: { DateTimeOriginal: '2026:10:12 21:40:05' } })
      .jpeg()
      .toBuffer();
    expect(exifZeit(new Uint8Array(jpeg))).toBe('21:40');
  });
  it('ohne EXIF: null', async () => {
    const jpeg = await sharp({ create: { width: 8, height: 8, channels: 3, background: '#888' } }).jpeg().toBuffer();
    expect(exifZeit(new Uint8Array(jpeg))).toBeNull();
  });
});
