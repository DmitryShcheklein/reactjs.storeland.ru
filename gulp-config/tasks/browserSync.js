import Config from '../const.js';
import bs from 'browser-sync';

const { CURRENT_SITE, PORT } = Config;

const browserSync = bs.create();

function browserSyncTask() {
  browserSync.init({
    notify: false,
    proxy: {
      target: CURRENT_SITE,
      proxyReq: [
        (proxyReq) => {
          proxyReq.setHeader('x-nodejs-editor-version', '1.01');
        },
      ],
    },
    online: true,
    injectChanges: true,
    open: false,
    port: PORT,
  });
}

export { browserSyncTask, browserSync };
