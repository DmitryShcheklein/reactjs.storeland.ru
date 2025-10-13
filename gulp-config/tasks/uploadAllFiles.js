import uploadFile from './uploadFile.js';
import path from 'path';
import { glob } from 'glob';

async function uploadAllFiles(done) {
  const patterns = [
    'src/html/**/*.{html,htm}',
    '!src/html/**/_*.{html,htm}',
    'src/css/**/*.css',
    'src/js/**/*.js',
    '!src/**/default/**/*',
  ];

  try {
    let files = [];
    for (const pattern of patterns) {
      const matches = await glob(pattern);
      files = [...files, ...matches];
    }

    console.log('Найдены файлы для загрузки:', files);

    if (files.length === 0) {
      console.log('Файлы для загрузки не найдены');
      done();
      return;
    }

    const promises = files.map(async (filePath) => {
      const fileName = path.basename(filePath);
      console.log(`Загрузка файла: ${fileName}`);
      try {
        await uploadFile('upload', filePath);
        console.log(`Файл ${fileName} успешно загружен`);
      } catch (err) {
        console.error(`Ошибка при загрузке файла ${fileName}:`, err);
      }
    });

    await Promise.all(promises);
    console.log('Загрузка всех файлов завершена');
    done();
  } catch (error) {
    console.error('Ошибка при загрузке файлов:', error);
    done(error);
  }
}

export default uploadAllFiles;
