import sharp from 'sharp';
for (const f of ['images/hero-amulet.webp','C:/Users/usiva/Downloads/75774a25-76ad-474a-9cc8-e0b69c0b2f55.png']){
  const img=sharp(f); const m=await img.metadata();
  // sample a few points to detect a checker pattern in the background
  const raw=await img.ensureAlpha().raw().toBuffer({resolveWithObject:true});
  const {width,height,channels}=raw.info; const d=raw.data;
  function px(x,y){const i=(y*width+x)*channels;return [d[i],d[i+1],d[i+2],channels>3?d[i+3]:255];}
  console.log(`\n${f}\n  ${width}x${height} ch=${channels} hasAlpha=${m.hasAlpha}`);
  console.log('  corners/edges:',
    'TL',px(10,10),'mid-top',px(Math.floor(width/2),8),
    'sample25',px(25,60),'sample55',px(55,90));
}
