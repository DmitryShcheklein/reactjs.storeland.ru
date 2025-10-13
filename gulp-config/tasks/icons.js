import { src, dest } from 'gulp';
import Config from '../const.js';
import svgSprite from 'gulp-svg-sprite';
import plumber from 'gulp-plumber';
import newer from 'gulp-newer';

const { Paths } = Config;

async function icons() {
  return src(Paths.icons.watch)
    .pipe(plumber())
    .pipe(newer(Paths.icons.dest))
    .pipe(
      svgSprite({
        mode: {
          symbol: {
            dest: '.',
            sprite: 'sprite.svg',
          },
        },
      }),
    )
    .pipe(dest(Paths.icons.dest));
}

export default icons;
