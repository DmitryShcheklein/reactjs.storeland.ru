import { src, dest } from 'gulp';
import Config from '../const.js';
import newer from 'gulp-newer';
import imagemin, { gifsicle, mozjpeg, optipng, svgo } from 'gulp-imagemin';

const { Paths } = Config;

async function images() {
  return src([Paths.images.watch])
    .pipe(newer(Paths.images.dest))
    .pipe(
      imagemin([
        gifsicle({ interlaced: true }),
        mozjpeg({ quality: 95, progressive: true }),
        optipng({ optimizationLevel: 3 }),
        svgo({
          plugins: [{ removeViewBox: true }, { cleanupIDs: false }],
        }),
      ]),
    )
    .pipe(dest(Paths.images.dest));
}

export default images;
