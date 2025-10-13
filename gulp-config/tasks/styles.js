import { src, dest } from 'gulp';
import plumber from 'gulp-plumber';
import autoprefixer from 'gulp-autoprefixer';
import cleancss from 'gulp-clean-css';
import Config from '../const.js';
import { getCleanCssConfig } from '../utils/getCleanCssConfig.js';
import { getAutoprefixerConfig } from '../utils/getAutoprefixerConfig.js';

const { Paths } = Config;

async function styles(_, filePath = '') {
  return src(filePath)
    .pipe(plumber())
    .pipe(autoprefixer(getAutoprefixerConfig()))
    .pipe(cleancss(getCleanCssConfig()))
    .pipe(dest(Paths.styles.dest));
}

export default styles;
