import sharp from 'sharp';
import { stat } from 'node:fs/promises';
const src='C:/Users/usiva/Downloads/1804dad0-1934-4f63-8ef7-32020de07dcb.png';
const out='images/book.webp';
const before=(await stat(src)).size;
await sharp(src).resize({width:900,withoutEnlargement:true}).webp({quality:84}).toFile(out);
const after=(await stat(out)).size;
console.log(`book cover: ${(before/1e6).toFixed(2)}MB -> ${(after/1024).toFixed(0)}KB (${Math.round((1-after/before)*100)}% smaller)`);
