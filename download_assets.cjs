const fs = require('fs');
const https = require('https');
const path = require('path');

const dirs = ['public', 'public/videos', 'public/images', 'public/fonts'];
dirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

const downloads = [
  { url: 'https://assets.codepen.io/3364143/7btrrd.mp4', dest: 'public/videos/technique-bg.mp4' },
  { url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', dest: 'public/videos/malevolent-shrine.mp4' },
  { url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4', dest: 'public/videos/infinite-void.mp4' },
  { url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4', dest: 'public/videos/chimera-shadow-garden.mp4' },
  { url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', dest: 'public/videos/op2.mp4' },
  { url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', dest: 'public/videos/op3.mp4' },
  { url: 'https://picsum.photos/seed/yuji/800/800', dest: 'public/images/yuji.jpg' },
  { url: 'https://picsum.photos/seed/megumi/800/800', dest: 'public/images/megumi.jpg' },
  { url: 'https://picsum.photos/seed/nobara/800/800', dest: 'public/images/nobara.jpg' },
  { url: 'https://picsum.photos/seed/gojo/800/800', dest: 'public/images/gojo.jpg' },
  { url: 'https://picsum.photos/seed/sukuna/800/800', dest: 'public/images/sukuna.jpg' },
  { url: 'https://picsum.photos/seed/cursedwomb/800/800', dest: 'public/images/cursedwomb.jpg' },
  { url: 'https://picsum.photos/seed/kyoto/800/800', dest: 'public/images/kyoto.jpg' },
  { url: 'https://picsum.photos/seed/deathpainting/800/800', dest: 'public/images/deathpainting.jpg' },
  { url: 'https://picsum.photos/seed/shibuya/800/800', dest: 'public/images/shibuya.jpg' },
  { url: 'https://picsum.photos/seed/cullinggame/800/800', dest: 'public/images/cullinggame.jpg' },
  { url: 'https://picsum.photos/seed/limitless/800/800', dest: 'public/images/limitless.jpg' },
  { url: 'https://picsum.photos/seed/tenshadows/800/800', dest: 'public/images/tenshadows.jpg' },
  { url: 'https://picsum.photos/seed/cleave/800/800', dest: 'public/images/cleave.jpg' },
  { url: 'https://picsum.photos/seed/strawdoll/800/800', dest: 'public/images/strawdoll.jpg' },
  { url: 'https://picsum.photos/seed/cursedspeech/800/800', dest: 'public/images/cursedspeech.jpg' }
];

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, response => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        return download(response.headers.location, dest).then(resolve).catch(reject);
      }
      response.pipe(file);
      file.on('finish', () => {
        file.close(resolve);
      });
    }).on('error', err => {
      fs.unlink(dest, () => reject(err));
    });
  });
}

async function run() {
  for (const item of downloads) {
    console.log(`Downloading ${item.url} to ${item.dest}...`);
    try {
      await download(item.url, item.dest);
    } catch (e) {
      console.error(`Failed to download ${item.url}:`, e);
    }
  }
  console.log('Done downloading assets.');
}

run();