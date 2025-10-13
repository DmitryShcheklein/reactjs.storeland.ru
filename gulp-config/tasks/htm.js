import { src, dest } from 'gulp';
import fileInclude from 'gulp-file-include';
import plumber from 'gulp-plumber';
import Config from '../const.js';
import { getFileIncludeConfig } from '../utils/getFileIncludeConfig.js';

const { Paths } = Config;

async function html(_, filePath = Paths.htm.default) {
  const fileIncludeConfig = await getFileIncludeConfig();

  return src(filePath, { allowEmpty: true })
    .pipe(plumber())
    .pipe(fileInclude(fileIncludeConfig))
    .pipe(dest(Paths.htm.dest));
}

export default html;
