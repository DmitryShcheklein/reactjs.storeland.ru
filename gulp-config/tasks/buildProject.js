import { src, dest } from 'gulp';
import { deleteSync } from 'del';
import Config from '../const.js';

const { Paths, dirs } = Config;
const { STATIC_DIR, DEFAULT_FOLDER_NAME } = dirs;

async function buildProject() {
  const htmlFilesToMove = [
    `${Paths.htm.dest}/client/**/*.*`,
    `${Paths.htm.dest}/discount/**/*.*`,
  ];
  const streamHtml = src(htmlFilesToMove).pipe(dest(Paths.htm.dest));
  streamHtml.on('end', () => {
    deleteSync([`${Paths.htm.dest}/client/`, `${Paths.htm.dest}/discount/`]);
  });

  const staticFilesToMove = [`${STATIC_DIR}/${DEFAULT_FOLDER_NAME}/**/*.*`];
  const streamStatic = src(staticFilesToMove).pipe(dest(STATIC_DIR));
  streamStatic.on('end', () => {
    deleteSync(`${STATIC_DIR}/${DEFAULT_FOLDER_NAME}`);
  });
}

export default buildProject;
