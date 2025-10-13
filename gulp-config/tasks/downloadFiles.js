import Config from '../const.js';
import * as fs from 'node:fs';
import path from 'node:path';
import chalk from 'chalk';
import got from 'got';
import { deleteSync } from 'del';
import minimist from 'minimist';

const {
  SECRET_KEY,
  dirs: { DOWNLOAD_DIR },
  FilesExtensions,
  ApiUrls,
} = Config;

async function downloadFiles() {
  const argv = minimist(process.argv.slice(2));
  const isCodeOnly = argv['code-only'];

  deleteSync(DOWNLOAD_DIR);
  !fs.existsSync(DOWNLOAD_DIR) && fs.mkdirSync(DOWNLOAD_DIR);

  const formData = new globalThis.FormData();
  formData.append('secret_key', SECRET_KEY);

  const OPTIONS = {
    body: formData,
    timeout: { send: 10_000 },
  };

  async function getFiles() {
    const { data } = await got.post(ApiUrls.getList, OPTIONS).json();
    return data
      .map(({ file_id, file_name }) => ({
        file_id: file_id.value,
        file_name: file_name.value,
      }))
      .filter(({ file_name }) => {
        if (!isCodeOnly) return true;

        const fileExt = path.extname(file_name).replace('.', '').toLowerCase();
        const codeFileTypes = [
          ...FilesExtensions.Htm.split(', '),
          ...FilesExtensions.Js.split(', '),
          ...FilesExtensions.Css.split(', '),
        ];
        return codeFileTypes.includes(fileExt);
      });
  }

  async function processFile(file, index, total) {
    const { file_id, file_name } = file;

    try {
      const { data, status, message } = await got
        .post(`${ApiUrls.getFile}/${file_id}`, OPTIONS)
        .json();

      if (status === 'error') {
        console.log(chalk.redBright(`Ошибка загрузки ⛔: ${message}`));
        return;
      }

      const fileExt = path.extname(data.file_name.value).replace('.', '');
      const fileDirName =
        Object.keys(FilesExtensions)
          .find((key) => FilesExtensions[key].includes(fileExt))
          ?.toLowerCase() || '';
      const newDir = `${DOWNLOAD_DIR}/${fileDirName}`;

      await fs.promises.mkdir(newDir, { recursive: true });
      await fs.promises.writeFile(
        `${newDir}/${data.file_name.value}`,
        data.file_content.value,
        'base64',
      );

      return { file_name, index };
    } catch (error) {
      console.error(`Ошибка при обработке файла ${file_name}:`, error);
      return null;
    }
  }

  const files = await getFiles();
  console.log(
    chalk.greenBright(
      `Загружен список всех файлов ✔️\nВсего файлов для загрузки: ${files.length} шт.${
        isCodeOnly ? ' (только код)' : ' (все файлы)'
      }`,
    ),
  );

  let completedCount = 0;
  const results = await Promise.all(
    files.map((file, index) => processFile(file, index, files.length)),
  );

  results
    .filter(Boolean)
    .sort((a, b) => a.index - b.index)
    .forEach(({ file_name }) => {
      completedCount++;
      console.log(
        `Скачан файл ${chalk.greenBright(file_name)}. Всего ${completedCount} из ${files.length}`,
      );
    });

  console.log(`Загрузка завершена. Всего обработано файлов: ${completedCount}`);
}

export default downloadFiles;
