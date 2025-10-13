import gulp from "gulp";
import {
  browserSyncTask,
  htm,
  scripts,
  images,
  fonts,
  styles,
  icons,
  checkConfig,
  downloadFiles,
  startWatch,
  cleanDir,
} from "./gulp-config/tasks/index.js";
import Config from "./gulp-config/const.js";

const { DIST_DIR, DOWNLOAD_DIR } = Config;
const { parallel, series } = gulp;

const mainTasks = parallel(htm, scripts, images, fonts, styles, icons);
const devTasks = parallel(browserSyncTask, startWatch);

export const build = series(cleanDir.bind(null, `./${DIST_DIR}`), mainTasks);
export const dev = series(checkConfig, devTasks);
export const download = series(
  checkConfig,
  cleanDir.bind(null, `./${DOWNLOAD_DIR}`),
  downloadFiles,
);

export default dev;
