import { watch } from 'gulp';
import Config from '../const.js';

const { Paths } = Config;

import {
  fonts,
  scripts,
  styles,
  htmlTemplate,
  htmlTemplateJson,
  htm,
  images,
  icons,
  uploadFile,
} from './index.js';

function startWatch() {
  watch(Paths.styles.watch).on('all', styles);
  watch(Paths.images.watch).on('all', images);
  watch(Paths.icons.watch).on('all', icons);
  watch(Paths.fonts.watch).on('all', fonts);
  watch(Paths.htm.watch).on('all', htm);
  watch(Paths.htmlTemplate.watch).on('all', htmlTemplate);
  watch(Paths.htmlTemplateJson.watch).on('all', htmlTemplateJson);
  watch(Paths.scripts.watch).on('all', scripts);

  watch(Paths.dist).on('all', uploadFile);
}

export default startWatch;
