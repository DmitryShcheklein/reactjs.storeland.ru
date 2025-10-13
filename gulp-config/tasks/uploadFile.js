import path from 'node:path';
import fs from 'node:fs/promises';
import chalk from 'chalk';
import dayjs from 'dayjs';
import Config from '../const.js';
import { browserSync } from './browserSync.js';
import got from 'got';

const { ApiUrls, SECRET_KEY } = Config;

async function retry(fn, retries = 3, delay = 1000) {
  try {
    return await fn();
  } catch (error) {
    if (retries === 0) throw error;
    await new Promise((resolve) => setTimeout(resolve, delay));
    return retry(fn, retries - 1, delay * 2);
  }
}

const uploadFile = async (evt, filePath) => {
  try {
    const fileName = path.basename(filePath);
    const fileHandle = await fs.open(`${filePath}`, 'r+');
    const fileData = await fileHandle.readFile('base64');
    await fileHandle.close();

    const formData = new globalThis.FormData();
    formData.append('secret_key', SECRET_KEY);
    formData.append('form[file_name]', fileName);
    formData.append('form[file_content]', fileData);

    const json = await retry(async () => {
      return got
        .post(ApiUrls.save, {
          body: formData,
          timeout: {
            send: 5000,
          },
        })
        .json();
    });

    if (json.status === `ok`) {
      console.log(
        `[${dayjs().format('HH:mm:ss')}][${evt}] Файл ${chalk.red(
          fileName,
        )} успешно отправлен ${chalk.greenBright('✔️')}`,
      );

      if (fileName.includes('css')) {
        browserSync.reload('*.css');
        return;
      }
      browserSync.reload();
    } else if (json.status === `error`) {
      console.log(
        `Ошибка отправки ⛔ ${fileName}: ${chalk.redBright(json.message)}`,
      );
    }
  } catch (e) {
    console.error('Ошибка загрузки файла:', {
      file: filePath,
      error: e.message,
      stack: e.stack,
    });
  }
};

export default uploadFile;
