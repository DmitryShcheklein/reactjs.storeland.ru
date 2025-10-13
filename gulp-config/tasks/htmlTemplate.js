import { src } from 'gulp';
import plumber from 'gulp-plumber';
import path from 'path';
import * as glob from 'glob';
import Config from '../const.js';
import html from './htm.js';
import fs from 'fs';

const { FilesExtensions, Paths } = Config;

// Получаем имя файла из пути
function getComponentName(filePath) {
  return path.basename(filePath);
}

// Проверяем, включает ли файл компонент
function fileIncludesComponent(filePath, componentName) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return content.includes(`@@include`) && content.includes(componentName);
  } catch (e) {
    return false;
  }
}

// Ищем все файлы, зависящие от компонента
function findDependentFiles(componentName, checkedFiles = new Set()) {
  const htmlFiles = glob.sync(
    path.join(Paths.htmlTemplate.src, `**/*.${FilesExtensions.Html}`),
  );
  const htmFiles = glob.sync(
    path.join(Paths.htm.src, `**/*.${FilesExtensions.Htm}`),
  );
  const allFiles = [...htmlFiles, ...htmFiles];

  const directDependencies = allFiles.filter((file) => {
    if (checkedFiles.has(file)) {
      return false;
    }
    checkedFiles.add(file);
    const isInclude = fileIncludesComponent(file, componentName);

    return isInclude;
  });

  const result = [...directDependencies];

  // Среди html файлов ищем их шаблонов родителей
  directDependencies
    .filter((file) => file.endsWith(`.${FilesExtensions.Html}`))
    .forEach((file) => {
      const fileName = getComponentName(file);
      const nestedDeps = allFiles.filter((file) =>
        fileIncludesComponent(file, fileName),
      );

      result.push(...nestedDeps);
    });

  return result;
}

async function htmlTemplate(_, filePath) {
  if (!filePath) {
    filePath = Paths.htmlTemplate.build;
    return src(filePath, { allowEmpty: true }).pipe(plumber());
  }

  const componentName = getComponentName(filePath);
  console.log('Changed component:', componentName);

  // Находим все файлы, зависящие от измененного компонента
  const affectedFiles = findDependentFiles(componentName).filter((file) =>
    file.endsWith(`.${FilesExtensions.Htm}`),
  );

  console.log('Affected files:', affectedFiles);

  if (affectedFiles.length === 0) {
    return src(filePath, { allowEmpty: true }).pipe(plumber());
  }

  // Перегенерируем затронутые файлы
  const tasks = affectedFiles.map((file) => html(_, file));
  return Promise.all(tasks);
}

export default htmlTemplate;
