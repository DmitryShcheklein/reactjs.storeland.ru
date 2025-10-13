import Config from '../const.js';
import chalk from 'chalk';
import { validateEnv } from '../utils/validateEnv.js';

const { CURRENT_SITE, SECRET_KEY, PORT, API_BASE_URL } = Config;

async function checkConfig() {
  validateEnv();

  console.log('\n' + chalk.bgGreen.black(' КОНФИГУРАЦИЯ ') + '\n');

  console.log(chalk.gray('Окружение:'));
  console.log(
    `  • NODE_ENV: ${chalk.cyan(process.env.NODE_ENV || 'development')}`,
  );

  console.log(chalk.gray('\nПеременные окружения:'));
  console.log(`  • CURRENT_SITE: ${chalk.cyan(CURRENT_SITE)}`);
  console.log(`  • SECRET_KEY: ${chalk.cyan('*'.repeat(SECRET_KEY.length))}`);
  console.log(`  • PORT: ${chalk.cyan(PORT)}`);
  console.log(`  • API_BASE_URL: ${chalk.cyan(API_BASE_URL)}`);

  if (process.env.DEBUG_MODE) {
    console.log(`  • DEBUG_MODE: ${chalk.cyan(process.env.DEBUG_MODE)}`);
  }

  if (process.env.API_VERSION) {
    console.log(`  • API_VERSION: ${chalk.cyan(process.env.API_VERSION)}`);
  }

  console.log('\n' + chalk.green('✔️  Все проверки пройдены успешно\n'));
}

export default checkConfig;
