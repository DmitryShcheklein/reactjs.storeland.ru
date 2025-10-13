import chalk from 'chalk';
import { readFile } from 'node:fs/promises';
import Config from '../const.js';
const { Paths } = Config;

export async function getFileIncludeConfig() {
  const defaultConfig = {
    prefix: '@@',
    basepath: '@file',
    context: {},
  };

  try {
    const jsonData = await readFile(
      new URL(`../../${Paths.htmlTemplateJson.default}`, import.meta.url),
      {
        encoding: 'utf-8',
      },
    );
    const DEFAULT_TEMPLATE_VARIABLES = JSON.parse(jsonData);

    return {
      ...defaultConfig,
      context: DEFAULT_TEMPLATE_VARIABLES,
    };
  } catch (error) {
    console.info(
      chalk.yellowBright(`⛔ Ошибка чтения конфигурации: ${error.message}`),
    );
    return defaultConfig;
  }
}
