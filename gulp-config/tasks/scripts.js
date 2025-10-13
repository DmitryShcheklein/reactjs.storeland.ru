import { src, dest } from 'gulp';
import path from 'node:path';
import Config from '../const.js';
import plumber from 'gulp-plumber';

const {
  Paths,
  dirs: { DEFAULT_FOLDER_NAME },
} = Config;

async function scripts(_, filePath = '') {
  const parentFileFolderName = path.basename(path.dirname(filePath));

  if (parentFileFolderName === DEFAULT_FOLDER_NAME) {
    return src(filePath).pipe(dest(Paths.scripts.dest));
  }

  return src(filePath).pipe(plumber()).pipe(dest(Paths.scripts.dest));
}

export default scripts;
