import sharp from 'sharp';
const files=[
 'C:/Users/usiva/Downloads/1804dad0-1934-4f63-8ef7-32020de07dcb.png',
 'C:/Users/usiva/Downloads/889d04c0-0e58-43c8-b44d-9a2a90704e38.png'
];
for(const f of files){
  try{const m=await sharp(f).metadata();
    console.log(f.split('/').pop(), `${m.width}x${m.height}`, `ratio ${(m.width/m.height).toFixed(2)}`);
  }catch(e){console.log(f.split('/').pop(),'ERR',e.message);}
}
