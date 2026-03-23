import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const IMAGE_DIRS = [
  path.join(rootDir, 'public', 'images'),
  path.join(rootDir, 'public', 'assets', 'images', 'techniques'),
  path.join(rootDir, 'public', 'assets', 'images', 'characters'),
];

const EXTENSIONS = ['.png', '.jpg', '.jpeg', '.gif'];

async function optimizeImages() {
  for (const dir of IMAGE_DIRS) {
    if (!fs.existsSync(dir)) {
      console.log(`Directory not found: ${dir}`);
      continue;
    }

    const files = fs.readdirSync(dir);
    for (const file of files) {
      const ext = path.extname(file).toLowerCase();
      if (EXTENSIONS.includes(ext)) {
        const inputPath = path.join(dir, file);
        const fileNameWithoutExt = path.parse(file).name;
        const outputPath = path.join(dir, `${fileNameWithoutExt}.webp`);

        console.log(`Converting: ${file} -> ${fileNameWithoutExt}.webp`);

        try {
          await sharp(inputPath)
            .webp({ quality: 80 })
            .toFile(outputPath);
          
          // Delete old file
          fs.unlinkSync(inputPath);
          console.log(`Deleted: ${file}`);
        } catch (err) {
          console.error(`Error converting ${file}:`, err);
        }
      }
    }
  }
}

async function updateReferences() {
  const SRC_DIR = path.join(rootDir, 'src');
  const PUBLIC_DIR = path.join(rootDir, 'public');
  
  const walk = (dir) => {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach((file) => {
      file = path.join(dir, file);
      const stat = fs.statSync(file);
      if (stat && stat.isDirectory()) {
        results = results.concat(walk(file));
      } else {
        if ([
            '.json', '.tsx', '.ts', '.css', '.html', '.js', '.jsx'
          ].includes(path.extname(file))) {
          results.push(file);
        }
      }
    });
    return results;
  };

  const filesToUpdate = [...walk(SRC_DIR), ...walk(PUBLIC_DIR)];

  for (const filePath of filesToUpdate) {
    let content = fs.readFileSync(filePath, 'utf8');
    let updated = false;

    // Pattern to match common image extensions in strings
    const regex = /\.(png|jpg|jpeg|gif|bmp|tiff)(?=["']| |\)|$)/gi;
    if (regex.test(content)) {
      content = content.replace(regex, '.webp');
      updated = true;
    }

    if (updated) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Updated references in: ${path.relative(rootDir, filePath)}`);
    }
  }
}

async function run() {
  console.log('Starting image optimization...');
  await optimizeImages();
  console.log('Updating references in code...');
  await updateReferences();
  console.log('Done!');
}

run();
